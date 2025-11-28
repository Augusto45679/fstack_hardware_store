# Fullstack Hardware Store Scraper & Comparator

Una aplicación fullstack moderna diseñada para scrapear, almacenar y comparar precios de hardware de computación de múltiples tiendas argentinas (como Compragamer y Mercado Libre). El sistema permite a los usuarios buscar productos, ver historiales de precios y encontrar las mejores ofertas.

## 🚀 Características Principales

- **Scraping Automatizado**: Extracción de datos de productos e imágenes utilizando **Scrapy**.
- **Gestión de Imágenes Inteligente**: Integración con **Cloudinary** para alojamiento de imágenes con detección de duplicados.
- **Búsqueda Avanzada**: API RESTful con soporte para búsqueda por texto, filtros de precio, tienda y paginación.
- **Historial de Precios**: Seguimiento de la evolución de precios a lo largo del tiempo.
- **Comparación de Productos**: Herramientas para comparar el mismo producto entre diferentes vendedores.
- **Interfaz Moderna**: Frontend desarrollado con **Next.js 16** y **Shadcn/UI**, con soporte para modo oscuro y diseño responsivo.

## 🛠 Tech Stack

### Backend (`backend_scrapProject`)
- **Framework**: FastAPI
- **Base de Datos**: MongoDB (Motor driver para async)
- **Procesamiento de Datos**: Pandas
- **Lenguaje**: Python 3.10+

### Frontend (`front_scrapProject`)
- **Framework**: Next.js 16 (App Router)
- **Librería UI**: React 19
- **Estilos**: TailwindCSS
- **Componentes**: Shadcn/UI
- **Gráficos**: Recharts
- **Iconos**: Lucide React

### Scraper
- **Framework**: Scrapy
- **Almacenamiento de Imágenes**: Cloudinary API

## 📋 Prerrequisitos

- Python 3.10 o superior
- Node.js 18 o superior
- MongoDB (corriendo localmente o cluster de Atlas)

## ⚙️ Instalación y Ejecución

### 1. Configuración del Backend

Navega al directorio del backend:
```bash
cd backend_scrapProject
```

Crea un entorno virtual y actívalo:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

Instala las dependencias:
```bash
pip install -r requirements.txt
```

Configura las variables de entorno (crea un archivo `.env` en `backend_scrapProject`):
```env
MONGO_URI=mongodb://localhost:27017
MONGO_DATABASE=hardware_db
MONGO_COLLECTION=products
# Credenciales de Cloudinary (si vas a correr los scrapers)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

Ejecuta el servidor de desarrollo:
```bash
uvicorn app.main:app --reload
```
El backend estará disponible en `http://localhost:8000`.
Documentación interactiva (Swagger UI): `http://localhost:8000/docs`.

### 2. Configuración del Frontend

Navega al directorio del frontend:
```bash
cd front_scrapProject
```

Instala las dependencias:
```bash
npm install
```

Ejecuta el servidor de desarrollo:
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

## 📂 Estructura del Proyecto

```
/
├── backend_scrapProject/    # API FastAPI y lógica de negocio
│   ├── app/                 # Routers, modelos y configuración de DB
│   └── ...
├── front_scrapProject/      # Aplicación Next.js
│   ├── components/          # Componentes UI reutilizables
│   ├── app/                 # Páginas y layouts (App Router)
│   └── ...
└── README.md                # Documentación del proyecto
```

## 🔍 Endpoints Principales

- `GET /products`: Listado paginado de productos.
- `GET /products/search`: Búsqueda con filtros (query, min_price, max_price, store).
- `GET /products/{id}`: Detalles de un producto.
- `GET /products/{id}/history`: Historial de precios.
- `GET /products/stats`: Estadísticas y mejores ofertas.