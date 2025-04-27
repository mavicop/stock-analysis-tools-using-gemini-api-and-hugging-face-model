import yfinance as yf
from tradingview_ta import TA_Handler, Interval

# Function to fetch historical stock data using yfinance
def fetch_stock_data(ticker):
    try:
        # Fetch historical stock data for the last 1 year
        df = yf.download(ticker, period="1y", interval="1d")
        return df
    except Exception as e:
        print(f"Error fetching data for {ticker} from yfinance: {e}")
        return None

# Function to fetch TradingView technical analysis
def fetch_tradingview_ta(ticker):
    try:
        analysis = TA_Handler(
            symbol=ticker,
            screener="india",  # Adjust for your market
            exchange="NSE",    # Correct exchange
            interval=Interval.INTERVAL_1_DAY
        ).get_analysis()

        # Structure the TradingView data in a readable format
        summary = analysis.summary
        indicators = analysis.indicators

        # Include essential indicators
        extended_indicators = {
            "RSI": indicators.get('RSI', 'Data Not Available'),
            "MACD": indicators.get('MACD', 'Data Not Available'),
            "EMA10": indicators.get('EMA10', 'Data Not Available'),
            "EMA50": indicators.get('EMA50', 'Data Not Available'),
            "SMA50": indicators.get('SMA50', 'Data Not Available'),
            "SMA200": indicators.get('SMA200', 'Data Not Available'),
            "Bollinger Bands": {
                "Upper": indicators.get('BB.upper', 'Data Not Available'),
                "Lower": indicators.get('BB.lower', 'Data Not Available')
            },
            
        }

        return {
            "summary": summary,
            "indicators": extended_indicators
        }

    except Exception as e:
        print(f"Error fetching TradingView TA for {ticker}: {e}")
        return None

# Function to evaluate strategies based on technical indicators
def evaluate_strategies(technical_data):
    indicators = technical_data["indicators"]
    strategy_output = "\n--- Strategy Recommendations ---\n"

    # RSI Strategy
    rsi = indicators.get("RSI", None)
    if rsi != 'Data Not Available':
        if rsi > 70:
            strategy_output += "RSI indicates the stock is overbought (consider selling or holding).\n"
        elif rsi < 30:
            strategy_output += "RSI indicates the stock is oversold (consider buying).\n"
        else:
            strategy_output += "RSI is in the neutral zone (monitor closely).\n"

    # MACD Strategy
    macd = indicators.get("MACD", None)
    if macd != 'Data Not Available':
        macd_value, macd_signal = map(float, macd.split(','))  # Assuming format is "value,signal"
        if macd_value > macd_signal:
            strategy_output += "MACD indicates bullish momentum (consider buying).\n"
        else:
            strategy_output += "MACD indicates bearish momentum (consider selling).\n"

    # Moving Average Crossovers
    ema10 = indicators.get("EMA10", None)
    ema50 = indicators.get("EMA50", None)
    if ema10 != 'Data Not Available' and ema50 != 'Data Not Available':
        if ema10 > ema50:
            strategy_output += "Short-term EMA (10) is above EMA (50): Bullish trend (consider buying).\n"
        else:
            strategy_output += "Short-term EMA (10) is below EMA (50): Bearish trend (consider selling).\n"

    # Bollinger Bands Strategy
    bollinger = indicators.get("Bollinger Bands", {})
    upper_band = bollinger.get("Upper", None)
    lower_band = bollinger.get("Lower", None)
    if upper_band != 'Data Not Available' and lower_band != 'Data Not Available':
        price = technical_data.get("price", None)
        if price is not None:
            if price > upper_band:
                strategy_output += "Price is above the upper Bollinger Band: Overbought (consider selling).\n"
            elif price < lower_band:
                strategy_output += "Price is below the lower Bollinger Band: Oversold (consider buying).\n"

    return strategy_output

# Main Function for Combining and Displaying Results
def process_technical(ticker):
    # Fetch data from yfinance
    df = fetch_stock_data(ticker)
    if df is not None:
        stock_data = f"--- Historical Stock Data for {ticker} ---\n"
        stock_data += f"\nLast 5 Rows of Data:\n{df.tail()}"
        stock_data += f"\nStatistical Summary of the Data:\n{df.describe()}"
    else:
        stock_data = f"Failed to fetch historical data for {ticker}."
    
    # Fetch TradingView technical analysis data
    tv_data = fetch_tradingview_ta(ticker)
    if tv_data:
        technical_data = f"\n--- TradingView Technical Analysis for {ticker} ---"
        technical_data += "\nSummary:\n"
        for key, value in tv_data["summary"].items():
            technical_data += f"{key}: {value}\n"
        
        technical_data += "\nIndicators:\n"
        for key, value in tv_data["indicators"].items():
            technical_data += f"{key}: {value}\n"

        # Add strategy evaluation
        strategies = evaluate_strategies(tv_data)
        technical_data += strategies
    else:
        technical_data = f"Failed to fetch TradingView technical data for {ticker}."

    # Combine and return all data
    combined_data = stock_data + "\n" + technical_data
    return combined_data