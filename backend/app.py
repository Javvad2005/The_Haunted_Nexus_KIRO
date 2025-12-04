from flask import Flask
from flask_cors import CORS
from config import Config

# Import blueprints
from routes.ghost_chat import ghost_chat_bp
from routes.haunted_journal import haunted_journal_bp
from routes.reanimator import reanimator_bp
from routes.frankenstein_stitcher import frankenstein_stitcher_bp
from routes.haunted_map import haunted_map_bp
from routes.cursed_image import cursed_image_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for frontend
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(ghost_chat_bp)
    app.register_blueprint(haunted_journal_bp)
    app.register_blueprint(reanimator_bp)
    app.register_blueprint(frankenstein_stitcher_bp)
    app.register_blueprint(haunted_map_bp)
    app.register_blueprint(cursed_image_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
