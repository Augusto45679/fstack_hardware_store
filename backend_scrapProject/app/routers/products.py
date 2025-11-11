from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict

from ..schemas.product import Product
from ..services.sheets_service import GoogleSheetsService
from ..dependencies import get_sheets_service

router = APIRouter(
    prefix="/products",
    tags=["products"],
)

@router.get("/count", response_model=Dict[str, int])
def count_products(service: GoogleSheetsService = Depends(get_sheets_service)):
    count = service.get_product_count()
    return {"total_products": count}

@router.get("/", response_model=List[Product])
def read_products(service: GoogleSheetsService = Depends(get_sheets_service)):
    products = service.get_all_products()
    return products