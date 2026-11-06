# Glosario de Dominio (Lenguaje Ubicuo)

- **Agente de Almacén**: Rol operativo encargado del picking y empaque. No puede cancelar ni reasignar origen[cite: 22].
- **Agente de Atención al Cliente**: Responsable de gestionar cancelaciones asistidas pre-tránsito y devoluciones estándar[cite: 22].
- **Almacén de Origen**: Depósito seleccionado automáticamente por el sistema según cercanía y carga[cite: 22].
- **Aggregate Root**: Entidad principal que delimita la frontera de consistencia del dominio (ej. Pedido, Inventario, Devolución)[cite: 34, 35].
- **Existencia Disponible**: Cantidad para venta, calculada como Existencia Física menos Existencia Reservada[cite: 23].
- **Existencia Física**: Inventario real presente en un almacén[cite: 23].
- **Existencia Reservada**: Stock apartado temporalmente por checkouts activos (15 minutos)[cite: 23].
- **Folio de Pedido**: Identificador único utilizado para dar seguimiento a un pedido y sus excepciones[cite: 23].
- **Pedido Padre**: Registro principal que agrupa sub-envíos derivados de una división entre almacenes[cite: 23].
- **Sub-envío**: Envío independiente generado al dividir un pedido por falta de stock unificado, con folio y guía propios[cite: 24].
- **Revisión Antifraude**: Estado de congelamiento operativo aplicable a pedidos superiores a $15,000 MXN[cite: 24].
- **Supervisor de Almacén**: Autoridad para resolver faltantes físicos y ajustar existencia física con motivo registrado[cite: 24].
- **Supervisor de Atención al Cliente**: Autoridad exclusiva para autorizar excepciones fuera de política (cancelaciones en tránsito o devoluciones sin empaque/dañadas)[cite: 24].
