import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DATABASE = os.getenv("MONGO_DATABASE", "hardware_db")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION", "products")

client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DATABASE]
collection = db[MONGO_COLLECTION]

async def get_database():
    return db

async def get_collection():
    return collection
