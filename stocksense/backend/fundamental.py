import yfinance as yf

def fetch_comprehensive_stock_data(symbol):
    try:
        # Append '.NS' for Indian stocks on NSE
        stock = yf.Ticker(symbol + ".NS")
        hist = stock.history(period="1d")

        # Fetch Company Info
        current_price = hist['Close'].iloc[-1] if not hist.empty else 'N/A'
        volume = hist['Volume'].iloc[-1] if not hist.empty else 'N/A'

        # Fetch more detailed company information
        info = stock.info

        # Access the income statement safely (e.g., for Net Income)
        try:
            income_stmt = stock.income_stmt
            net_income = income_stmt.loc['Net Income'] if 'Net Income' in income_stmt.index else 'N/A'
        except Exception as e:
            print(f"Error fetching income statement for {symbol}: {e}")
            net_income = 'N/A'

        # Prepare the stock data dictionary with only necessary fields
        stock_data = {
            'Current Price': current_price,
            'Volume': volume,
            'Company Name': info.get('longName', 'N/A'),
            'Sector': info.get('sector', 'N/A'),
            'Industry': info.get('industry', 'N/A'),
            'Market Cap': info.get('marketCap', 'N/A'),
            'P/E Ratio': info.get('trailingPE', 'N/A'),
            'Price to Book': info.get('priceToBook', 'N/A'),
            'Profit Margin': info.get('profitMargins', 'N/A'),
            'ROE': info.get('returnOnEquity', 'N/A'),
            'ROA': info.get('returnOnAssets', 'N/A'),
            'Revenue': info.get('totalRevenue', 'N/A'),
            'Net Income': net_income,  # Fetched from income statement
            'EPS': info.get('trailingEps', 'N/A'),
            'Total Cash': info.get('totalCash', 'N/A'),
            'Total Debt': info.get('totalDebt', 'N/A'),
            'Debt To Equity': info.get('debtToEquity', 'N/A'),
            'Dividend Rate': info.get('dividendRate', 'N/A'),
            'Dividend Yield': info.get('dividendYield', 'N/A'),
            'Beta': info.get('beta', 'N/A'),
            '52 Week High': info.get('fiftyTwoWeekHigh', 'N/A'),
            '52 Week Low': info.get('fiftyTwoWeekLow', 'N/A'),
            '50 Day Average': info.get('fiftyDayAverage', 'N/A'),
            '200 Day Average': info.get('twoHundredDayAverage', 'N/A'),
        }
        return stock_data

    except Exception as e:
        print(f"An error occurred while fetching data for {symbol}: {e}")
        return None
