import asyncio
import httpx
from pprint import pprint

BASE_URL = "http://127.0.0.1:8000"

async def test_pagination():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        # Fetch page 1
        print("Fetching page 1...")
        response1 = await client.get("/products/search", params={"page": 1, "limit": 5})
        if response1.status_code != 200:
            print(f"Error fetching page 1: {response1.status_code}")
            print(response1.text)
            return
        
        data1 = response1.json()
        products1 = data1["data"]
        print(f"Page 1 returned {len(products1)} products.")
        if products1:
            print(f"First product on page 1: {products1[0]['product_name']}")

        # Fetch page 2
        print("\nFetching page 2...")
        response2 = await client.get("/products/search", params={"page": 2, "limit": 5})
        if response2.status_code != 200:
            print(f"Error fetching page 2: {response2.status_code}")
            print(response2.text)
            return

        data2 = response2.json()
        products2 = data2["data"]
        print(f"Page 2 returned {len(products2)} products.")
        if products2:
            print(f"First product on page 2: {products2[0]['product_name']}")

        # Compare
        if not products1 or not products2:
            print("Not enough data to compare.")
            return

        ids1 = [p["product_id"] for p in products1]
        ids2 = [p["product_id"] for p in products2]

        print(f"\nPage 1 IDs: {ids1}")
        print(f"Page 2 IDs: {ids2}")

        if ids1 == ids2:
            print("\nFAIL: Page 1 and Page 2 returned the same products!")
        else:
            print("\nSUCCESS: Page 1 and Page 2 returned different products.")

if __name__ == "__main__":
    asyncio.run(test_pagination())
