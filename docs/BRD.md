# Business Requirements Document (BRD) - PetMarket

## 1. Resumen Ejecutivo y Problemas
PetMarket busca reducir la discrepancia de inventario de ~15% a <2%, disminuir un 60% las llamadas de "¿dónde está mi pedido?" y automatizar el 70% de cancelaciones/devoluciones dentro de política.

## 2. Reglas de Negocio Principales (RN)
- **RN-01 a RN-03**: El proceso inicia tras confirmar pago y cierra 5 días hábiles después de "Entregado".
- **RN-04**: Reserva de inventario de 15 minutos en checkout.
- **RN-05**: Revalidación obligatoria de stock antes de procesar cobro.
- **RN-06**: Opciones ante producto agotado (eliminar, esperar restock, sustituir con confirmación explícita).
- **RN-07**: Límite estricto de 50 unidades por SKU por pedido.
- **RN-08**: Máximo 3 intentos de pago en 15 minutos.
- **RN-09**: Pedidos > $15,000 MXN pasan automáticamente a revisión antifraude manual (máximo 24h).
- **RN-11 a RN-13**: Cancelación libre <2h; asistida por agente antes de "En tránsito"; excepción por supervisor si está "En tránsito".
- **RN-14 a RN-16**: Asignación automática por cercanía y carga. División automática en sub-envíos si ningún almacén cubre 100%.
- **RN-20 a RN-21**: Devolución estándar en 5 días hábiles con producto sin usar. Devoluciones excepcionales requieren evidencia fotográfica y aprobación del Supervisor.
