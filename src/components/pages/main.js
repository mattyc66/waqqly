import React, { useState, useEffect } from 'react';
import './main.css';
import { database, storage } from '../firebase';
import { ref, onValue } from 'firebase/database';
import profilePlaceholder from '../images/profile-icon.png';
import { ref as Ref, getDownloadURL } from "firebase/storage";
import { TileLayer, MapContainer } from 'react-leaflet';
import "leaflet/dist/leaflet.css"


const Main = () => {
    const [walkers, setWalkers] = useState([]);

    useEffect(() => { 
        const walkersRef = ref(database, 'users/Walkers');

        const fetchData = (snapshot) => {
            const walkerData = snapshot.val();
            if (walkerData) {
                const walkerDetails = Object.entries(walkerData).map(async ([uid, details]) => {
                    const imageRef = Ref(storage, `users/Walkers/${uid}/profile.jpg`);
                    const imageUrl = await getDownloadURL(imageRef).catch(error => console.error('Error getting image URL:', error));
                    return { uid, ...details, imageUrl };
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


    return (
        <div className='main-container'>
            <div className="left-column">
                {walkers.map((walker) => (      
                    <div key={walker.uid} className="walker-details">
                        <div className='walker-profile'>
                        <img src={walker.imageUrl || profilePlaceholder} className='walker-profile-image'/>
                            <div className='detail-list'>
                                <p className='Name'>{walker.Firstname} {walker.Lastname}</p>
                                <p className='postcode'>Postcode: {walker.Postcode}</p>
                            </div>
                        </div>
                        <p className="about-walker">{walker.About}</p>
                    </div>
                ))}
            </div>
            <div className="right-column">
                <MapContainer center={[51.509865, -0.118092]} zoom={13}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                </MapContainer>
            </div>
        </div>
    );
};

  
  export default Main;