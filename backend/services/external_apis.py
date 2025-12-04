"""
External APIs service for fetching data from various public APIs
"""
import requests
from config import Config
from utils.cache import cache

class ExternalAPIError(Exception):
    """Custom exception for external API errors"""
    pass

def fetch_weather_data():
    """
    Fetch weather data from OpenWeatherMap API
    
    Returns:
        dict: Normalized weather data
    """
    api_key = Config.WEATHER_API_KEY
    
    if not api_key:
        # Return fallback data if no API key
        return {
            'type': 'weather',
            'location': 'Unknown Location',
            'temperature': '??°C',
            'description': 'Mysterious fog',
            'raw': 'Weather API key not configured'
        }
    
    try:
        # Default to a spooky location
        city = 'London'
        url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
        
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        
        return {
            'type': 'weather',
            'location': data['name'],
            'temperature': f"{data['main']['temp']}°C",
            'description': data['weather'][0]['description'],
            'humidity': f"{data['main']['humidity']}%",
            'raw': data
        }
    except Exception as e:
        raise ExternalAPIError(f"Failed to fetch weather data: {str(e)}")

def fetch_joke_data():
    """
    Fetch a random joke from JokeAPI
    
    Returns:
        dict: Normalized joke data
    """
    try:
        url = 'https://v2.jokeapi.dev/joke/Any?safe-mode'
        
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        
        # Handle both single and two-part jokes
        if data['type'] == 'single':
            joke_text = data['joke']
        else:
            joke_text = f"{data['setup']} - {data['delivery']}"
        
        return {
            'type': 'joke',
            'joke': joke_text,
            'category': data.get('category', 'Unknown'),
            'raw': data
        }
    except Exception as e:
        raise ExternalAPIError(f"Failed to fetch joke data: {str(e)}")

def fetch_quote_data():
    """
    Fetch a random quote from ZenQuotes API
    
    Returns:
        dict: Normalized quote data with formatted string
    """
    try:
        url = 'https://zenquotes.io/api/random'
        
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        
        # ZenQuotes returns an array with one quote object
        if not data or len(data) == 0:
            raise ExternalAPIError("No quote data received from ZenQuotes API")
        
        quote_obj = data[0]
        quote_text = quote_obj.get('q', '')
        author = quote_obj.get('a', 'Unknown')
        
        if not quote_text:
            raise ExternalAPIError("Quote text is empty")
        
        # Format as requested: "QUOTE" — AUTHOR
        formatted_quote = f'"{quote_text}" — {author}'
        
        return {
            'type': 'quote',
            'quote': quote_text,
            'author': author,
            'formatted': formatted_quote,
            'raw': quote_obj
        }
    except requests.exceptions.RequestException as e:
        raise ExternalAPIError(f"Failed to fetch quote data: {str(e)}")
    except (KeyError, IndexError, ValueError) as e:
        raise ExternalAPIError(f"Failed to parse quote data: {str(e)}")
    except ExternalAPIError:
        raise
    except Exception as e:
        raise ExternalAPIError(f"Unexpected error fetching quote: {str(e)}")

def fetch_advice_data():
    """
    Fetch random advice from Advice Slip API
    
    Returns:
        dict: Normalized advice data
    """
    try:
        url = 'https://api.adviceslip.com/advice'
        
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        
        return {
            'type': 'advice',
            'advice': data['slip']['advice'],
            'id': data['slip']['id'],
            'raw': data
        }
    except Exception as e:
        raise ExternalAPIError(f"Failed to fetch advice data: {str(e)}")

def fetch_catfact_data():
    """
    Fetch a random cat fact from Cat Facts API
    
    Returns:
        dict: Normalized cat fact data
    """
    try:
        url = 'https://catfact.ninja/fact'
        
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        
        return {
            'type': 'catfact',
            'fact': data['fact'],
            'length': data.get('length', len(data['fact'])),
            'raw': data
        }
    except Exception as e:
        raise ExternalAPIError(f"Failed to fetch cat fact data: {str(e)}")

# API dispatcher
API_HANDLERS = {
    'weather': fetch_weather_data,
    'jokes': fetch_joke_data,
    'quotes': fetch_quote_data,
    'advice': fetch_advice_data,
    'catfacts': fetch_catfact_data,
}

def fetch_api_data(api_name):
    """
    Fetch data from specified API with caching
    
    Args:
        api_name (str): Name of the API to fetch from
        
    Returns:
        dict: Normalized API response data
        
    Raises:
        ExternalAPIError: If API is not supported or fetch fails
    """
    if api_name not in API_HANDLERS:
        raise ExternalAPIError(f"Unsupported API: {api_name}")
    
    # Check cache first (5 minute TTL)
    cache_key = f"external_api:{api_name}"
    cached_data = cache.get(cache_key)
    if cached_data is not None:
        return cached_data
    
    # Fetch fresh data
    handler = API_HANDLERS[api_name]
    data = handler()
    
    # Cache the result (5 minutes = 300 seconds)
    cache.set(cache_key, data, ttl=300)
    
    return data
