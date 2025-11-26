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
            # Usamos get_all_values para obtener los datos crudos
            rows = self.sheet.get_all_values()
            if not rows:
                return []
            
            # Asumimos que la primera fila son headers, pero parseamos por índice
            # Indices basados en la imagen del usuario:
            # 0: product_id
            # 1: store
            # 2: product_name
            # 3: price
            # 4: null/empty
            # 5: product_discount
            # 6: link
            # 7: datetime
            
            data = rows[1:] # Saltamos headers
            
            result = []
            for row in data:
                # Aseguramos que la fila tenga suficientes columnas
                if len(row) < 4:
                    continue
                    
                try:
                    item = {
                        "product_id": row[0], # Hash string
                        "store": row[1],
                        "product_name": row[2],
                        "price": self._parse_price(row[3]),
                        # "product_discount": row[5] if len(row) > 5 else 0, # Opcional si se agrega al schema
                        "link": row[6] if len(row) > 6 else "",
                        "date": row[7] if len(row) > 7 else ""
                    }
                    result.append(item)
                except IndexError:
                    continue
                
            return result
        except Exception as e:
            print(f"Error al leer desde Google Sheets: {e}")
            return []

    def get_product_count(self) -> int:
        """
        Cuenta el número total de productos.
        """
        products = self.get_all_products()
        return len(products)

    def get_product_history(self, product_id: str) -> Optional[Dict]:
        """
        Obtiene el historial de precios de un producto específico.
        """
        try:
            all_products = self.get_all_products()
            # Filter by product_id
            history_items = [p for p in all_products if str(p.get('product_id')) == str(product_id)]
            
            if not history_items:
                return None
                
            # Sort by date
            history_items.sort(key=lambda x: x.get('date', ''), reverse=False)
            
            product_info = history_items[0]
            
            return {
                "product_id": str(product_id),
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
        except Exception as e:
            print(f"Error in get_product_history: {e}")
            return None

    def get_product_comparison(self, product_id: str) -> Optional[Dict]:
        """
        Obtiene la comparación de precios actuales entre tiendas para un producto.
        Asume que el 'precio actual' es el último registrado para cada tienda.
        """
        try:
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
                "product_id": str(product_id),
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
        except Exception as e:
            print(f"Error in get_product_comparison: {e}")
            return None

    def get_global_stats(self) -> Dict:
        """
        Calcula estadísticas globales: Los Mejores Precios por Producto.
        Agrupa por nombre y encuentra el precio mínimo.
        """
        try:
            all_products = self.get_all_products()
            if not all_products:
                return {"best_prices": []}
                
            # Group by product_name
            product_groups = {}
            for p in all_products:
                name = p.get('product_name')
                if not name:
                    continue
                
                # Normalize name if needed (simple strip/lower for grouping keys?)
                # For now, exact match on product_name
                if name not in product_groups:
                    product_groups[name] = []
                product_groups[name].append(p)
            
            best_prices = []
            for name, items in product_groups.items():
                # Find item with min price in this group
                # Filter out 0 or invalid prices if necessary
                valid_items = [i for i in items if self._parse_price(i.get('price')) > 0]
                
                if not valid_items:
                    continue
                    
                best_item = min(valid_items, key=lambda x: self._parse_price(x.get('price')))
                
                best_prices.append({
                    "product_name": name,
                    "min_price": self._parse_price(best_item.get('price')),
                    "store": best_item.get('store')
                })
                
            return {
                "best_prices": best_prices
            }
        except Exception as e:
            print(f"Error in get_global_stats: {e}")
            return {"best_prices": []}

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

    def search_products(
        self,
        q: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        store: Optional[str] = None,
        sort_by: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> Dict:
        """
        Busca productos con filtros, ordenamiento y paginación.
        """
        try:
            all_products = self.get_all_products()
            
            # 1. Filtering
            filtered_products = all_products
            
            if q:
                q_lower = q.lower()
                filtered_products = [
                    p for p in filtered_products 
                    if q_lower in str(p.get('product_name', '')).lower()
                ]
                
            if store:
                store_lower = store.lower()
                filtered_products = [
                    p for p in filtered_products
                    if str(p.get('store', '')).lower() == store_lower
                ]
                
            if min_price is not None:
                filtered_products = [
                    p for p in filtered_products
                    if self._parse_price(p.get('price')) >= min_price
                ]
                
            if max_price is not None:
                filtered_products = [
                    p for p in filtered_products
                    if self._parse_price(p.get('price')) <= max_price
                ]
                
            # 2. Sorting
            if sort_by:
                if sort_by == 'price_asc':
                    filtered_products.sort(key=lambda x: self._parse_price(x.get('price')))
                elif sort_by == 'price_desc':
                    filtered_products.sort(key=lambda x: self._parse_price(x.get('price')), reverse=True)
                elif sort_by == 'newest':
                    # Assuming date format YYYY-MM-DD or similar string that sorts correctly
                    filtered_products.sort(key=lambda x: x.get('date', ''), reverse=True)
            
            # 3. Pagination
            total_results = len(filtered_products)
            total_pages = (total_results + limit - 1) // limit
            
            if page > total_pages and total_pages > 0:
                # Page out of range
                paginated_data = []
            else:
                start_idx = (page - 1) * limit
                end_idx = start_idx + limit
                paginated_data = filtered_products[start_idx:end_idx]
            
            return {
                "total_results": total_results,
                "total_pages": total_pages,
                "current_page": page,
                "limit": limit,
                "data": paginated_data
            }
            
        except Exception as e:
            print(f"Error in search_products: {e}")
            return {
                "total_results": 0,
                "total_pages": 0,
                "current_page": page,
                "limit": limit,
                "data": []
            }