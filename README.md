# Fullstack Hardware Store Scraper & Comparator

Este proyecto es una aplicación fullstack diseñada para scrapear, almacenar y comparar precios de productos de ferretería de diferentes tiendas. El objetivo es proporcionar una herramienta para analizar variaciones de precios y encontrar las mejores ofertas.

## Estado Actual del Proyecto

El proyecto se encuentra en desarrollo activo. A continuación se detalla lo que se ha implementado hasta el momento:

### Arquitectura

El sistema se divide en dos componentes principales:

1.  **Backend (`backend_scrapProject`)**:
    *   Construido con **FastAPI**.
    *   Actúa como la API RESTful que sirve los datos al frontend.
    *   **Integración con Google Sheets**: Utiliza Google Sheets como base de datos principal para persistir la información de los productos scrapeados.
    *   **Endpoints Implementados**:
        *   `GET /products`: Listado de productos con paginación.
        *   `GET /products/search`: Búsqueda avanzada de productos por texto, filtros de precio y tienda.
        *   `GET /products/{product_id}`: Detalles de un producto específico.
        *   `GET /products/{product_id}/history`: Historial de precios de un producto para análisis temporal.
        *   `GET /products/{product_id}/compare`: Comparación de precios del mismo producto en diferentes tiendas.
        *   `GET /products/stats`: Estadísticas globales (ej. mejores precios).
    *   **Lógica de Negocio**: Normalización de datos, manejo de errores robusto y validación con Pydantic.

2.  **Frontend (`front_scrapProject`)**:
    *   Construido con **Next.js**.
    *   (En desarrollo) Interfaz de usuario para visualizar los productos, realizar búsquedas y ver gráficas de historial de precios.

### Características Principales

*   **Scraping y Datos**: (Mencionar aquí si el scraper está integrado o es un proceso separado, por ahora asumimos que alimenta la hoja de cálculo).
*   **Comparación de Precios**: Lógica para identificar el mismo producto en diferentes fuentes y comparar sus costos.
*   **Historial**: Seguimiento de la evolución de precios en el tiempo.
*   **API Documentada**: Acceso a la documentación automática de la API vía Swagger UI (`/docs`) al ejecutar el backend.

## Cómo Ejecutar

### Backend

1.  Navegar a `backend_scrapProject`.
2.  Instalar dependencias: `pip install -r requirements.txt`.
3.  Ejecutar el servidor:
    ```bash
    uvicorn app.main:app --reload
    ```

### Frontend

1.  Navegar a `front_scrapProject`.
2.  Instalar dependencias: `npm install`.
3.  Ejecutar el servidor de desarrollo:
    ```bash
    npm run dev
    ```

## Próximos Pasos

*   Finalizar la implementación de la interfaz de usuario en Next.js.
*   Refinar los scrapers para mayor cobertura de tiendas.
*   Mejorar la visualización de datos (gráficos de historial).
*   Implementar autenticación de usuarios (si aplica).