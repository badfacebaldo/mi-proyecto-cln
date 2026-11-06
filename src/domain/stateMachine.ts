import { OrderStatus } from '../entities/ValueObjects/OrderStatus';

/**
 * Roles del sistema para la gestión del ciclo de vida del pedido.
 */
export type SystemRole = 'CLIENTE' | 'AGENTE' | 'SUPERVISOR' | 'SISTEMA';

/**
 * Matriz estricta de transiciones de estado del pedido (StateMachine).
 * Mapea y valida las Reglas de Negocio RN-01 a RN-21.
 */
export class OrderStateMachine {
  private static readonly ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDIENTE_PAGO]: [
      OrderStatus.PAGO_CONFIRMADO,
      OrderStatus.EN_REVISION_ANTIFRAUDE,
      OrderStatus.CANCELADO_PAGO_EXPIRADO,
      OrderStatus.CANCELADO
    ],
    [OrderStatus.EN_REVISION_ANTIFRAUDE]: [
      OrderStatus.PAGO_CONFIRMADO,
      OrderStatus.CANCELADO
    ],
    [OrderStatus.PAGO_CONFIRMADO]: [
      OrderStatus.EN_PREPARACION,
      OrderStatus.CANCELADO
    ],
    [OrderStatus.EN_PREPARACION]: [
      OrderStatus.EN_TRANSITO,
      OrderStatus.CANCELADO
    ],
    [OrderStatus.EN_TRANSITO]: [
      OrderStatus.ENTREGADO,
      OrderStatus.CANCELADO_EXCEPCIONAL,
      OrderStatus.DEVOLUCION_INMEDIATA_RECHAZO
    ],
    [OrderStatus.ENTREGADO]: [
      OrderStatus.EN_PROCESO_DEVOLUCION,
      OrderStatus.FINALIZADO_EXITOSO
    ],
    [OrderStatus.CANCELADO_PAGO_EXPIRADO]: [],
    [OrderStatus.CANCELADO]: [],
    [OrderStatus.CANCELADO_EXCEPCIONAL]: [],
    [OrderStatus.DEVOLUCION_INMEDIATA_RECHAZO]: [],
    [OrderStatus.EN_PROCESO_DEVOLUCION]: [
      OrderStatus.DEVOLUCION_COMPLETADA
    ],
    [OrderStatus.DEVOLUCION_COMPLETADA]: [],
    [OrderStatus.FINALIZADO_EXITOSO]: []
  };

  /**
   * Determina si un cambio de estado es válido conceptualmente en el grafo de estados.
   */
  public static canTransition(currentStatus: OrderStatus, nextStatus: OrderStatus): boolean {
    const validNextStatuses = this.ALLOWED_TRANSITIONS[currentStatus] || [];
    return validNextStatuses.includes(nextStatus);
  }

  /**
   * Evalúa si una transición específica está permitida según el rol y el tiempo transcurrido (RN-11, RN-12, RN-13).
   */
  public static validateTransitionWithRules(
    currentStatus: OrderStatus,
    targetStatus: OrderStatus,
    role: SystemRole,
    createdAt: Date
  ): { allowed: boolean; reason?: string } {
    if (!this.canTransition(currentStatus, targetStatus)) {
      return {
        allowed: false,
        reason: `Transición no permitida de ${currentStatus} a ${targetStatus}.`
      };
    }

    const now = new Date();
    const hoursElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    // Cancelaciones desde EN_TRANSITO solo por Supervisor (RN-13)
    if (currentStatus === OrderStatus.EN_TRANSITO && targetStatus === OrderStatus.CANCELADO_EXCEPCIONAL) {
      if (role !== 'SUPERVISOR') {
        return {
          allowed: false,
          reason: 'RN-13: La cancelación post-tránsito requiere autorización explícita de un Supervisor.'
        };
      }
    }

    // Autocancelación por cliente solo <= 2 horas (RN-11)
    if (role === 'CLIENTE' && targetStatus === OrderStatus.CANCELADO) {
      if (hoursElapsed > 2) {
        return {
          allowed: false,
          reason: 'RN-11: La ventana de autocancelación libre de 2 horas ha expirado.'
        };
      }
    }

    return { allowed: true };
  }
}
