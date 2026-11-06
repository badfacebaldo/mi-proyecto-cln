import { OrderStateMachine } from '../src/domain/domain/stateMachine';
import { OrderStatus } from '../src/domain/entities';

describe('Pruebas del Ciclo de Vida del Pedido (PetMarket)', () => {
  it('Debe permitir autocancelación por el cliente dentro de las primeras 2 horas', () => {
    const createdAt = new Date(); // Hace 1 hora
    createdAt.setHours(createdAt.getHours() - 1);

    const validation = OrderStateMachine.validateTransitionWithRules(
      OrderStatus.PAGO_CONFIRMADO,
      OrderStatus.CANCELADO,
      'CLIENTE',
      createdAt
    );

    expect(validation.allowed).toBe(true);
  });

  it('Debe rechazar autocancelación por el cliente después de 2 horas (RN-11)', () => {
    const createdAt = new Date(); // Hace 3 horas
    createdAt.setHours(createdAt.getHours() - 3);

    const validation = OrderStateMachine.validateTransitionWithRules(
      OrderStatus.PAGO_CONFIRMADO,
      OrderStatus.CANCELADO,
      'CLIENTE',
      createdAt
    );

    expect(validation.allowed).toBe(false);
    expect(validation.reason).toContain('RN-11');
  });

  it('Debe requerir rol de SUPERVISOR para cancelar un pedido en tránsito (RN-13)', () => {
    const validation = OrderStateMachine.validateTransitionWithRules(
      OrderStatus.EN_TRANSITO,
      OrderStatus.CANCELADO_EXCEPCIONAL,
      'AGENTE',
      new Date()
    );

    expect(validation.allowed).toBe(false);
    expect(validation.reason).toContain('RN-13');
  });
});
