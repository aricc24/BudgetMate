from datetime import datetime
from dateutil.relativedelta import relativedelta

start_date = datetime(2024, 12, 8, 23, 35)

print("Fechas generadas con frecuencia mensual:\n")
for i in range(12):
    print(f"Repetición {i + 1}: {start_date}")
    start_date += relativedelta(months=1)
