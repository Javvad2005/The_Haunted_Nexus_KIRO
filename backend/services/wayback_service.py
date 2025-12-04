"""
Wayback Machine service for fetching archived web pages
"""
import requests
from urllib.parse import urlparse, quote
import re
from bs4 import BeautifulSoup

class WaybackError(Exception):
    """Custom exception for Wayback Machine errors"""
    pass

def validate_url(url):
    """
    Validate and sanitize URL
    
    Args:
        url (str): URL to validate
        
    Returns:
        str: Validated URL
        
    Raises:
        WaybackError: If URL is invalid
    """
    try:
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            raise WaybackError("Invalid URL format. Must include protocol (http:// or https://)")
        
        # Only allow http and https
        if parsed.scheme not in ['http', 'https']:
            raise WaybackError("Only HTTP and HTTPS protocols are supported")
        
        return url
    except Exception as e:
        raise WaybackError(f"URL validation failed: {str(e)}")

def fetch_archived_snapshot(url, timeout=10):
    """
    Fetch an archived snapshot from the Wayback Machine
    
    Args:
        url (str): URL to fetch from archive
        timeout (int): Request timeout in seconds
        
    Returns:
        dict: Dictionary containing:
            - html (str): Archived HTML content
            - archive_date (str): Date of the archive
            - archive_url (str): Full Wayback Machine URL
            
    Raises:
        WaybackError: If archive cannot be fetched
    """
    # Validate URL first
    validated_url = validate_url(url)
    
    try:
        # Step 1: Get the latest available snapshot
        availability_url = f"http://archive.org/wayback/available?url={quote(validated_url)}"
        
        response = requests.get(availability_url, timeout=timeout)
        response.raise_for_status()
        
        data = response.json()
        
        # Check if snapshot exists
        if not data.get('archived_snapshots') or not data['archived_snapshots'].get('closest'):
            raise WaybackError(f"No archived version found for {validated_url}")
        
        snapshot = data['archived_snapshots']['closest']
        archive_url = snapshot['url']
        archive_timestamp = snapshot['timestamp']
        
        # Format the timestamp (YYYYMMDDHHMMSS -> readable format)
        archive_date = format_wayback_timestamp(archive_timestamp)
        
        # Step 2: Fetch the actual archived content
        archive_response = requests.get(archive_url, timeout=timeout)
        archive_response.raise_for_status()
        
        html_content = archive_response.text
        
        # Step 3: Clean the HTML
        cleaned_html = clean_archived_html(html_content, archive_url)
        
        return {
            'html': cleaned_html,
            'archive_date': archive_date,
            'archive_url': archive_url
        }
        
    except requests.exceptions.Timeout:
        raise WaybackError("Request timed out while fetching archive")
    except requests.exceptions.RequestException as e:
        raise WaybackError(f"Failed to fetch archive: {str(e)}")
    except Exception as e:
        raise WaybackError(f"Unexpected error: {str(e)}")

def format_wayback_timestamp(timestamp):
    """
    Format Wayback Machine timestamp to readable date
    
    Args:
        timestamp (str): Wayback timestamp (YYYYMMDDHHMMSS)
        
    Returns:
        str: Formatted date string
    """
    try:
        year = timestamp[:4]
        month = timestamp[4:6]
        day = timestamp[6:8]
        return f"{year}-{month}-{day}"
    except:
        return timestamp

def clean_archived_html(html, archive_url):
    """
    Clean and parse archived HTML content
    Remove Wayback Machine toolbar and fix relative URLs
    
    Args:
        html (str): Raw HTML from Wayback Machine
        archive_url (str): The Wayback Machine URL
        
    Returns:
        str: Cleaned HTML content
    """
    try:
        soup = BeautifulSoup(html, 'html.parser')
        
        # Remove Wayback Machine toolbar and scripts
        for element in soup.find_all(['script', 'style']):
            # Remove Wayback-specific scripts
            if element.string and ('archive.org' in element.string or 'wayback' in element.string.lower()):
                element.decompose()
        
        # Remove Wayback toolbar elements
        for toolbar in soup.find_all(id=re.compile('wm-', re.I)):
            toolbar.decompose()
        
        # Remove Wayback banner
        for banner in soup.find_all(class_=re.compile('wayback', re.I)):
            banner.decompose()
        
        # Limit the HTML size to prevent huge responses
        html_str = str(soup)
        
        # Truncate if too large (keep first 50KB)
        max_size = 50000
        if len(html_str) > max_size:
            html_str = html_str[:max_size] + "\n<!-- Content truncated for display -->"
        
        return html_str
        
    except Exception as e:
        # If parsing fails, return original HTML (truncated)
        max_size = 50000
        if len(html) > max_size:
            return html[:max_size] + "\n<!-- Content truncated for display -->"
        return html
