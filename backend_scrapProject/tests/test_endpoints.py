from fastapi.testclient import TestClient
from app.main import app
from app.dependencies import get_sheets_service
from app.services.sheets_service import GoogleSheetsService
from unittest.mock import MagicMock
import pytest

# Mock data
MOCK_PRODUCTS = [
    {"product_id": "1", "product_name": "GPU A", "price": 100, "store": "Store 1", "link": "http://store1.com", "date": "2023-01-01"},
    {"product_id": "1", "product_name": "GPU A", "price": 90, "store": "Store 1", "link": "http://store1.com", "date": "2023-01-02"},
    {"product_id": "1", "product_name": "GPU A", "price": 95, "store": "Store 2", "link": "http://store2.com", "date": "2023-01-02"},
    {"product_id": "2", "product_name": "CPU B", "price": 200, "store": "Store 1", "link": "http://store1.com", "date": "2023-01-01"},
]

# Mock Service
mock_service = MagicMock(spec=GoogleSheetsService)
mock_service.get_all_products.return_value = MOCK_PRODUCTS
mock_service.get_product_count.return_value = 4

# We need to mock the methods we implemented in the service, 
# but since the service logic is what we want to test (partially), 
# ideally we should test the service logic separately or mock the underlying sheet.
# However, for integration testing the router, we can mock the service methods directly
# OR we can use the real service class but mock the gspread client.
# Let's mock the service methods to test the router wiring first.

mock_service.get_product_history.return_value = {
    "product_id": "1",
    "product_name": "GPU A",
    "history": [
        {"date": "2023-01-01", "price": 100, "store": "Store 1"},
        {"date": "2023-01-02", "price": 90, "store": "Store 1"},
        {"date": "2023-01-02", "price": 95, "store": "Store 2"},
    ]
}

mock_service.get_product_comparison.return_value = {
    "product_id": "1",
    "product_name": "GPU A",
    "comparison": [
        {"store": "Store 1", "price": 90, "link": "http://store1.com"},
        {"store": "Store 2", "price": 95, "link": "http://store2.com"},
    ]
}

mock_service.get_global_stats.return_value = {
    "best_prices": [
        {"product_name": "GPU A", "min_price": 90, "store": "Store 1"},
        {"product_name": "CPU B", "min_price": 200, "store": "Store 1"}
    ]
}

def override_get_sheets_service():
    return mock_service

app.dependency_overrides[get_sheets_service] = override_get_sheets_service

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Bienvenido a la API de Precios de Hardware"}

def test_get_products():
    response = client.get("/products/")
    assert response.status_code == 200
    assert len(response.json()) == 4

def test_get_product_history():
    response = client.get("/products/1/history")
    assert response.status_code == 200
    data = response.json()
    assert data["product_id"] == "1"
    assert len(data["history"]) == 3

def test_get_product_comparison():
    response = client.get("/products/1/compare")
    assert response.status_code == 200
    data = response.json()
    assert data["product_id"] == "1"
    assert len(data["comparison"]) == 2

def test_get_global_stats():
    response = client.get("/products/stats")
    assert response.status_code == 200
    data = response.json()
    assert len(data["best_prices"]) == 2
    assert data["best_prices"][0]["min_price"] == 90
