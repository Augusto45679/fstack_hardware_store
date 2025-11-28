from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List

class Product(BaseModel):
    product_id: str
    product_name: str
    price_current: Optional[int] = None
    price_original: Optional[int] = None
    image_url: Optional[str] = None
    store_name: Optional[str] = None
    product_url: Optional[str] = None
    discount_percentage: Optional[float] = None
    category: Optional[str] = None
    
    class Config:
        from_attributes = True
        populate_by_name = True

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