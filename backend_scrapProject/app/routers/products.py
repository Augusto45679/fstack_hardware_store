from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Optional

from ..schemas.product import Product, ProductHistory, ProductComparison, GlobalStats, ProductSearchResponse
from ..services.sheets_service import GoogleSheetsService
from ..dependencies import get_sheets_service

router = APIRouter(
    prefix="/products",
    tags=["products"],
)

@router.get("/stats", response_model=GlobalStats)
def get_global_stats(service: GoogleSheetsService = Depends(get_sheets_service)):
    stats = service.get_global_stats()
    if not stats:
        raise HTTPException(status_code=404, detail="Global stats not found")
    return stats

@router.get("/count", response_model=Dict[str, int])
def count_products(service: GoogleSheetsService = Depends(get_sheets_service)):
    count = service.get_product_count()
    return {"total_products": count}

@router.get("/", response_model=List[Product])
def read_products(service: GoogleSheetsService = Depends(get_sheets_service)):
    products = service.get_all_products()
    return products

@router.get("/{product_id}/history", response_model=ProductHistory)
def get_product_history(product_id: str, service: GoogleSheetsService = Depends(get_sheets_service)):
    history = service.get_product_history(product_id)
    if not history:
        raise HTTPException(status_code=404, detail="Product not found")
    return history

@router.get("/{product_id}/compare", response_model=ProductComparison)
def get_product_comparison(product_id: str, service: GoogleSheetsService = Depends(get_sheets_service)):
    comparison = service.get_product_comparison(product_id)
    if not comparison:
        raise HTTPException(status_code=404, detail="Product not found")
    return comparison

@router.get("/search", response_model=ProductSearchResponse)
def search_products(
    q: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    store: Optional[str] = None,
    sort_by: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    service: GoogleSheetsService = Depends(get_sheets_service)
):
    return service.search_products(
        q=q,
        min_price=min_price,
        max_price=max_price,
        store=store,
        sort_by=sort_by,
        page=page,
        limit=limit
    )