from pydantic import BaseModel, HttpUrl
from typing import Optional, List

class Product(BaseModel):
    product_id: str
    product_name: str
    price: int
    store: str
    link: HttpUrl
    date: Optional[str] = None # Assuming date is a string YYYY-MM-DD for now
    
    class Config:
        from_attributes = True

class PriceHistoryItem(BaseModel):
    date: str
    price: int
    store: str

class ProductHistory(BaseModel):
    product_id: str
    product_name: str
    history: List[PriceHistoryItem]

class ProductComparisonItem(BaseModel):
    store: str
    price: int
    link: HttpUrl

class ProductComparison(BaseModel):
    product_id: str
    product_name: str
    comparison: List[ProductComparisonItem]

class BestPriceProduct(BaseModel):
    product_name: str
    min_price: int
    store: str

class GlobalStats(BaseModel):
    best_prices: List[BestPriceProduct]

class ProductSearchResponse(BaseModel):
    total_results: int
    total_pages: int
    current_page: int
    limit: int
    data: List[Product]