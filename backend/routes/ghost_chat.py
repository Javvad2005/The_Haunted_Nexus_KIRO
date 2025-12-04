from flask import Blueprint, request, jsonify
from datetime import datetime
from services.ai_service import ai_service

ghost_chat_bp = Blueprint('ghost_chat', __name__)

@ghost_chat_bp.route('/api/ghost-chat', methods=['POST'])
def ghost_chat():
    """
    Handle ghost chat messages with persona support
    Expects: { "message": string, "persona_id": string (optional) }
    Returns: { "reply": string, "timestamp": string, "persona": object }
    """
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_REQUEST',
                    'message': 'Message is required'
                }
            }), 400
        
        user_message = data['message']
        persona_id = data.get('persona_id', None)
        
        # Generate ghost reply using AI service with persona
        ghost_reply = ai_service.generate_ghost_chat_reply(user_message, persona_id)
        
        # Get persona info for response (including voice settings)
        persona_info = None
        if persona_id and persona_id in ai_service.ghost_personas:
            persona = ai_service.ghost_personas[persona_id]
            persona_info = {
                'id': persona_id,
                'name': persona['name'],
                'era': persona['era'],
                'gender': persona['gender'],
                'voice_settings': persona['voice_settings']
            }
        
        return jsonify({
            'success': True,
            'data': {
                'reply': ghost_reply,
                'timestamp': datetime.utcnow().isoformat(),
                'persona': persona_info
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'SERVER_ERROR',
                'message': 'An error occurred processing your request',
                'details': str(e)
            }
        }), 500

@ghost_chat_bp.route('/api/ghost-personas', methods=['GET'])
def get_ghost_personas():
    """
    Get list of available ghost personas
    Returns: { "personas": array }
    """
    try:
        personas_list = []
        for persona_id, persona_data in ai_service.ghost_personas.items():
            personas_list.append({
                'id': persona_id,
                'name': persona_data['name'],
                'era': persona_data['era'],
                'traits': persona_data['traits'],
                'tone': persona_data['tone'],
                'gender': persona_data['gender'],
                'voice_settings': persona_data['voice_settings']
            })
        
        return jsonify({
            'success': True,
            'data': {
                'personas': personas_list
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'SERVER_ERROR',
                'message': 'An error occurred fetching personas',
                'details': str(e)
            }
        }), 500
