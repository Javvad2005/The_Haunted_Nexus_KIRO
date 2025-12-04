from flask import Blueprint, request, jsonify
from datetime import datetime
from services.ai_service import ai_service

haunted_journal_bp = Blueprint('haunted_journal', __name__)

@haunted_journal_bp.route('/api/haunted-journal', methods=['POST'])
def haunted_journal():
    """
    Handle haunted journal entries
    Expects: { "entry": string }
    Returns: { "emotion": string, "haunted_reply": string, "timestamp": string }
    """
    try:
        data = request.get_json()
        
        if not data or 'entry' not in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_REQUEST',
                    'message': 'Journal entry is required'
                }
            }), 400
        
        journal_entry = data['entry']
        
        if not journal_entry.strip():
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_REQUEST',
                    'message': 'Journal entry cannot be empty'
                }
            }), 400
        
        # Analyze emotion and generate haunted reply using AI service
        result = ai_service.analyze_emotion_and_reply(journal_entry)
        
        return jsonify({
            'success': True,
            'data': {
                'emotion': result['emotion'],
                'haunted_reply': result['haunted_reply'],
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'SERVER_ERROR',
                'message': 'An error occurred processing your journal entry',
                'details': str(e)
            }
        }), 500
