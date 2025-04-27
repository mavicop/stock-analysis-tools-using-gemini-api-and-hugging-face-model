import google.generativeai as genai
from fundamental import fetch_comprehensive_stock_data  # Importing the required function for fundamental data
from technical import fetch_tradingview_ta  # Importing the required function for technical data

# Function to fetch fundamental and technical data for a stock
def fetch_data_for_stock(ticker):
    try:
        # Fetch the fundamental data using the provided function from the fundamental module
        stock_fundamental_data = fetch_comprehensive_stock_data(ticker)
        
        # Fetch the technical data using the provided function from the technical module
        stock_technical_data = fetch_tradingview_ta(ticker)
        
        return stock_fundamental_data, stock_technical_data
    except Exception as e:
        raise ValueError(f"Error fetching data for {ticker}: {e}")

# Function to prepare a comparison prompt
def prepare_comparison_prompt(stock_a_fundamental_data, stock_b_fundamental_data,
                              stock_a_technical_data, stock_b_technical_data):
    # Format the fundamental data for Stock A and Stock B
    stock_a_fundamental_str = "\n".join([f"{key}: {value}" for key, value in stock_a_fundamental_data.items()])
    stock_b_fundamental_str = "\n".join([f"{key}: {value}" for key, value in stock_b_fundamental_data.items()])
    
    # Format the technical data for Stock A and Stock B
    stock_a_technical_str = "\n".join([f"{key}: {value}" for key, value in stock_a_technical_data["indicators"].items()])
    stock_b_technical_str = "\n".join([f"{key}: {value}" for key, value in stock_b_technical_data["indicators"].items()])
    
    # Build the final comparison prompt
    prompt = f"""
    From now on, you are an expert in financial and technical analysis. Compare the following data for Stock A and Stock B: give output in a very friendly way so that anyone can understand it. Provide spaces after every point, use "*" as space to format output for easy clean viewing.

    **Stock A - Fundamental Data:**
    {stock_a_fundamental_str}

    **Stock B - Fundamental Data:**
    {stock_b_fundamental_str}

    **Stock A - Technical Data:**
    {stock_a_technical_str}

    **Stock B - Technical Data:**
    {stock_b_technical_str}

    Provide a detailed comparison between Stock A and Stock B's fundamental and technical data, highlighting key differences and similarities.
    """
    
    return prompt

# Function to get AI's comparison analysis (takes tickers as input)
def get_ai_comparison_analysis(stock_a_ticker, stock_b_ticker):
    # Hardcoded API key
    api_key = "****************"  # Replace this with your actual GEMINI API key
    
    # Ensure the API key is provided
    if not api_key:
        raise ValueError("API key not provided. Please pass a valid API key.")
    
    # Configure the API key
    genai.configure(api_key=api_key)
    
    # Fetch data for Stock A and Stock B
    stock_a_fundamental_data, stock_a_technical_data = fetch_data_for_stock(stock_a_ticker)
    stock_b_fundamental_data, stock_b_technical_data = fetch_data_for_stock(stock_b_ticker)

    # Prepare the comparison prompt for the AI
    prompt = prepare_comparison_prompt(stock_a_fundamental_data, stock_b_fundamental_data, stock_a_technical_data, stock_b_technical_data)

    # Create the model configuration for generating content
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash", 
        generation_config={
            "temperature": 2,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
        }
    )
    
    # Generate content using the model and prompt
    res = model.generate_content(prompt)
    
    # Return the generated text from the response
    return res.text

