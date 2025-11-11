from .services.sheets_service import GoogleSheetsService

# Configuración para el servicio de Google Sheets
# Asegúrate de que el nombre de la hoja y la spreadsheet coincidan con las tuyas.
CREDENTIALS_FILE = "credentials.json"
SPREADSHEET_NAME = "Hardware_Scrapping"
SHEET_NAME = "Sheet1"

sheets_service = GoogleSheetsService(CREDENTIALS_FILE, SPREADSHEET_NAME, SHEET_NAME)

def get_sheets_service():
    return sheets_service