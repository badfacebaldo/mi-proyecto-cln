# User Stories & Criterios de Aceptación (Gherkin) - PetMarket

Las User Stories traducen las reglas de negocio fijadas en unidades de trabajo accionables[cite: 65].

## Matriz de Trazabilidad
| ID | Rol | Historia (resumen) | Regla de negocio / referencia |
|---|---|---|---|
| US-01 | Cliente | El carrito no reserva inventario ni genera pedido[cite: 66] | RN-01[cite: 66] |
| US-02 | Cliente | Reserva de stock de 15 minutos en checkout[cite: 66] | RN-04[cite: 66] |
| US-03 | Sistema (Pagos) | Revalidación de stock antes de confirmar el pago[cite: 66] | RN-05[cite: 66] |
| US-04 | Cliente | Opciones ante producto agotado durante checkout[cite: 66] | RN-06[cite: 66] |
| US-05 | Cliente | Límite de 50 unidades por SKU por pedido[cite: 66] | RN-07[cite: 66] |
| US-06 | Cliente | 3 intentos de pago en 15 minutos[cite: 66] | RN-08[cite: 66] |
| US-07 | Pagos / Riesgo | Revisión antifraude en pedidos > $15,000 MXN[cite: 66] | RN-09[cite: 66] |
| US-08 | Sistema | Cancelación automática por pago no confirmado[cite: 66] | RN-10[cite: 66] |
| US-09 | Cliente | Cancelación libre dentro de 2 horas[cite: 66] | RN-11[cite: 66] |
| US-10 | Agente de Atención al Cliente | Cancelación asistida antes de "En tránsito"[cite: 66, 67] | RN-12[cite: 67] |
| US-11 | Supervisor de Atención al Cliente | Excepción de cancelación tras "En tránsito"[cite: 68] | RN-13[cite: 68] |
| US-12 | Sistema | Asignación automática de almacén de origen[cite: 68] | RN-14[cite: 68] |
| US-13 | Supervisor de Almacén | Resolución de incidencia de faltante físico[cite: 68] | RN-15[cite: 68] |
| US-14 | Cliente | Visibilidad de sub-envíos en pedido dividido[cite: 68] | RN-16[cite: 68] |
| US-15 | Cliente | Reprogramación o reembolso tras entrega fallida[cite: 68] | RN-17/RN-18[cite: 68] |
| US-16 | Cliente | Devolución inmediata por rechazo de paquete[cite: 68] | RN-19[cite: 68] |
| US-17 | Agente de Atención al Cliente | Devolución estándar dentro de política[cite: 68] | RN-20[cite: 68] |
| US-18 | Supervisor de Atención al Cliente | Devolución excepcional con evidencia[cite: 68] | RN-21[cite: 68] |
| US-19 | Cliente | Estatus de pedido visible sin llamar a soporte[cite: 68] | Necesidad de negocio #4 / Sección 10[cite: 68] |
| US-20 | Gerente de Operaciones | Reporte diario de discrepancia de inventario[cite: 68] | Sección 10 / Objetivo 1[cite: 68] |
| US-21 | Gerente de Operaciones | Reportes mensuales de KPIs operativos[cite: 68] | Sección 10 / Objetivos 2 y 3[cite: 68] |

## Checkout e Inventario

### US-01: Carrito como intención de compra
**Como** Cliente, quiero que agregar productos al carrito no genere un pedido ni reserve inventario, para poder explorar y comparar productos sin comprometer existencia real hasta que decida pagar.  
**Trazabilidad**: RN-01  
**Criterios de aceptación**:  
```gherkin
Escenario: Agregar productos al carrito no afecta el inventario
  Dado un producto con 10 unidades de existencia disponible[cite: 69]
  Cuando el cliente agrega 3 unidades de ese producto a su carrito[cite: 69]
  Y No inicia el proceso de checkout[cite: 69]
  Entonces la existencia disponible del producto se mantiene en 10 unidades[cite: 69]
  Y No se crea ningún pedido en el sistema[cite: 69]
