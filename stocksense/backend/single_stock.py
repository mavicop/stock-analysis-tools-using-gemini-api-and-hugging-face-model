import google.generativeai as genai
from fundamental import fetch_comprehensive_stock_data
from technical import fetch_tradingview_ta

# Hardcoded API key for Google AI
api_key = "************************"  # Replace with your actual GEMINI API key

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

# Function to prepare a prompt for analysis
def prepare_analysis_prompt(fundamental_data, technical_data):
    # Format the fundamental and technical data
    fundamental_data_str = "\n".join([f"{key}: {value}" for key, value in fundamental_data.items()])
    technical_data_str = "\n".join([f"{key}: {value}" for key, value in technical_data.get("indicators", {}).items()])
    
    # Build the final prompt
    prompt = f"""
    You are an expert financial and technical analyst, and you are tasked with providing a comprehensive yet simple analysis of the following stock data. Please make the analysis easy to understand for a wide audience, focusing on key insights and actionable points. Use a friendly and conversational tone.

    **1. Fundamental Data:**
    {fundamental_data_str}

    **2. Technical Data:**
    {technical_data_str}

    Your analysis should include a clear summary of the strengths, weaknesses, and any important trends that investors should be aware of. Please:

    - first display the fundamentals in the screen and than display the analysis
    - Break down each piece of data and explain its significance.
    - Highlight any key takeaways from the fundamental and technical data.
    - Organize the analysis in a logical and easy-to-follow structure.
    - Use * (asterisks) as bullet points or separators for clarity.

    At the end, provide actionable insights, such as whether the stock appears to be a good investment based on the data provided.
    """

    return prompt

# Function to perform the analysis and get a response from Google AI
def analyze_stock(stock_ticker):
    """Analyze stock using provided ticker."""
    # Ensure the API key is provided
    if not api_key:
        raise ValueError("API key is not provided")

    # Configure the API key
    genai.configure(api_key=api_key)
    
    try:
        # Fetch data for the stock
        fundamental_data, technical_data = fetch_data_for_stock(stock_ticker)

        # Prepare the analysis prompt for the AI
        prompt = prepare_analysis_prompt(fundamental_data, technical_data)

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
        
        # Return the generated analysis text
        return res.text

    except Exception as e:
        return f"Error: {str(e)}"
