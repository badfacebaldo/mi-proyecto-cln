import { Entity } from '../shared/Entity';
import { Result } from '../shared/Result';
import { OrderId } from './ValueObjects/OrderId';
import { CustomerId } from './ValueObjects/CustomerId';
import { OrderItem } from './ValueObjects/OrderItem';
import { OrderStatus } from './ValueObjects/OrderStatus';
import { Money } from './ValueObjects/Money';
import { OrderCreatedEvent } from '../events/OrderCreatedEvent';
import { OrderCancelledEvent } from '../events/OrderCancelledEvent';

interface OrderProps {
  customerId: CustomerId;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: Money;
  createdAt: Date;
  updatedAt: Date;
  warehouseId?: string;
  isSplit: boolean;
  paymentAttempts: number;
}

/**
 * Agregado Raíz que representa un Pedido Padre en PetMarket.
 * Encapsula las reglas de negocio RN-01 a RN-13.
 */
export class Order extends Entity<OrderProps, OrderId> {
  private constructor(props: OrderProps, id?: OrderId) {
    super(props, id);
  }

  get customerId(): CustomerId { return this.props.customerId; }
  get items(): OrderItem[] { return [...this.props.items]; }
  get status(): OrderStatus { return this.props.status; }
  get totalAmount(): Money { return this.props.totalAmount; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
  get warehouseId(): string | undefined { return this.props.warehouseId; }
  get isSplit(): boolean { return this.props.isSplit; }
  get paymentAttempts(): number { return this.props.paymentAttempts; }

  /**
   * Fabrica y valida la creación de un nuevo pedido (RN-01, RN-07).
   */
  public static create(
    customerId: CustomerId,
    items: OrderItem[]
  ): Result<Order> {
    if (!items || items.length === 0) {
      return Result.fail<Order>('Un pedido debe contener al menos un producto.');
    }

    // RN-07: Máximo 50 unidades por SKU por pedido
    for (const item of items) {
      if (item.quantity > 50) {
        return Result.fail<Order>(
          `El SKU ${item.sku.value} excede el límite permitido de 50 unidades (RN-07).`
        );
      }
    }

    const totalAmount = items.reduce(
      (sum, item) => sum.add(item.subtotal),
      Money.zero()
    );

    const order = new Order({
      customerId,
      items,
      status: OrderStatus.PENDIENTE_PAGO,
      totalAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
      isSplit: false,
      paymentAttempts: 0
    });

    order.addDomainEvent(new OrderCreatedEvent(order));
    return Result.ok<Order>(order);
  }

  /**
   * Procesa la confirmación de pago y valida filtro antifraude (RN-08, RN-09).
   */
  public confirmPayment(amountPaid: Money): Result<void> {
    if (this.props.status !== OrderStatus.PENDIENTE_PAGO) {
      return Result.fail('Solo se puede pagar un pedido en estatus PENDIENTE_PAGO.');
    }

    this.props.paymentAttempts += 1;

    // RN-08: Máximo 3 intentos de pago
    if (this.props.paymentAttempts > 3) {
      this.props.status = OrderStatus.CANCELADO_PAGO_EXPIRADO;
      return Result.fail('Se ha excedido el límite de 3 intentos de pago (RN-08). Pedido cancelado.');
    }

    if (!amountPaid.equals(this.props.totalAmount)) {
      return Result.fail('El monto pagado no coincide con el total del pedido.');
    }

    // RN-09: Pedidos mayores a $15,000 MXN pasan a revisión antifraude manual
    if (this.props.totalAmount.amount > 15000) {
      this.props.status = OrderStatus.EN_REVISION_ANTIFRAUDE;
    } else {
      this.props.status = OrderStatus.PAGO_CONFIRMADO;
    }

    this.props.updatedAt = new Date();
    return Result.ok();
  }

  /**
   * Evalúa y ejecuta la cancelación según el tiempo transcurrido y rol (RN-11, RN-12, RN-13).
   */
  public cancel(requestedByRole: 'CLIENTE' | 'AGENTE' | 'SUPERVISOR', reason: string): Result<void> {
    const now = new Date();
    const hoursElapsed = (now.getTime() - this.props.createdAt.getTime()) / (1000 * 60 * 60);

    // RN-13: Post "En Tránsito" prohibido salvo aprobación de Supervisor
    if (this.props.status === OrderStatus.EN_TRANSITO) {
      if (requestedByRole !== 'SUPERVISOR') {
        return Result.fail('Cancelación rechazada. Un pedido en tránsito solo puede ser cancelado por un Supervisor (RN-13).');
      }
    }

    // RN-11: Cliente solo puede autocancelar en <= 2 horas
    if (requestedByRole === 'CLIENTE') {
      if (hoursElapsed > 2) {
        return Result.fail('El plazo de autocancelación libre (2 horas) ha expirado (RN-11). Contacte a Atención al Cliente.');
      }
    }

    this.props.status = OrderStatus.CANCELADO;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new OrderCancelledEvent(this.id, reason, requestedByRole));
    
    return Result.ok();
  }
}
