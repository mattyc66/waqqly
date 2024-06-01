import React, { useState, useEffect } from 'react';
import profileLogo from '../images/profile-icon.png';
import {database, storage } from '../firebase';
import { ref as Ref, getDownloadURL } from "firebase/storage";
import { ref, get, update } from 'firebase/database';
import './profile.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [userType, setUserType] = useState(null);
    const [postcode, setPostcode] = useState(''); 
    const [isWalker, setIsWalker] = useState(false); 
    const [isOwner, setIsOwner] = useState(false);  
    const [imageUpload, setImageUpload] = useState(null);
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
        const uid = localStorage.getItem('userUID');
    
        
        const ownersRef = ref(database, `users/Owners/${uid}`);
        get(ownersRef).then((snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                setUserData(userData);
                setUserType('Owners');
                setIsOwner(true); 
            }
        }).catch((error) => {
            console.error('Error fetching owner data:', error);
        });
        
        if (!userData) {
            const walkersRef = ref(database, `users/Walkers/${uid}`);
            get(walkersRef).then((snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    setUserData(userData);
                    setUserType('Walkers');
                    setIsWalker(true); 
                }
            }).catch((error) => {
                console.error('Error fetching walker data:', error);
            });
        }
    
        
        if (userType) {
            const imageRef = Ref(storage, `users/${userType}/${uid}/profile.jpg`);
            getDownloadURL(imageRef)
                .then((url) => {
                    setProfileImage(url);
                })
                .catch((error) => {
                    console.error('Error fetching profile image:', error);
                });
        }

        if (userData && userData.Postcode) {
            setPostcode(userData.Postcode);
        }

    }, [userType, userData]);

    
    const handleApplyChanges = () => {
        const uid = localStorage.getItem('userUID');
        const userRef = ref(database, `users/${userType}/${uid}`);
        const updatedUserData = { ...userData, Postcode: postcode };
        update(userRef, updatedUserData)
            .then(() => {
                console.log('Profile updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
            });
    };

    const WalkerButtonClick = () => {
        setUserType('Walkers');
        setIsWalker(true);
        setIsOwner(false);
    };

    const OwnerButtonClick = () => {
        setUserType('Owners');
        setIsOwner(true);
        setIsWalker(false);
    };

    const imageUploadEvent = (event => {
        setImageUpload(event.target.files[0]);
        const imageURL = URL.createObjectURL(event.target.files[0]);
        setImageURL(imageURL)

    });

    return (
        <div className='profile-container'>
            <div className="profile-info-container">
                <div className="profile-header">
                    <h1 className=""><strong>My profile</strong></h1>
                </div>
                <div className="personal-info">
                    <div>
                    <input type='file' onChange={imageUploadEvent}/>
                    <img className='profile-img' src={profileImage || profileLogo} alt="Profile" />
                    </div>
                    <div className="name-edit">
                        <label className="edit-label">First Name:</label>
                        <input type="text" value={userData?.Firstname ||  ''} onChange={(e) => setUserData({...userData, Lastname: e.target.value})} className="edit-input" />
                    </div>
                    <div className="name-edit">
                        <label className="edit-label">Last Name:</label>
                        <input type="text" value={userData?.Lastname ||  ''} onChange={(e) => setUserData({...userData, Lastname: e.target.value})} className="edit-input" />
                    </div>
                    <div className='postcode-edit'>
                        <label className='edit-label'>Postcode:</label>
                        <input type="text" className='edit-input' value={postcode} onChange={(e) => setPostcode(e.target.value)}/>
                    </div>
                    <div className='type-buttons'>
                        <label className='edit-label type'>Account type</label>
                        <button className={`type-button walk ${isWalker ? 'depressed' : ''}`} onClick={WalkerButtonClick}>Walker</button>
                    <button className={`type-button own ${isOwner ? 'depressed' : ''}`} onClick={OwnerButtonClick}>Owner</button>
                    </div>
                        <div >
                            <label className="about-label">About Me:</label>
                            <textarea value={userData?.About} maxLength="150" onChange={(e) => setUserData({...userData, About: e.target.value})} className="about-textarea"></textarea>
                        </div>
                    <button className="apply-button" onClick={handleApplyChanges}>Apply Changes</button>
                </div>
            </div>
        </div>
    );
}

export default Profile;