import gspread
from google.oauth2.service_account import Credentials
from typing import List, Dict, Optional
from cachetools import cached, TTLCache
from datetime import datetime

# Cache for 10 minutes (600 seconds)
cache = TTLCache(maxsize=100, ttl=600)

class GoogleSheetsService:
    def __init__(self, credentials_path: str, spreadsheet_name: str, sheet_name: str):
        self.scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
        self.creds = Credentials.from_service_account_file(credentials_path, scopes=self.scope)
        self.client = gspread.authorize(self.creds)
        self.spreadsheet = self.client.open(spreadsheet_name)
        self.sheet = self.spreadsheet.worksheet(sheet_name)

    @cached(cache)
    def get_all_products(self) -> List[Dict[str, any]]:
        """
        Obtiene todos los registros de la hoja de cálculo.
        Usa caché para evitar exceder los límites de la API.
        """
        try:
            return self.sheet.get_all_records()
        except Exception as e:
            print(f"Error al leer desde Google Sheets: {e}")
            return []

    def get_product_count(self) -> int:
        """
        Cuenta el número total de productos.
        """
        products = self.get_all_products()
        return len(products)

    def get_product_history(self, product_id: int) -> Optional[Dict]:
        """
        Obtiene el historial de precios de un producto específico.
        """
        all_products = self.get_all_products()
        # Filter by product_id
        history_items = [p for p in all_products if str(p.get('product_id')) == str(product_id)]
        
        if not history_items:
            return None
            
        # Sort by date
        history_items.sort(key=lambda x: x.get('date', ''), reverse=False)
        
        product_info = history_items[0]
        
        return {
            "product_id": product_id,
            "product_name": product_info.get('product_name'),
            "history": [
                {
                    "date": item.get('date'),
                    "price": self._parse_price(item.get('price')),
                    "store": item.get('store')
                }
                for item in history_items
            ]
        }

    def get_product_comparison(self, product_id: int) -> Optional[Dict]:
        """
        Obtiene la comparación de precios actuales entre tiendas para un producto.
        Asume que el 'precio actual' es el último registrado para cada tienda.
        """
        all_products = self.get_all_products()
        product_items = [p for p in all_products if str(p.get('product_id')) == str(product_id)]
        
        if not product_items:
            return None
            
        # Group by store and get the latest price for each
        store_prices = {}
        for item in product_items:
            store = item.get('store')
            date = item.get('date')
            # Simple logic: if we haven't seen this store or this item is newer, update
            # Ideally we should parse dates, but string comparison YYYY-MM-DD works too
            if store not in store_prices or date > store_prices[store]['date']:
                store_prices[store] = item
                
        return {
            "product_id": product_id,
            "product_name": product_items[0].get('product_name'),
            "comparison": [
                {
                    "store": store,
                    "price": self._parse_price(data.get('price')),
                    "link": data.get('link')
                }
                for store, data in store_prices.items()
            ]
        }

    def get_global_stats(self) -> Dict:
        """
        Calcula estadísticas globales de los productos.
        """
        all_products = self.get_all_products()
        if not all_products:
            return {
                "total_products": 0,
                "lowest_price": 0,
                "average_price": 0,
                "cheapest_store": "N/A",
                "most_expensive_store": "N/A"
            }
            
        prices = []
        store_counts = {}
        
        for p in all_products:
            price = self._parse_price(p.get('price'))
            if price > 0:
                prices.append(price)
                store = p.get('store')
                store_counts[store] = store_counts.get(store, 0) + 1
                
        if not prices:
             return {
                "total_products": len(all_products),
                "lowest_price": 0,
                "average_price": 0,
                "cheapest_store": "N/A",
                "most_expensive_store": "N/A"
            }

        lowest_price = min(prices)
        average_price = sum(prices) / len(prices)
        
        # This is a heuristic for 'cheapest store' - store with most low prices?
        # Or just store with lowest average price? Let's go with lowest average price.
        store_prices = {}
        for p in all_products:
            store = p.get('store')
            price = self._parse_price(p.get('price'))
            if price > 0:
                if store not in store_prices:
                    store_prices[store] = []
                store_prices[store].append(price)
        
        store_averages = {s: sum(pr)/len(pr) for s, pr in store_prices.items()}
        cheapest_store = min(store_averages, key=store_averages.get) if store_averages else "N/A"
        most_expensive_store = max(store_averages, key=store_averages.get) if store_averages else "N/A"

        return {
            "total_products": len(all_products),
            "lowest_price": lowest_price,
            "average_price": round(average_price, 2),
            "cheapest_store": cheapest_store,
            "most_expensive_store": most_expensive_store
        }

    def _parse_price(self, price_str) -> int:
        """
        Helper to clean and parse price strings.
        """
        if isinstance(price_str, int):
            return price_str
        if isinstance(price_str, float):
            return int(price_str)
            
        try:
            # Remove currency symbols and dots/commas if necessary
            # Assuming format like "$ 1.234" or "1234"
            clean_price = str(price_str).replace('$', '').replace('.', '').replace(',', '').strip()
            return int(clean_price)
        except ValueError:
            return 0