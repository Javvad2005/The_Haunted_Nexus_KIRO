from flask import Blueprint, request, jsonify
import base64
from io import BytesIO
from PIL import Image, ImageFilter, ImageEnhance
import random

cursed_image_bp = Blueprint('cursed_image', __name__)

@cursed_image_bp.route('/api/cursed-image/ai-transform', methods=['POST'])
def ai_transform_image():
    """
    AI-powered image transformation
    Expects: { "image": base64_string, "prompt": string, "style": string }
    Returns: { "transformed_image": base64_string, "description": string }
    """
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_REQUEST',
                    'message': 'Image data is required'
                }
            }), 400
        
        image_data = data['image']
        prompt = data.get('prompt', 'cursed horror')
        style = data.get('style', 'horror')
        
        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))
        
        # TODO: Integrate with AI image API (OpenAI DALL-E, Stability AI, etc.)
        # For now, use advanced PIL-based transformations as fallback
        transformed_image = _apply_ai_style_fallback(image, style, prompt)
        
        # Convert back to base64
        buffered = BytesIO()
        transformed_image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        # Generate description
        description = _generate_transformation_description(style, prompt)
        
        return jsonify({
            'success': True,
            'data': {
                'transformed_image': f'data:image/png;base64,{img_str}',
                'description': description,
                'style': style,
                'prompt': prompt
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'SERVER_ERROR',
                'message': 'An error occurred processing the image',
                'details': str(e)
            }
        }), 500

def _apply_ai_style_fallback(image, style, prompt):
    """
    Advanced PIL-based image transformation as fallback
    Simulates AI-style transformations using multiple filters
    """
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Apply style-specific transformations
    if style == 'horror':
        return _apply_horror_style(image)
    elif style == 'vintage_horror':
        return _apply_vintage_horror_style(image)
    elif style == 'glitch_nightmare':
        return _apply_glitch_nightmare_style(image)
    elif style == 'ethereal_ghost':
        return _apply_ethereal_ghost_style(image)
    elif style == 'blood_ritual':
        return _apply_blood_ritual_style(image)
    elif style == 'corrupted':
        return _apply_corrupted_style(image)
    else:
        return _apply_horror_style(image)

def _apply_horror_style(image):
    """Dark, desaturated, high contrast horror look"""
    # Desaturate
    enhancer = ImageEnhance.Color(image)
    image = enhancer.enhance(0.3)
    
    # Increase contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.8)
    
    # Darken
    enhancer = ImageEnhance.Brightness(image)
    image = enhancer.enhance(0.7)
    
    # Add slight blur for atmosphere
    image = image.filter(ImageFilter.GaussianBlur(radius=0.5))
    
    # Sharpen edges for eerie effect
    image = image.filter(ImageFilter.SHARPEN)
    
    return image

def _apply_vintage_horror_style(image):
    """Old photograph with sepia and damage"""
    # Convert to grayscale
    image = image.convert('L')
    
    # Convert back to RGB for sepia
    image = image.convert('RGB')
    
    # Apply sepia tone
    width, height = image.size
    pixels = image.load()
    
    for py in range(height):
        for px in range(width):
            r, g, b = image.getpixel((px, py))
            
            tr = int(0.393 * r + 0.769 * g + 0.189 * b)
            tg = int(0.349 * r + 0.686 * g + 0.168 * b)
            tb = int(0.272 * r + 0.534 * g + 0.131 * b)
            
            # Darken for horror effect
            tr = int(tr * 0.7)
            tg = int(tg * 0.7)
            tb = int(tb * 0.7)
            
            pixels[px, py] = (min(tr, 255), min(tg, 255), min(tb, 255))
    
    # Add grain
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.3)
    
    return image

def _apply_glitch_nightmare_style(image):
    """Digital corruption and glitch effects"""
    width, height = image.size
    pixels = image.load()
    
    # Create glitch bands
    for i in range(5):
        y_start = random.randint(0, height - 50)
        y_end = y_start + random.randint(10, 50)
        offset = random.randint(-20, 20)
        
        for py in range(y_start, min(y_end, height)):
            for px in range(width):
                new_px = (px + offset) % width
                if 0 <= new_px < width:
                    pixels[px, py] = pixels[new_px, py]
    
    # Increase contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.5)
    
    # Add color shift
    r, g, b = image.split()
    image = Image.merge('RGB', (b, r, g))
    
    return image

def _apply_ethereal_ghost_style(image):
    """Faded, translucent, otherworldly appearance"""
    # Lighten significantly
    enhancer = ImageEnhance.Brightness(image)
    image = enhancer.enhance(1.4)
    
    # Desaturate heavily
    enhancer = ImageEnhance.Color(image)
    image = enhancer.enhance(0.2)
    
    # Add blur for ethereal effect
    image = image.filter(ImageFilter.GaussianBlur(radius=2))
    
    # Reduce contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(0.7)
    
    return image

def _apply_blood_ritual_style(image):
    """Red-tinted, ominous, ritualistic atmosphere"""
    width, height = image.size
    pixels = image.load()
    
    # Add red tint and darken
    for py in range(height):
        for px in range(width):
            r, g, b = image.getpixel((px, py))
            
            # Increase red, decrease others
            r = min(int(r * 1.3), 255)
            g = int(g * 0.6)
            b = int(b * 0.6)
            
            pixels[px, py] = (r, g, b)
    
    # Increase contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.6)
    
    # Darken
    enhancer = ImageEnhance.Brightness(image)
    image = enhancer.enhance(0.8)
    
    return image

def _apply_corrupted_style(image):
    """Heavily distorted, corrupted data appearance"""
    # Posterize for digital corruption look
    image = image.convert('P', palette=Image.ADAPTIVE, colors=16)
    image = image.convert('RGB')
    
    # High contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2.0)
    
    # Desaturate partially
    enhancer = ImageEnhance.Color(image)
    image = enhancer.enhance(0.5)
    
    # Add edge enhancement
    image = image.filter(ImageFilter.EDGE_ENHANCE_MORE)
    
    return image

def _generate_transformation_description(style, prompt):
    """Generate description of the AI transformation"""
    descriptions = {
        'horror': [
            "The image has been consumed by darkness, shadows deepening into an abyss of terror.",
            "Reality warps and twists, revealing the horror that lurks beneath the surface.",
            "The spirits have touched this image, leaving their mark of eternal dread."
        ],
        'vintage_horror': [
            "Time has corrupted this photograph, aging it into a cursed relic from a forgotten era.",
            "The image appears as if discovered in an abandoned asylum, yellowed and haunted.",
            "Decades of darkness have seeped into every pixel, creating a window to the past's horrors."
        ],
        'glitch_nightmare': [
            "Digital corruption spreads like a virus, fragmenting reality into a nightmare.",
            "The image glitches between dimensions, caught in a loop of technological horror.",
            "Data decay reveals glimpses of something that should not exist in our reality."
        ],
        'ethereal_ghost': [
            "The image fades into the spectral realm, becoming translucent and otherworldly.",
            "Ghostly energy permeates every pixel, creating an ethereal, haunting presence.",
            "The boundary between the living and the dead blurs, leaving only whispers of what was."
        ],
        'blood_ritual': [
            "Crimson energy flows through the image, as if blood itself has stained reality.",
            "The ritual is complete, and the image now bears the mark of dark ceremonies.",
            "Red moonlight bathes the scene, revealing truths better left hidden."
        ],
        'corrupted': [
            "The image has been corrupted beyond recognition, twisted by forces unknown.",
            "Digital entropy consumes the photograph, leaving only fragments of coherent reality.",
            "Something has infected this image, warping it into a distorted reflection of horror."
        ]
    }
    
    style_descriptions = descriptions.get(style, descriptions['horror'])
    return random.choice(style_descriptions)

@cursed_image_bp.route('/api/cursed-image/styles', methods=['GET'])
def get_ai_styles():
    """
    Get available AI transformation styles
    Returns: { "styles": array }
    """
    try:
        styles = [
            {
                'id': 'horror',
                'name': 'Horror',
                'description': 'Dark, desaturated, high contrast nightmare',
                'icon': '😱'
            },
            {
                'id': 'vintage_horror',
                'name': 'Vintage Horror',
                'description': 'Aged photograph from a cursed past',
                'icon': '📜'
            },
            {
                'id': 'glitch_nightmare',
                'name': 'Glitch Nightmare',
                'description': 'Digital corruption and reality fragmentation',
                'icon': '📺'
            },
            {
                'id': 'ethereal_ghost',
                'name': 'Ethereal Ghost',
                'description': 'Faded, translucent, otherworldly',
                'icon': '👻'
            },
            {
                'id': 'blood_ritual',
                'name': 'Blood Ritual',
                'description': 'Red-tinted ritualistic atmosphere',
                'icon': '🩸'
            },
            {
                'id': 'corrupted',
                'name': 'Corrupted',
                'description': 'Heavily distorted digital decay',
                'icon': '💀'
            }
        ]
        
        return jsonify({
            'success': True,
            'data': {
                'styles': styles
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'SERVER_ERROR',
                'message': 'An error occurred fetching styles',
                'details': str(e)
            }
        }), 500
