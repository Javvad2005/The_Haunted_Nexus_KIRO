import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api, { APIError } from '../services/api';
import audioEffects from '../services/audioEffects'; // Enhancement L: Thunder effect
import FogOverlay from '../components/FogOverlay';
import GhostVoiceButton from '../components/GhostVoiceButton';
import SpookyButton from '../components/SpookyButton';
import styles from './HauntedMap.module.css';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom haunted marker icon
const hauntedIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAzMCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTUgMEMxMCAwIDUgNSA1IDE1QzUgMjUgMTUgNDAgMTUgNDBDMTUgNDAgMjUgMjUgMjUgMTVDMjUgNSAyMCAwIDE1IDBaIiBmaWxsPSIjYjAyNmZmIiBzdHJva2U9IiMwMGYwZmYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjE1IiB5PSIyMCIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZiI+8J+RuzwvdGV4dD48L3N2Zz4=',
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
});

const HauntedMap = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [clusteredLocations, setClusteredLocations] = useState([]); // For overlapping locations
  const [story, setStory] = useState(null);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showClusterModal, setShowClusterModal] = useState(false);

  // Fetch haunted locations on mount
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setIsLoadingLocations(true);
    setError(null);

    try {
      const response = await api.getHauntedLocations();
      const fetchedLocations = response.locations || [];
      console.log(`✅ Fetched ${fetchedLocations.length} haunted locations from API`);
      console.log('Location IDs:', fetchedLocations.map(loc => loc.id).join(', '));
      setLocations(fetchedLocations);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setError(err instanceof APIError ? err.message : 'Failed to load haunted locations');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Find all locations at the same coordinates (within 0.01 degrees)
  const findClusteredLocations = (clickedLocation) => {
    const threshold = 0.01; // ~1km tolerance
    return locations.filter(loc => 
      Math.abs(loc.lat - clickedLocation.lat) < threshold &&
      Math.abs(loc.lng - clickedLocation.lng) < threshold
    );
  };

  const handleMarkerClick = (clickedLocation) => {
    // Enhancement L: Thunder crack on dangerous locations
    console.log('🗺️ Marker clicked, triggering thunder...');
    try {
      audioEffects.playThunderCrack();
    } catch (error) {
      console.error('Thunder effect error:', error);
    }
    
    const clustered = findClusteredLocations(clickedLocation);
    
    if (clustered.length > 1) {
      // Multiple locations at same spot - show selection modal
      console.log(`🎯 Found ${clustered.length} locations at this marker`);
      setClusteredLocations(clustered);
      setShowClusterModal(true);
    } else {
      // Single location - show story directly
      loadStoryForLocation(clickedLocation);
    }
  };

  const loadStoryForLocation = async (location) => {
    setSelectedLocation(location);
    setStory(null);
    setShowModal(true);
    setShowClusterModal(false);
    setIsLoadingStory(true);

    try {
      const response = await api.getGhostStory(location.id);
      setStory(response);
    } catch (err) {
      console.error('Failed to fetch ghost story:', err);
      setStory({
        story: 'The spirits are silent... Try again later.',
        ending_type: 'whisper',
      });
    } finally {
      setIsLoadingStory(false);
    }
  };

  const closeClusterModal = () => {
    setShowClusterModal(false);
    setClusteredLocations([]);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLocation(null);
    setStory(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Haunted Map</h1>
        <p className={styles.subtitle}>
          Explore cursed locations around the world... Click a marker to hear their tales
        </p>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
          <SpookyButton onClick={fetchLocations} variant="secondary">
            Retry
          </SpookyButton>
        </div>
      )}

      {isLoadingLocations ? (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Summoning haunted locations...</p>
        </div>
      ) : (
        <div className={styles.mapWrapper}>
          <FogOverlay intensity="low" />
          <MapContainer
            center={[20, 0]}
            zoom={2}
            className={styles.map}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={[location.lat, location.lng]}
                icon={hauntedIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(location),
                }}
              >
                <Popup>
                  <div className={styles.popupContent}>
                    <h3>{location.name}</h3>
                    <p>{location.description}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Cluster Selection Modal - Shows when multiple locations overlap */}
      {showClusterModal && clusteredLocations.length > 0 && (
        <div className={styles.modal} onClick={closeClusterModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeClusterModal}>
              ✕
            </button>

            <h2 className={styles.modalTitle}>
              👻 Multiple Haunted Locations Found
            </h2>
            <p className={styles.modalDescription}>
              {clusteredLocations.length} cursed places exist at this location. Choose one to hear its tale...
            </p>

            <div className={styles.clusterList}>
              {clusteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  className={styles.clusterItem}
                  onClick={() => loadStoryForLocation(loc)}
                >
                  <div className={styles.clusterIcon}>👻</div>
                  <div className={styles.clusterInfo}>
                    <h3 className={styles.clusterName}>{loc.name}</h3>
                    <p className={styles.clusterDesc}>{loc.description}</p>
                  </div>
                  <div className={styles.clusterArrow}>→</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Story Modal - Shows individual location story */}
      {showModal && selectedLocation && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              ✕
            </button>

            <h2 className={styles.modalTitle}>{selectedLocation.name}</h2>
            <p className={styles.modalDescription}>{selectedLocation.description}</p>

            <div className={styles.storySection}>
              {isLoadingStory ? (
                <div className={styles.storyLoading}>
                  <div className={styles.loadingSpinner}></div>
                  <p>The spirits are gathering...</p>
                </div>
              ) : story ? (
                <>
                  <div className={styles.story}>
                    <p>{story.story}</p>
                    <span className={styles.endingType}>
                      Ending: {story.ending_type}
                    </span>
                  </div>
                  <div className={styles.voiceButtonWrapper}>
                    <GhostVoiceButton text={story.story} />
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HauntedMap;
