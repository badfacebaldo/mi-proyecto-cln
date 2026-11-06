import { Result } from '../domain/shared/Result';
import { Order } from '../domain/entities';
import { OrderStateMachine } from '../domain/domain/stateMachine';

export class OrderApplicationService {
  public async processOrderCreation(customerId: string, items: any[]): Promise<Result<any>> {
    // Orquestación completa del caso de uso de pedidos
    const orderResult = Order.create(customerId, items);
    if (orderResult.isFailure) {
      return Result.fail(orderResult.error);
    }
    
    const order = orderResult.getValue();
    return Result.ok({
      orderId: order.id,
      status: order.status,
      total: order.totalAmount
    });
  }

  public async transitionOrderStatus(orderId: string, targetStatus: any, role: any, createdAt: Date): Promise<Result<void>> {
    const validation = OrderStateMachine.validateTransitionWithRules(
      orderId as any,
      targetStatus,
      role,
      createdAt
    );

    if (!validation.allowed) {
      return Result.fail(validation.reason || 'Transición no permitida');
    }

    return Result.ok();
  }
}
