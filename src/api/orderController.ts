import { Request, Response } from 'express';
import { CreateOrderUseCase } from '../../application/use-cases/CreateOrderUseCase';

/**
 * Controlador HTTP Express para la gestión de Pedidos.
 * Expone los endpoints definidos en openapi.yaml para la API REST de PetMarket.
 */
export class OrderController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  /**
   * Endpoint POST /v1/orders - Crea un nuevo pedido validando reglas de dominio.
   */
  public async createOrder(req: Request, res: Response): Promise<Response> {
    const { customerId, items } = req.body;

    const result = await this.createOrderUseCase.execute({
      customerId,
      items
    });

    if (result.isFailure) {
      return res.status(400).json({
        error: result.error
      });
    }

    return res.status(201).json({
      message: 'Pedido creado exitosamente con validación de dominio',
      data: result.getValue()
    });
  }
}
