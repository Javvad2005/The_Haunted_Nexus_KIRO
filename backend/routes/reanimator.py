"""
Reanimator API routes
Resurrects archived websites with modern styling
"""
from flask import Blueprint, request, jsonify
from services.wayback_service import fetch_archived_snapshot, WaybackError
from services.ai_service import ai_service

reanimator_bp = Blueprint('reanimator', __name__)

@reanimator_bp.route('/api/reanimator', methods=['POST'])
def reanimate_website():
    """
    Reanimate a website by fetching archived version and modernizing it
    
    Request body:
        {
            "url": "https://example.com"
        }
    
    Response:
        {
            "success": true,
            "data": {
                "original_html": "...",
                "revived_html": "...",
                "archive_date": "2020-01-01",
                "success": true
            }
        }
    """
    try:
        # Get URL from request
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'MISSING_URL',
                    'message': 'URL is required',
                    'details': 'Please provide a URL in the request body'
                }
            }), 400
        
        url = data['url']
        
        if not url or not url.strip():
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_URL',
                    'message': 'URL cannot be empty',
                    'details': 'Please provide a valid URL'
                }
            }), 400
        
        # Step 1: Fetch archived snapshot from Wayback Machine
        try:
            archive_data = fetch_archived_snapshot(url)
            original_html = archive_data['html']
            archive_date = archive_data['archive_date']
        except WaybackError as e:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'WAYBACK_ERROR',
                    'message': str(e),
                    'details': 'Failed to fetch archived version from Wayback Machine'
                }
            }), 404
        
        # Step 2: Modernize the HTML using AI service
        try:
            revived_html = ai_service.modernize_html(original_html)
        except Exception as e:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'MODERNIZATION_ERROR',
                    'message': 'Failed to modernize HTML',
                    'details': str(e)
                }
            }), 500
        
        # Step 3: Return both versions
        return jsonify({
            'success': True,
            'data': {
                'original_html': original_html,
                'revived_html': revived_html,
                'archive_date': archive_date,
                'success': True
            }
        }), 200
        
    except Exception as e:
        # Handle unexpected errors
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'An unexpected error occurred',
                'details': str(e)
            }
        }), 500
