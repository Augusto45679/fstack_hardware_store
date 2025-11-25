from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict

from ..schemas.product import Product, ProductHistory, ProductComparison, GlobalStats
from ..services.sheets_service import GoogleSheetsService
from ..dependencies import get_sheets_service

router = APIRouter(
    prefix="/products",
    tags=["products"],
)

@router.get("/stats", response_model=GlobalStats)
def get_global_stats(service: GoogleSheetsService = Depends(get_sheets_service)):
    return service.get_global_stats()

@router.get("/count", response_model=Dict[str, int])
def count_products(service: GoogleSheetsService = Depends(get_sheets_service)):
    count = service.get_product_count()
    return {"total_products": count}

@router.get("/", response_model=List[Product])
def read_products(service: GoogleSheetsService = Depends(get_sheets_service)):
    products = service.get_all_products()
    return products

@router.get("/{product_id}/history", response_model=ProductHistory)
def get_product_history(product_id: int, service: GoogleSheetsService = Depends(get_sheets_service)):
    history = service.get_product_history(product_id)
    if not history:
        raise HTTPException(status_code=404, detail="Product not found")
    return history

@router.get("/{product_id}/compare", response_model=ProductComparison)
def get_product_comparison(product_id: int, service: GoogleSheetsService = Depends(get_sheets_service)):
    comparison = service.get_product_comparison(product_id)
    if not comparison:
        raise HTTPException(status_code=404, detail="Product not found")
    return comparison