import requests
from bs4 import BeautifulSoup
import sqlite3
from datetime import datetime, timedelta
import time

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

# Function to scrape data and insert it into SQLite
def scrape_data(quote, from_date, to_date):
    from_timestamp = to_unix_timestamp(from_date)
    print(f"From Timestamp: {from_timestamp}")
    to_timestamp = to_unix_timestamp(to_date)
    print(f"To Timestamp: {to_timestamp}")
    url = f"https://finance.yahoo.com/quote/{quote}/history/?period1={from_timestamp}&period2={to_timestamp}"
    headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
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
    scrape_data('EURUSD=X', datetime.now() - timedelta(days=365), datetime.now())
    for row in cursor.execute('SELECT * FROM forex_data'):
        print(row)

if __name__ == '__main__':
    main()

# Clean up
cursor.close()
conn.close()
