"""
Frankenstein Stitcher API routes
Combines data from two different APIs into a creative output
"""
from flask import Blueprint, request, jsonify
from services.external_apis import fetch_api_data, ExternalAPIError
from services.ai_service import ai_service

frankenstein_stitcher_bp = Blueprint('frankenstein_stitcher', __name__)

@frankenstein_stitcher_bp.route('/api/frankenstein-stitch', methods=['POST'])
def stitch_apis():
    """
    Stitch together two API responses into a creative output
    
    Request body:
        {
            "api1": "weather",
            "api2": "jokes"
        }
    
    Response:
        {
            "success": true,
            "data": {
                "stitched_output": "...",
                "api1_data": {...},
                "api2_data": {...}
            }
        }
    """
    try:
        # Get API selections from request
        data = request.get_json()
        
        if not data or 'api1' not in data or 'api2' not in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'MISSING_APIS',
                    'message': 'Both api1 and api2 are required',
                    'details': 'Please provide both API selections in the request body'
                }
            }), 400
        
        api1 = data['api1']
        api2 = data['api2']
        
        if not api1 or not api2:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_APIS',
                    'message': 'API selections cannot be empty',
                    'details': 'Please provide valid API names'
                }
            }), 400
        
        if api1 == api2:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'SAME_APIS',
                    'message': 'Please select two different APIs',
                    'details': 'The Frankenstein method requires different limbs'
                }
            }), 400
        
        # Step 1: Fetch data from both APIs
        try:
            api1_data = fetch_api_data(api1)
        except ExternalAPIError as e:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'API1_ERROR',
                    'message': f'Failed to fetch data from {api1}',
                    'details': str(e)
                }
            }), 500
        
        try:
            api2_data = fetch_api_data(api2)
        except ExternalAPIError as e:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'API2_ERROR',
                    'message': f'Failed to fetch data from {api2}',
                    'details': str(e)
                }
            }), 500
        
        # Step 2: Stitch the data together using AI service
        try:
            stitched_output = ai_service.stitch_api_data(api1_data, api2_data)
        except Exception as e:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'STITCHING_ERROR',
                    'message': 'Failed to stitch APIs together',
                    'details': str(e)
                }
            }), 500
        
        # Step 3: Return the stitched result with source data
        return jsonify({
            'success': True,
            'data': {
                'stitched_output': stitched_output,
                'api1_data': api1_data,
                'api2_data': api2_data
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
