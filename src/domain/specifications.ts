import { Entity } from '../shared/Entity';
import { Result } from '../shared/Result';
import { InventoryId } from './ValueObjects/InventoryId';
import { SKU } from './ValueObjects/SKU';
import { WarehouseId } from './ValueObjects/WarehouseId';

interface InventoryProps {
  sku: SKU;
  warehouseId: WarehouseId;
  physicalStock: number;
  reservedStock: number;
  updatedAt: Date;
}

/**
 * Entidad/Agregado de Inventario por Almacén.
 * Controla existencias físicas, reservas temporales (RN-04) y discrepancias (RN-15).
 * Fórmula: Existencia Disponible = Physical - Reserved
 */
export class Inventory extends Entity<InventoryProps, InventoryId> {
  private constructor(props: InventoryProps, id?: InventoryId) {
    super(props, id);
  }

  get sku(): SKU { return this.props.sku; }
  get warehouseId(): WarehouseId { return this.props.warehouseId; }
  get physicalStock(): number { return this.props.physicalStock; }
  get reservedStock(): number { return this.props.reservedStock; }
  get availableStock(): number {
    return Math.max(0, this.props.physicalStock - this.props.reservedStock);
  }
  get updatedAt(): Date { return this.props.updatedAt; }

  public static create(
    sku: SKU,
    warehouseId: WarehouseId,
    physicalStock: number
  ): Result<Inventory> {
    if (physicalStock < 0) {
      return Result.fail<Inventory>('La existencia física no puede ser negativa.');
    }

    const inventory = new Inventory({
      sku,
      warehouseId,
      physicalStock,
      reservedStock: 0,
      updatedAt: new Date()
    });

    return Result.ok<Inventory>(inventory);
  }

  /**
   * Reserva temporalmente inventario durante el checkout (RN-04).
   */
  public reserve(quantity: number): Result<void> {
    if (quantity <= 0) {
      return Result.fail('La cantidad a reservar debe ser mayor a cero.');
    }

    if (this.availableStock < quantity) {
      return Result.fail(`Existencia insuficiente para reservar ${quantity} unidades del SKU ${this.props.sku.value}.`);
    }

    this.props.reservedStock += quantity;
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  /**
   * Libera una reserva expirada (RN-10) o tras cancelación.
   */
  public releaseReservation(quantity: number): Result<void> {
    if (quantity <= 0) {
      return Result.fail('La cantidad a liberar debe ser mayor a cero.');
    }

    this.props.reservedStock = Math.max(0, this.props.reservedStock - quantity);
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  /**
   * Descuenta stock físico y reservado al confirmarse el despacho/pago.
   */
  public deductOnFulfillment(quantity: number): Result<void> {
    if (this.props.physicalStock < quantity) {
      return Result.fail('No se puede despachar más producto del existente físicamente.');
    }

    this.props.physicalStock -= quantity;
    this.props.reservedStock = Math.max(0, this.props.reservedStock - quantity);
    this.props.updatedAt = new Date();
    return Result.ok();
  }

  /**
   * Ajuste por incidencia de faltante físico (RN-15).
   */
  public reportDiscrepancy(actualPhysicalCount: number): void {
    this.props.physicalStock = Math.max(0, actualPhysicalCount);
    this.props.updatedAt = new Date();
  }
}
