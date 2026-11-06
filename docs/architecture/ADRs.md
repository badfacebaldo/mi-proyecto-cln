# Architecture Decision Records (ADRs) - PetMarket

## ADR-01: Seleccion del Patron de Logica de Negocio (Domain Model)
- **Estado**: Aceptado
- **Contexto**: PetMarket cuenta con 21 reglas de negocio entrelazadas, reservas de 15 minutos, revalidación pre-cobro, sub-envíos y matriz de permisos por roles.
- **Alternativas**:
  1. *Transaction Script*: Generaría duplicación masiva de código procedural y sobreventa de stock.
  2. *Table Module*: Dificultaría la gestión del ciclo de vida del pedido y sus estados.
  3. *Domain Model*: Encapsula estado y reglas en entidades ricas protegidas por invariantes.
- **Decisión**: Adoptar **Domain Model** como patrón central para el dominio transaccional.
- **Consecuencias**: Beneficios en mantenibilidad y aislamiento total de reglas (RN-01 a RN-21). Requiere mapeos limpios entre DTOs y agregados.

## ADR-02: Control Transaccional con Repositorios y Unit of Work
- **Estado**: Aceptado
- **Contexto**: Operaciones críticas como la confirmación del cobro y asignación de stock deben completarse bajo una transacción atómica "todo o nada".
- **Decisión**: Definir interfaces de repositorio desacopladas en la capa de dominio y manejar la consistencia con el patrón **Unit of Work**.
- **Consecuencias**: Previene discrepancias de inventario y estados inconsistentes ante fallos de red.

## ADR-03: CQRS Basico con Separación de DTOs de Lectura
- **Estado**: Aceptado
- **Contexto**: Alto volumen de consultas de seguimiento por parte de clientes y tableros gerenciales que no deben sobrecargar los agregados de escritura.
- **Decisión**: Implementar **CQRS Básico** (Commands para mutación de datos y Queries que retornan DTOs planos).
- **Consecuencias**: Altas prestaciones en lecturas y desacoplamiento entre la interfaz gráfica y el dominio.
