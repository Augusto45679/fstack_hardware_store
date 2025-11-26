from app.services.sheets_service import GoogleSheetsService
from unittest.mock import MagicMock

def test_search():
    # Mock the sheets client and worksheet
    mock_sheet = MagicMock()
    # Mock data: header + 2 rows
    mock_sheet.get_all_values.return_value = [
        ["product_id", "store", "product_name", "price", "null", "discount", "link", "date"],
        ["1", "Store A", "Laptop Pro", "1000", "", "0", "http://a.com", "2023-01-01"],
        ["2", "Store B", "Mouse", "50", "", "0", "http://b.com", "2023-01-02"],
        ["3", "Store A", "Laptop Air", "1200", "", "0", "http://a.com", "2023-01-03"]
    ]
    
    service = GoogleSheetsService("dummy_path", "dummy_spreadsheet", "dummy_sheet")
    service.sheet = mock_sheet
    # Mock _parse_price to avoid issues if it uses something complex, though it's simple
    # But wait, _parse_price is an instance method, so we should let it run or mock it if needed.
    # It's better to let it run as it's part of the logic.
    # We need to mock credentials loading though, which happens in __init__.
    # So we should subclass or mock __init__.
    
    print("Testing search_products...")
    
    # Test 1: Search by name
    result = service.search_products(q="Laptop")
    print(f"Search 'Laptop': Found {result['total_results']} items")
    assert result['total_results'] == 2
    
    # Test 2: Filter by store
    result = service.search_products(store="Store A")
    print(f"Filter Store A: Found {result['total_results']} items")
    assert result['total_results'] == 2
    
    # Test 3: Filter by price
    result = service.search_products(min_price=1000)
    print(f"Min Price 1000: Found {result['total_results']} items")
    assert result['total_results'] == 2
    
    # Test 4: Pagination
    result = service.search_products(limit=1)
    print(f"Pagination Limit 1: Found {len(result['data'])} items (Total {result['total_results']})")
    assert len(result['data']) == 1
    assert result['total_results'] == 3
    
    print("All tests passed!")

# We need to bypass __init__ to avoid real credentials
GoogleSheetsService.__init__ = lambda self, a, b, c: None
# We also need to set the mocked sheet manually after init
# But wait, if we bypass init, we need to make sure we set attributes.

if __name__ == "__main__":
    test_search()
