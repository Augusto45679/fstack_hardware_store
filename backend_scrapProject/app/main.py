from fastapi import FastAPI
from .routers import products

app = FastAPI(
    title="Hardware Prices API",
    description="API para consultar precios de hardware obtenidos por web scraping.",
    version="1.0.0",
)

app.include_router(products.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Precios de Hardware"}