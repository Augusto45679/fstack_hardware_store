import gspread
# import pandas as pd # Ya no es necesario para el conteo
from google.oauth2.service_account import Credentials
from typing import List, Dict

class GoogleSheetsService:
    def __init__(self, credentials_path: str, spreadsheet_name: str, sheet_name: str):
        self.scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
        self.creds = Credentials.from_service_account_file(credentials_path, scopes=self.scope)
        self.client = gspread.authorize(self.creds)
        self.spreadsheet = self.client.open(spreadsheet_name)
        self.sheet = self.spreadsheet.worksheet(sheet_name)

    def get_all_products(self) -> List[Dict[str, any]]:
        """
        Obtiene todos los registros de la hoja de cálculo.
        """
        try:
            # get_all_records() devuelve una lista de diccionarios, ideal para la API
            return self.sheet.get_all_records()
        except Exception as e:
            print(f"Error al leer desde Google Sheets: {e}")
            return []

    def get_product_count(self) -> int:
        """
        Cuenta el número total de productos (filas con contenido) en la hoja, sin contar el encabezado.
        """
        try:
            # Usamos get_all_records() que solo trae las filas con datos
            # y contamos la longitud de la lista resultante. Es el método más preciso.
            return len(self.sheet.get_all_records())
        except Exception as e:
            print(f"Error al contar filas en Google Sheets: {e}")
            return 0