# Forex Data API

## Overview

This project is designed to scrape and synchronize foreign exchange (forex) rates between specific currency pairs from the Yahoo Finance website using a combination of Node.js and Python. The data is fetched periodically and stored in a database for further analysis or usage.

## API Documentation
To explore the API endpoints, see the documentation from the link below: \
[API Documentation](https://documenter.getpostman.com/view/37981067/2sAXxJiv4y) 

## Features

- Scrapes forex data for predefined currency pairs and periods.
- Uses Node.js for scheduling tasks (cron jobs).
- Python script for data scraping.
- Stores data in SQLite database.
- Automated setup and execution using Node.js and Python.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Install Node.js and NPM from [nodejs.org](https://nodejs.org/).
- **Python 3**: Ensure Python 3 is installed. Download from [python.org](https://www.python.org/).
- **SQLite**: Make sure SQLite is set up (usually included with Python).

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/srinjoyghosh-bot/forex-api.git
   cd forex-api
2. **Install Node.js dependencies**:
   
    ```bash
     npm install
3. **Install Python dependencies**:
     ```bash
     pip install requests python-dateutil beautifulsoup4

## Configuration

- Ensure the Python script path and interpreter are correctly set in your Node.js script (in `utils/scrapingUtils.ts`):
  - Check the line where the Python script is invoked and verify that the path matches the location of your script.
  - Example: 
    ```typescript
    const scriptPath = 'scripts/forex_scrapper.py'; // Adjust this path if necessary
    const pythonPath = 'python3'; // Ensure this points to your Python interpreter
    ```
## Usage

1. **Run the Server and Schedulers**:
   - Start the Node.js server, which also initiates the cron jobs for periodic data scraping:
     ```bash
     npm start
     ```
   - The server will output logs to the console for every scheduled task execution, indicating the scraping process.

2. **Verify Data Collection**:
   - Ensure that cron jobs are active by checking console logs periodically.
   - Logs should display confirmation messages like "Running XYZ scrape" and "Python script output: ...".

3. **Access the Data**:
   - Scraped data is stored in your SQLite database located in the `data` directory.
   - You can use an SQLite client or script to query the database, e.g.:
     ```sql
     SELECT * FROM forex_data;
     ```

4. **Modify Scraping Periods and Currency Pairs**:
   - To change the cron schedule or add different currency pairs, modify the `utils/scrapingUtils.ts` file.
   - Adjust cron expressions and parameters to suit your data collection needs.

5. **Data Analysis and Utilization**:
   - Use the collected data for analysis or integration with other applications.
   - Apply statistical methods or machine learning algorithms on the data for insights.




