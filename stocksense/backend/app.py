from flask import Flask, jsonify, request
from flask_cors import CORS
from single_stock import analyze_stock
from compare import get_ai_comparison_analysis
from sentiment import initialize_sentiment_pipeline, analyze_single_stock, analyze_sector

app = Flask(__name__)
CORS(app)

# Single stock sentiment analysis endpoint
@app.route('/analyze_single_stock_sentiment', methods=['POST'])
def analyze_single_stock_sentiment():
    stock_name = request.json.get('stock_name')
    
    if not stock_name:
        return jsonify({"error": "Stock ticker is required"}), 400

    # Initialize the sentiment analysis pipeline
    sentiment_pipeline = initialize_sentiment_pipeline()

    # Analyze the sentiment for the provided stock
    sentiment_result = analyze_single_stock(stock_name, sentiment_pipeline)

    print(f"Sentiment analysis for {stock_name}: {sentiment_result}")  # Print the sentiment result
    return jsonify({"result": sentiment_result})


@app.route('/analyze_single_stock', methods=['POST'])
def analyze_single_stock_route():
    data = request.json
    stock = data.get('ticker')
    print(f"Received ticker: {stock}")  # Log received ticker
    
    if not stock:
        print("Error: Stock ticker is required")
        return jsonify({"error": "Stock ticker is required"}), 400
    
    try:
        # Pass the stock ticker to analyze_stock
        stock_result = analyze_stock(stock)
        print(f"Generated analysis result: {stock_result}")  # Log result
        
        # Check if the result is valid
        if not stock_result:
            print("No analysis result was generated.")
            return jsonify({"error": "No analysis available for the provided ticker."}), 500
        
        return jsonify({"analysis_result": stock_result})
    except Exception as e:
        print(f"Error processing ticker {stock}: {e}")  # Log exception
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/compare_stocks', methods=['POST'])
def compare_stocks():
    data = request.json
    stock_a = data.get('stock_a')
    stock_b = data.get('stock_b')

    if not stock_a or not stock_b:
        return jsonify({"error": "Both stock tickers are required"}), 400

    comparison_result = get_ai_comparison_analysis(stock_a, stock_b)
    print(f"Comparison between {stock_a} and {stock_b}: {comparison_result}")  # Log comparison result
    return jsonify({"comparison_result": comparison_result})


@app.route('/analyze_sector_sentiment', methods=['POST'])
def analyze_sector_sentiment():
    data = request.json
    sector_name = data.get('sector_name')
    stocks = data.get('stocks')

    if not sector_name or not stocks:
        return jsonify({"error": "Sector name and stocks are required"}), 400

    sentiment_pipeline = initialize_sentiment_pipeline()
    result = analyze_sector(sector_name, stocks, sentiment_pipeline)
    print(f"Sector Sentiment Analysis for {sector_name} and stocks {stocks}: {result}")  # Print sector sentiment analysis result
    return jsonify({"result": result})


if __name__ == '__main__':
    app.run(debug=True)
