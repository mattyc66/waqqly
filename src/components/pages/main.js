import React, { useState, useEffect } from 'react';
import './main.css';
import { database, storage } from '../firebase';
import { ref, onValue } from 'firebase/database';
import profilePlaceholder from '../images/profile-icon.png';
import { ref as Ref, getDownloadURL } from "firebase/storage";
import { TileLayer, MapContainer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css"
import { fetchCoordinates } from '../geocode';
import L from 'leaflet';


const Main = () => {
    const [walkers, setWalkers] = useState([]);
    const [walkerLocations, setWalkerLocations] = useState([]);
    const [expandedWalkerId, setExpandedWalkerId] = useState(null);
    const googleMapsApiKey = 'AIzaSyCOocKwlCnFBdZL7pbcek5tdu3vBIiuYgA';

    useEffect(() => {
        const walkersRef = ref(database, 'users/Walkers');

        const fetchData = (snapshot) => {
            const walkerData = snapshot.val();
            if (walkerData) {
                const walkerDetails = Object.entries(walkerData).map(async ([uid, details]) => {
                    const imageRef = Ref(storage, `users/Walkers/${uid}/profile.jpg`);
                    const imageUrl = await getDownloadURL(imageRef).catch(error => console.error('Error getting image URL:', error));
                    const coordinates = await fetchCoordinates(details.Postcode, googleMapsApiKey).catch(error => console.error('Error fetching coordinates:', error));
                    return { uid, ...details, imageUrl, coordinates };
                });
                Promise.all(walkerDetails).then(data => setWalkers(data));
            } else {
                setWalkers([]);
            }
        };
        const unsubscribe = onValue(walkersRef, fetchData);
        return () => {
            unsubscribe();
        };
    }, []);

    const fetchCoordinates = async (postcode, apiKey) => {
        const response = await fetch('https://geocode-microservice-ckrgg2nlsa-nw.a.run.app/fetch-coordinates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postcode, apiKey })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Error fetching coordinates: ${error}`);
        }

        const data = await response.json();
        if (data.lat && data.lng) {
            return { lat: data.lat, lng: data.lng };
        }
        throw new Error('No coordinates found for the given postcode');
    };

    useEffect(() => {
        const locations = walkers.map(walker => walker.coordinates).filter(Boolean);
        setWalkerLocations(locations);
    }, [walkers]);

    const defaultIcon = L.icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const toggleExpand = (uid) => {
        setExpandedWalkerId(expandedWalkerId === uid ? null : uid);
    };

    return (
        <div className='main-container'>
            <div className="left-column">
                {walkers.map((walker) => (
                    <div
                        key={walker.uid}
                        className={`walker-details ${expandedWalkerId === walker.uid ? 'expanded' : ''}`}
                        onClick={() => toggleExpand(walker.uid)}
                    >
                        <div className='walker-profile'>
                            <img src={walker.imageUrl || profilePlaceholder} className='walker-profile-image' />
                            <div className='detail-list'>
                                <p className='Name'>{walker.Firstname} {walker.Lastname}</p>
                                <p className='postcode'>Postcode: {walker.Postcode}</p>
                                {expandedWalkerId === walker.uid && <p className='email'>Email: {walker.Email}</p>}
                            </div>
                        </div>
                        {expandedWalkerId === walker.uid && <p className="about-walker">{walker.About}</p>}
                    </div>
                ))}
            </div>
            <div className="right-column">
                <MapContainer center={[51.509865, -0.118092]} zoom={13}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {walkerLocations.map((location, index) => (
                        <Marker key={index} position={[location.lat, location.lng]} icon={defaultIcon}>
                            <Popup>{walkers[index].Firstname} {walkers[index].Lastname}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default Main;