from pydantic import BaseModel, HttpUrl
from typing import Optional

class Product(BaseModel):
    product_id: int
    product_name: str
    price: int
    store: str
    link: HttpUrl
    
    class Config:
        from_attributes = True