from pydantic import BaseModel, HttpUrl
from typing import Optional, List

class Product(BaseModel):
    product_id: int
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
    product_id: int
    product_name: str
    history: List[PriceHistoryItem]

class ProductComparisonItem(BaseModel):
    store: str
    price: int
    link: HttpUrl

class ProductComparison(BaseModel):
    product_id: int
    product_name: str
    comparison: List[ProductComparisonItem]

class GlobalStats(BaseModel):
    total_products: int
    lowest_price: int
    average_price: float
    cheapest_store: str
    most_expensive_store: str