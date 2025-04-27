import requests
from collections import Counter
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

# Initialize sentiment analysis pipeline
def initialize_sentiment_pipeline():
    tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
    model = AutoModelForSequenceClassification.from_pretrained("ProsusAI/finbert")
    nlp_pipeline = pipeline("text-classification", model=model, tokenizer=tokenizer)
    return nlp_pipeline

# Fetch stock-related news
def fetch_stock_news(stock_name):
    API_KEY = "*******************"  # Replace with your GOOGLE NEWS API key
    BASE_URL = "https://newsapi.org/v2/everything"
    params = {
        "q": stock_name,
        "language": "en",
        "sortBy": "relevance",
        "apiKey": API_KEY
    }
    response = requests.get(BASE_URL, params=params)
    if response.status_code == 200:
        news_data = response.json()
        articles = news_data.get("articles", [])
        headlines = [article["title"] for article in articles if "title" in article]
        return "\n".join(headlines)
    else:
        return None

# Analyze sentiment for a single stock
def analyze_single_stock(stock_name, nlp_pipeline):
    news_content = fetch_stock_news(stock_name)
    if not news_content:
        return {"error": f"No news data available for {stock_name}"}
    
    sentences = [line.strip() for line in news_content.split('\n') if line.strip()]
    try:
        results = nlp_pipeline(sentences)
    except Exception as e:
        return {"error": f"Pipeline processing error: {e}"}
    
    sentiment_labels = [result['label'].lower() for result in results]
    sentiment_counts = Counter(sentiment_labels)
    overall_sentiment = max(sentiment_counts, key=sentiment_counts.get)
    
    # Return the results
    analysis_result = {
        'Positive': sentiment_counts.get('positive', 0),
        'Negative': sentiment_counts.get('negative', 0),
        'Neutral': sentiment_counts.get('neutral', 0),
        'Overall Sentiment': overall_sentiment
    }

    return analysis_result

def analyze_sector(sector_name, stocks, nlp_pipeline):
    sentiment_counts = Counter()

    for stock in stocks:
        news_content = fetch_stock_news(stock)
        if not news_content:
            continue

        sentences = [line.strip() for line in news_content.split('\n') if line.strip()]
        try:
            results = nlp_pipeline(sentences)
        except Exception as e:
            continue

        # Count sentiments for this stock
        for result in results:
            sentiment_label = result['label'].lower()
            sentiment_counts[sentiment_label] += 1

    # Calculate overall sentiment for the sector
    overall_sentiment = (
        max(sentiment_counts, key=sentiment_counts.get)
        if sentiment_counts
        else "neutral"
    )

    # Return the results
    analysis_result = {
        "Positive": sentiment_counts.get("positive", 0),
        "Negative": sentiment_counts.get("negative", 0),
        "Neutral": sentiment_counts.get("neutral", 0),
        "Overall Sentiment": overall_sentiment,
    }

    return analysis_result


# Flask API routes to handle different requests

from flask import Flask, request, jsonify

app = Flask(__name__)

# Initialize sentiment analysis pipeline
nlp_pipeline = initialize_sentiment_pipeline()



@app.route('/analyze_single', methods=['POST'])
def analyze_single():
    stock_name = request.form.get('stock_name')
    if stock_name:
        result = analyze_single_stock(stock_name, nlp_pipeline)
        return jsonify(result)
    else:
        return "Please provide a stock ticker."

