from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Optional
from motor.motor_asyncio import AsyncIOMotorCollection
from pymongo import DESCENDING, ASCENDING

from ..schemas.product import Product, ProductHistory, ProductComparison, GlobalStats, ProductSearchResponse, BestPriceProduct, PriceHistoryItem, ProductComparisonItem
from ..dependencies import get_product_collection

router = APIRouter(
    prefix="/products",
    tags=["products"],
)

@router.get("/stats", response_model=GlobalStats)
async def get_global_stats(collection: AsyncIOMotorCollection = Depends(get_product_collection)):
    # Example: Get best prices (lowest price per product name across stores)
    pipeline = [
        {"$sort": {"price_current": 1}},
        {"$group": {
            "_id": "$product_name",
            "min_price": {"$first": "$price_current"},
            "store": {"$first": "$store_name"}
        }},
        {"$limit": 10} # Limit to top 10 for now
    ]
    
    best_prices = []
    async for doc in collection.aggregate(pipeline):
        best_prices.append(BestPriceProduct(
            product_name=doc["_id"],
            min_price=doc["min_price"],
            store=doc["store"]
        ))
        
    return GlobalStats(best_prices=best_prices)

@router.get("/count", response_model=Dict[str, int])
async def count_products(collection: AsyncIOMotorCollection = Depends(get_product_collection)):
    count = await collection.count_documents({})
    return {"total_products": count}

@router.get("/", response_model=List[Product])
async def read_products(
    skip: int = 0, 
    limit: int = 20, 
    collection: AsyncIOMotorCollection = Depends(get_product_collection)
):
    cursor = collection.find({}).skip(skip).limit(limit)
    products = await cursor.to_list(length=limit)
    return products

@router.get("/{product_id}/history", response_model=ProductHistory)
async def get_product_history(product_id: str, collection: AsyncIOMotorCollection = Depends(get_product_collection)):
    # For now, we might not have historical data in the 'products' collection as it might be just current state.
    # If the scraper stores history in a separate collection or embedded, we'd query that.
    # Assuming for now we just return the current product as a single history point or if there's a history field.
    # The user mentioned "price_original" and "price_current".
    
    product = await collection.find_one({"product_id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Mocking history from current data for now, or if scraper saves history elsewhere.
    # The user didn't specify a history collection.
    # We'll just return the current price as a history item.
    history_item = PriceHistoryItem(
        date="Today", # We should probably store date in DB
        price=product["price_current"],
        store=product["store_name"]
    )
    
    return ProductHistory(
        product_id=product["product_id"],
        product_name=product["product_name"],
        history=[history_item]
    )

@router.get("/{product_id}/compare", response_model=ProductComparison)
async def get_product_comparison(product_id: str, collection: AsyncIOMotorCollection = Depends(get_product_collection)):
    # Find the product to get the name
    product = await collection.find_one({"product_id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Find all products with the same name
    cursor = collection.find({"product_name": product["product_name"]})
    comparison_items = []
    async for doc in cursor:
        comparison_items.append(ProductComparisonItem(
            store=doc["store_name"],
            price=doc["price_current"],
            link=doc["product_url"]
        ))
        
    return ProductComparison(
        product_id=product["product_id"],
        product_name=product["product_name"],
        comparison=comparison_items
    )


@router.get("/search", response_model=ProductSearchResponse)
async def search_products(
    q: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    store: Optional[str] = None,
    sort_by: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    collection: AsyncIOMotorCollection = Depends(get_product_collection)
):
    # 1. Match Stage (Filtering)
    match_stage = {}
    if q:
        match_stage["product_name"] = {"$regex": q, "$options": "i"}
    if min_price is not None:
        match_stage["price_current"] = {"$gte": min_price}
    if max_price is not None:
        if "price_current" in match_stage:
            match_stage["price_current"]["$lte"] = max_price
        else:
            match_stage["price_current"] = {"$lte": max_price}
    if store:
        match_stage["store_name"] = store

    pipeline = []
    if match_stage:
        pipeline.append({"$match": match_stage})

    # 2. Sort Stage (Pre-sorting for grouping)
    # We sort BEFORE grouping so that $first in $group picks the "best" item (e.g. lowest price)
    sort_stage = {}
    if sort_by == "price_desc":
        sort_stage["price_current"] = DESCENDING
    elif sort_by == "date_desc":
        sort_stage["_id"] = DESCENDING # Assuming _id correlates with time, or use a date field if available
    else: # price_asc or default
        sort_stage["price_current"] = ASCENDING
    
    pipeline.append({"$sort": sort_stage})

    # 3. Group Stage (Deduplication)
    # Group by product_name to remove duplicates. Keep the first doc (best match due to sort).
    pipeline.append({
        "$group": {
            "_id": "$product_name",
            "doc": {"$first": "$$ROOT"}
        }
    })

    # 4. Replace Root (Restore original document structure)
    pipeline.append({"$replaceRoot": {"newRoot": "$doc"}})

    # 5. Facet Stage (Pagination & Counting)
    # Get total count of UNIQUE products and the paginated data in one go
    pipeline.append({
        "$facet": {
            "metadata": [{"$count": "total"}],
            "data": [{"$skip": (page - 1) * limit}, {"$limit": limit}]
        }
    })

    # Execute Aggregation
    result = await collection.aggregate(pipeline).to_list(length=1)
    
    # Parse Results
    if result:
        facet_data = result[0]
        products = facet_data["data"]
        total_results = facet_data["metadata"][0]["total"] if facet_data["metadata"] else 0
    else:
        products = []
        total_results = 0
    
    total_pages = (total_results + limit - 1) // limit
    
    return ProductSearchResponse(
        total_results=total_results,
        total_pages=total_pages,
        current_page=page,
        limit=limit,
        data=products
    )
