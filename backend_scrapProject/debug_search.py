import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DATABASE = os.getenv("MONGO_DATABASE", "hardware_db")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION", "products")

async def check_data():
    with open("debug_log.txt", "w", encoding="utf-8") as f:
        f.write("Starting debug script...\n")
        try:
            client = AsyncIOMotorClient(MONGO_URI)
            db = client[MONGO_DATABASE]
            collection = db[MONGO_COLLECTION]

            query = {"product_name": {"$regex": "fuente", "$options": "i"}}
            f.write(f"Querying for: {query}\n")
            
            cursor = collection.find(query)
            count = await collection.count_documents(query)
            f.write(f"Found {count} documents.\n")

            required_fields = [
                "product_id", "product_name", "price_current", 
                "image_url", "store_name", "product_url", "category"
            ]

            async for doc in cursor:
                missing = []
                for field in required_fields:
                    if field not in doc:
                        missing.append(field)
                    elif doc[field] is None:
                        missing.append(f"{field} (is None)")
                
                if missing:
                    f.write(f"INVALID DOCUMENT _id={doc.get('_id')}: Missing/Null fields: {missing}\n")
                    f.write(f"Doc: {doc}\n")
                
                # Check types
                if "price_current" in doc and doc["price_current"] is not None:
                    if not isinstance(doc["price_current"], (int, float)):
                         f.write(f"INVALID TYPE _id={doc.get('_id')}: price_current is {type(doc['price_current'])} value={doc['price_current']}\n")
            
            f.write("Finished checking documents.\n")
        except Exception as e:
            f.write(f"An error occurred: {e}\n")

if __name__ == "__main__":
    asyncio.run(check_data())
