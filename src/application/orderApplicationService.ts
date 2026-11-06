import { Result } from '../../domain/shared/Result';
import { Order } from '../../domain/entities/Order';
import { CustomerId } from '../../domain/entities/ValueObjects/CustomerId';
import { OrderItem } from '../../domain/entities/ValueObjects/OrderItem';
import { SKU } from '../../domain/entities/ValueObjects/SKU';
import { Money } from '../../domain/entities/ValueObjects/Money';
import { OrderStateMachine, SystemRole } from '../../domain/services/OrderStateMachine';

export interface CreateOrderDTO {
  customerId: string;
  items: { sku: string; quantity: number; unitPrice: number }[];
}

export interface CreateOrderResponseDTO {
  orderId: string;
  status: string;
  totalAmount: number;
}

/**
 * Caso de Uso de Aplicación: Crear Pedido.
 * Orquesta la creación del Agregado Raíz Order validando reglas de negocio (RN-01 a RN-07).
 */
export class CreateOrderUseCase {
  constructor(
    // Inyección de repositorios simulados o reales (OrderRepository, InventoryRepository)
  ) {}

  public async execute(dto: CreateOrderDTO): Promise<Result<CreateOrderResponseDTO>> {
    const customerIdResult = CustomerId.create(dto.customerId);
    if (customerIdResult.isFailure) {
      return Result.fail<CreateOrderResponseDTO>(customerIdResult.error);
    }

    const orderItems: OrderItem[] = [];
    for (const itemDto of dto.items) {
      const skuResult = SKU.create(itemDto.sku);
      if (skuResult.isFailure) {
        return Result.fail<CreateOrderResponseDTO>(skuResult.error);
      }

      const moneyResult = Money.create(itemDto.unitPrice);
      if (moneyResult.isFailure) {
        return Result.fail<CreateOrderResponseDTO>(moneyResult.error);
      }

      const itemResult = OrderItem.create(skuResult.getValue(), itemDto.quantity, moneyResult.getValue());
      if (itemResult.isFailure) {
        return Result.fail<CreateOrderResponseDTO>(itemResult.error);
      }

      orderItems.push(itemResult.getValue());
    }

    // Crear la entidad de dominio con validación de RN-07 (máximo 50 unidades por SKU)
    const orderResult = Order.create(customerIdResult.getValue(), orderItems);
    if (orderResult.isFailure) {
      return Result.fail<CreateOrderResponseDTO>(orderResult.error);
    }

    const order = orderResult.getValue();

    // Aquí se persistiría el pedido en el repositorio de base de datos
    // await this.orderRepository.save(order);

    return Result.ok<CreateOrderResponseDTO>({
      orderId: order.id.toString(),
      status: order.status,
      totalAmount: order.totalAmount.amount
    });
  }
}
