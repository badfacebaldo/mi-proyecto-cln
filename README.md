# PetMarket

Sistema backend desarrollado bajo arquitectura limpia y **Domain-Driven Design (DDD)** para el proyecto integrador de la carrera de Ingeniería en Tecnologías de Software.

## Características Principales
* **Gestión Transaccional de Inventario**: Reserva temporal por 15 minutos en checkout (RN-04) y revalidación pre-pago (RN-05).
* **Control de Envíos Multialmacén**: Asignación automática por cercanía (RN-14) y división inteligente de pedidos sin costo extra de flete (RN-16).
* **Matriz de Cancelaciones y Devoluciones**: Autocancelación por cliente (RN-11), gestión asistida por agentes (RN-12) y excepciones por supervisor post-tránsito (RN-13).

## Requisitos Previos
* Node.js v18+ y npm
* Docker y Docker Compose (opcional para levantar base de datos MySQL)

## Instalación y Ejecución Local
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
