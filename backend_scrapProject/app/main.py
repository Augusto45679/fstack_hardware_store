from fastapi import FastAPI
from .routers import products

app = FastAPI(
    title="Hardware Prices API",
    description="API para consultar precios de hardware obtenidos por web scraping.",
    version="1.0.0",
)

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Precios de Hardware"}