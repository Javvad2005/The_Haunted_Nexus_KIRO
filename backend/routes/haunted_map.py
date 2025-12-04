from flask import Blueprint, request, jsonify
from services.ai_service import ai_service

haunted_map_bp = Blueprint('haunted_map', __name__)

# Haunted locations data (20-30 locations worldwide)
HAUNTED_LOCATIONS = [
    {'id': '1', 'name': 'The Whispering Woods', 'lat': 40.7128, 'lng': -74.0060, 'description': 'Ancient forest where voices echo through the mist'},
    {'id': '2', 'name': 'Abandoned Asylum', 'lat': 34.0522, 'lng': -118.2437, 'description': 'Halls of forgotten souls and endless screams'},
    {'id': '3', 'name': 'Cursed Cemetery', 'lat': 41.8781, 'lng': -87.6298, 'description': 'Where the dead never rest in peace'},
    {'id': '4', 'name': 'Phantom Lighthouse', 'lat': 37.7749, 'lng': -122.4194, 'description': 'Beacon for lost spirits at sea'},
    {'id': '5', 'name': 'Haunted Manor', 'lat': 51.5074, 'lng': -0.1278, 'description': 'Victorian mansion of dark mysteries'},
    {'id': '6', 'name': 'Shadow Bridge', 'lat': 48.8566, 'lng': 2.3522, 'description': 'Crossing between the living and dead'},
    {'id': '7', 'name': 'Witch\'s Hollow', 'lat': 35.6762, 'lng': 139.6503, 'description': 'Ancient ritual grounds of dark magic'},
    {'id': '8', 'name': 'Ghost Ship Bay', 'lat': -33.8688, 'lng': 151.2093, 'description': 'Where phantom vessels eternally dock'},
    {'id': '9', 'name': 'Spectral Cathedral', 'lat': 55.7558, 'lng': 37.6173, 'description': 'Sacred haunted sanctuary of lost prayers'},
    {'id': '10', 'name': 'Cursed Mine', 'lat': 39.7392, 'lng': -104.9903, 'description': 'Depths of eternal darkness and despair'},
    {'id': '11', 'name': 'Phantom Opera House', 'lat': 40.7580, 'lng': -73.9855, 'description': 'Where ghostly performances never end'},
    {'id': '12', 'name': 'Bleeding Castle', 'lat': 55.9533, 'lng': -3.1883, 'description': 'Walls that weep crimson tears'},
    {'id': '13', 'name': 'Screaming Tunnels', 'lat': 43.0896, 'lng': -79.0849, 'description': 'Underground passages of eternal agony'},
    {'id': '14', 'name': 'Doll Island', 'lat': 19.2900, 'lng': -99.0950, 'description': 'Thousands of possessed dolls watching'},
    {'id': '15', 'name': 'Suicide Forest', 'lat': 35.4697, 'lng': 138.6380, 'description': 'Where lost souls wander forever'},
    {'id': '16', 'name': 'Plague Village', 'lat': 53.2500, 'lng': -1.6167, 'description': 'Abandoned town of the infected dead'},
    {'id': '17', 'name': 'Vampire Castle', 'lat': 45.5144, 'lng': 25.3675, 'description': 'Home of the immortal bloodthirsty'},
    {'id': '18', 'name': 'Banshee Cliffs', 'lat': 53.3498, 'lng': -6.2603, 'description': 'Where death omens wail at night'},
    {'id': '19', 'name': 'Voodoo Swamp', 'lat': 29.9511, 'lng': -90.0715, 'description': 'Cursed wetlands of dark rituals'},
    {'id': '20', 'name': 'Poltergeist Prison', 'lat': 37.8267, 'lng': -122.4233, 'description': 'Cells that trap spirits forever'},
    {'id': '21', 'name': 'Demon\'s Gate', 'lat': 41.9028, 'lng': 12.4964, 'description': 'Portal to the underworld itself'},
    {'id': '22', 'name': 'Wraith Monastery', 'lat': 27.1751, 'lng': 78.0421, 'description': 'Temple of restless monk spirits'},
    {'id': '23', 'name': 'Zombie Plantation', 'lat': 18.5944, 'lng': -72.3074, 'description': 'Fields where the dead still toil'},
    {'id': '24', 'name': 'Headless Horseman Bridge', 'lat': 41.0534, 'lng': -73.8642, 'description': 'Where the rider claims new heads'},
    {'id': '25', 'name': 'Siren\'s Cove', 'lat': 37.9838, 'lng': 23.7275, 'description': 'Beach where sailors meet their doom'},
    {'id': '26', 'name': 'Wendigo Woods', 'lat': 46.8139, 'lng': -71.2080, 'description': 'Forest of the cannibalistic spirit'},
    {'id': '27', 'name': 'Mummy\'s Tomb', 'lat': 29.9792, 'lng': 31.1342, 'description': 'Ancient burial site of cursed pharaohs'},
    {'id': '28', 'name': 'Kraken\'s Deep', 'lat': 59.9139, 'lng': 10.7522, 'description': 'Waters where the beast lurks below'},
    {'id': '29', 'name': 'Chupacabra Ranch', 'lat': 25.6866, 'lng': -100.3161, 'description': 'Where livestock mysteriously perish'},
    {'id': '30', 'name': 'Mothman Bridge', 'lat': 38.4192, 'lng': -82.4452, 'description': 'Crossing guarded by winged terror'},
    # Additional 20 locations for enhanced experience
    {'id': '31', 'name': 'Skinwalker Ranch', 'lat': 40.2586, 'lng': -109.8909, 'description': 'Shapeshifting entities roam the desert'},
    {'id': '32', 'name': 'Black Eyed Children Corner', 'lat': 32.7555, 'lng': -97.3308, 'description': 'Where soulless children knock at night'},
    {'id': '33', 'name': 'Shadow People Alley', 'lat': 34.0522, 'lng': -118.2437, 'description': 'Dark figures lurk in peripheral vision'},
    {'id': '34', 'name': 'Goatman\'s Bridge', 'lat': 33.1106, 'lng': -97.1350, 'description': 'Half-man, half-beast guards the crossing'},
    {'id': '35', 'name': 'Jersey Devil Pines', 'lat': 39.9259, 'lng': -74.5746, 'description': 'Winged demon haunts the barrens'},
    {'id': '36', 'name': 'Slender Man Forest', 'lat': 43.0389, 'lng': -87.9065, 'description': 'Tall faceless figure stalks the woods'},
    {'id': '37', 'name': 'Bloody Mary Mirror', 'lat': 41.8781, 'lng': -87.6298, 'description': 'Reflections show your darkest fate'},
    {'id': '38', 'name': 'Crying Boy Orphanage', 'lat': 53.4808, 'lng': -2.2426, 'description': 'Cursed paintings bring fire and death'},
    {'id': '39', 'name': 'Dybbuk Box Warehouse', 'lat': 45.5152, 'lng': -122.6784, 'description': 'Possessed wine cabinet of nightmares'},
    {'id': '40', 'name': 'Annabelle\'s Attic', 'lat': 41.4115, 'lng': -73.2742, 'description': 'Demonic doll watches from the shadows'},
    {'id': '41', 'name': 'Robert the Doll Museum', 'lat': 24.5551, 'lng': -81.7800, 'description': 'Cursed toy that moves on its own'},
    {'id': '42', 'name': 'Myrtles Plantation', 'lat': 30.7833, 'lng': -91.2167, 'description': 'Most haunted home in America'},
    {'id': '43', 'name': 'Winchester Mystery House', 'lat': 37.3184, 'lng': -121.9511, 'description': 'Maze built to confuse spirits'},
    {'id': '44', 'name': 'Poveglia Island', 'lat': 45.3958, 'lng': 12.3264, 'description': 'Plague island of tortured souls'},
    {'id': '45', 'name': 'Hoia Baciu Forest', 'lat': 46.7712, 'lng': 23.5894, 'description': 'Bermuda Triangle of Transylvania'},
    {'id': '46', 'name': 'Aokigahara Sea of Trees', 'lat': 35.4697, 'lng': 138.6380, 'description': 'Forest where compasses fail'},
    {'id': '47', 'name': 'Catacombs of Paris', 'lat': 48.8338, 'lng': 2.3324, 'description': 'Six million skeletons line the walls'},
    {'id': '48', 'name': 'Bhangarh Fort', 'lat': 27.0974, 'lng': 76.2708, 'description': 'Cursed city forbidden after dark'},
    {'id': '49', 'name': 'Island of the Dolls', 'lat': 19.2900, 'lng': -99.0950, 'description': 'Mutilated dolls hang from every tree'},
    {'id': '50', 'name': 'Leap Castle', 'lat': 53.0833, 'lng': -7.7167, 'description': 'Elemental demon guards the oubliette'},
]

@haunted_map_bp.route('/api/haunted-locations', methods=['GET'])
def get_haunted_locations():
    """
    Get list of haunted locations
    Returns: { "locations": array }
    """
    try:
        return jsonify({
            'success': True,
            'data': {
                'locations': HAUNTED_LOCATIONS
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'SERVER_ERROR',
                'message': 'An error occurred fetching locations',
                'details': str(e)
            }
        }), 500

@haunted_map_bp.route('/api/ghost-story', methods=['POST'])
def get_ghost_story():
    """
    Generate ghost story for a location
    Expects: { "location_id": string }
    Returns: { "story": string, "ending_type": string }
    """
    try:
        data = request.get_json()
        
        if not data or 'location_id' not in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'INVALID_REQUEST',
                    'message': 'Location ID is required'
                }
            }), 400
        
        location_id = data['location_id']
        
        # Find the location
        location = next((loc for loc in HAUNTED_LOCATIONS if loc['id'] == location_id), None)
        
        if not location:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'LOCATION_NOT_FOUND',
                    'message': 'Location not found',
                    'details': f'No location found with ID: {location_id}'
                }
            }), 404
        
        # Generate ghost story using AI service
        try:
            story_data = ai_service.generate_ghost_story(
                location['name'],
                location['description']
            )
            
            return jsonify({
                'success': True,
                'data': story_data
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'error': {
                    'code': 'STORY_GENERATION_ERROR',
                    'message': 'Failed to generate ghost story',
                    'details': str(e)
                }
            }), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 'SERVER_ERROR',
                'message': 'An error occurred generating story',
                'details': str(e)
            }
        }), 500
