import { auth, app, storage } from './firebase'
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ref as Ref, getDownloadURL } from "firebase/storage";
import profileLogo from './images/profile-icon.png';
import './Authentication.css'


function Authentication() {
    const [isAuthenticated, setIsAuthenticated] = useState('');
    const navigate = useNavigate()
    const [profileImage, setProfileImage] = useState(null);

        useEffect(() => {
        const listenAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(user);
                const uid = localStorage.getItem('userUID');
                if (uid) {
                    const imageRefWalkers = Ref(storage, `users/Walkers/${uid}/profile.jpg`);
                    const imageRefOwners = Ref(storage, `users/Owners/${uid}/profile.jpg`);
                    Promise.all([
                        getDownloadURL(imageRefWalkers).catch(() => null),
                        getDownloadURL(imageRefOwners).catch(() => null)
                    ]).then(([walkersImageURL, ownersImageURL]) => {
                        const imageURL = walkersImageURL || ownersImageURL;
                        if (imageURL) {
                            setProfileImage(imageURL);
                        } else {
                            console.log('Profile image not found.');
                        }
                    }).catch((error) => {
                        console.error('Error fetching profile image:', error);
                    });
                }
            } else {
                setIsAuthenticated(null);
            }
        });
        return () => {
            listenAuth();
        };
    }, []);

    const userSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log('user signed out');
                localStorage.clear();
            })
            .catch((error) => console.log('error'));
    };


  return (
    <>
    { isAuthenticated  === null ? 
    <>
        <Link className="Log-button" to='/login'>Login</Link>
        <Link className="Reg-button" to='/sign'>Register</Link>
    </>:
      <>
        <Link to='/profile'>
            <img src={profileImage || profileLogo} className="profile-link-button" />
        </Link>
        <Link className='out-button' to='/' onClick={userSignOut}>Sign out</Link> 
      </>
    }
    </>
  );    
    
}

export default Authentication;