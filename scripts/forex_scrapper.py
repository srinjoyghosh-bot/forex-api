import requests
from bs4 import BeautifulSoup
import sqlite3
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import time
import sys
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning) 

conn = sqlite3.connect('data/forex_data.db')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS forex_data (
    date TEXT,
    currency_pair TEXT,
    open REAL,
    high REAL,
    low REAL,
    close REAL,
    volume INTEGER
)
''')

def to_unix_timestamp(date):
    return int(time.mktime(date.timetuple()))

def calculate_date_range(period):
    now = datetime.now()
    if period.endswith("M"):
        months = int(period[:-1])
        start_date = now - relativedelta(months=months)
    elif period.endswith("W"):
        weeks = int(period[:-1])
        start_date = now - relativedelta(weeks=weeks)
    elif period.endswith("Y"):
        years = int(period[:-1])
        start_date = now - relativedelta(years=years)
    else:
        raise ValueError("Invalid period format. Use 'xM', 'xW', or 'xY'.")

    return start_date, now 

def scrape_data(quote, from_date, to_date):
    from_timestamp = to_unix_timestamp(from_date)
    print(f"From Timestamp: {from_timestamp}")
    to_timestamp = to_unix_timestamp(to_date)
    print(f"To Timestamp: {to_timestamp}")
    url = f"https://finance.yahoo.com/quote/{quote}/history/?period1={from_timestamp}&period2={to_timestamp}"
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    'Accept': 'text/html'
}
    print(f"Url is {url}")
    response = requests.get(url,headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch data. Status code: {response.status_code}")
        return
    
    soup = BeautifulSoup(response.text, 'html.parser')

    table = soup.find('table')
    
    if not table:
        print("Price table not found. Verify the page structure.")
        return

    for row in table.find_all('tr')[1:]:  
        cols = row.find_all('td')
        if len(cols) < 6:
            continue

        date_str = cols[0].text.strip()
        date = datetime.strptime(date_str, '%b %d, %Y')  
        
        open_price = float(cols[1].text.replace(',', ''))
        high = float(cols[2].text.replace(',', ''))
        low = float(cols[3].text.replace(',', ''))
        close = float(cols[4].text.replace(',', ''))
        volume_str = cols[6].text.replace(',', 'N/A')
        volume = int(volume_str) if volume_str.isdigit() else 0

        cursor.execute(
            "INSERT INTO forex_data (date, currency_pair, open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (date, quote, open_price, high, low, close, volume)
        )

    conn.commit()

def main():
    if len(sys.argv) < 4:
        print(len(sys.argv))
        print("Usage: python forex_scraper.py <from_curr> <to_curr> <period>")
        sys.exit(1)
    from_curr = sys.argv[1]
    to_curr = sys.argv[2]
    period=sys.argv[3]
    from_date, to_date = calculate_date_range(period)
    currency_pair = f"{from_curr}{to_curr}=X"
    scrape_data(currency_pair, from_date, to_date)
    for row in cursor.execute('SELECT * FROM forex_data'):
        print(row)

if __name__ == '__main__':
    main()

cursor.close()
conn.close()
