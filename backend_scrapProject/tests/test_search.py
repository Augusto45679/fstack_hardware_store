from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import MagicMock, patch

client = TestClient(app)

def test_search_products_no_params():
    # Mock the sheets service
    with patch("app.routers.products.get_sheets_service") as mock_get_service:
        mock_service = MagicMock()
        mock_service.search_products.return_value = {
            "total_results": 100,
            "total_pages": 5,
            "current_page": 1,
            "limit": 20,
            "data": []
        }
        mock_get_service.return_value = mock_service
        
        response = client.get("/products/search")
        assert response.status_code == 200
        data = response.json()
        assert "total_results" in data
        assert "data" in data

def test_search_products_with_query():
    with patch("app.routers.products.get_sheets_service") as mock_get_service:
        mock_service = MagicMock()
        mock_service.search_products.return_value = {
            "total_results": 1,
            "total_pages": 1,
            "current_page": 1,
            "limit": 20,
            "data": [{"product_id": "1", "product_name": "Test Product", "price": 100, "store": "Test Store", "link": "http://test.com"}]
        }
        mock_get_service.return_value = mock_service
        
        response = client.get("/products/search?q=test")
        assert response.status_code == 200
        data = response.json()
        assert data["total_results"] == 1
        assert data["data"][0]["product_name"] == "Test Product"
