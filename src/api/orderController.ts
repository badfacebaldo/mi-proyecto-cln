import { Request, Response } from 'express';
import { OrderApplicationService } from '../application/orderApplicationService';

export class OrderController {
  constructor(private readonly appService: OrderApplicationService) {}

  public async create(req: Request, res: Response): Promise<Response> {
    const { customerId, items } = req.body;
    const result = await this.appService.processOrderCreation(customerId, items);

    if (result.isFailure) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json({ message: 'Pedido creado exitosamente', data: result.getValue() });
  }

  public async cancel(req: Request, res: Response): Promise<Response> {
    const { orderId } = req.params;
    const { role, reason } = req.body;

    const result = await this.appService.transitionOrderStatus(orderId, 'CANCELADO', role, new Date());
    if (result.isFailure) {
      return res.status(403).json({ error: result.error });
    }

    return res.status(200).json({ message: 'Pedido cancelado correctamente' });
  }
}
