from .database import get_collection

async def get_product_collection():
    return await get_collection()