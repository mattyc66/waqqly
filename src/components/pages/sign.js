import React, { useState } from 'react';
import './sign.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref as Ref, getDownloadURL } from "firebase/storage";
import { auth, database, storage } from '../firebase';
import { ref, set } from 'firebase/database';
import profileLogo from '../images/profile-icon.png';
import { FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import { uploadBytes } from 'firebase/storage';



const Sign = () => {
    const [selectedType, setSelectedType] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [postcode, setPostcode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [imageUpload, setImageUpload] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const nav = useNavigate();

    const switchToSign2 = (type) => {
        setSelectedType(type);
    };
    
    const imageUploadEvent = (event => {
        setImageUpload(event.target.files[0]);
        const imageURL = URL.createObjectURL(event.target.files[0]);
        setImageURL(imageURL)
    });

    const validatePostcode = async (postcode) => {
        try {
            const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}/validate`);
            const data = await response.json();
            return data.result; // Returns true if valid, false otherwise
        } catch (error) {
            console.error('Error validating postcode:', error);
            return false;
        }
    };


    const register = async (event) => {
        event.preventDefault();
        const isPostcodeValid = await validatePostcode(postcode);
        if (!isPostcodeValid) {
            setErrorMessage('Invalid postcode', postcode);
            return;
        }
    
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const uid = user.uid;
            set(ref(database, `users/${selectedType}/${uid}`), {
                Firstname: firstName,
                Lastname: lastName,
                Postcode: postcode,
                Email: email,
                About: "This user has not provided any information."
            });
            if (imageUpload) {
                console.log('Image Upload:', imageUpload);
                const imageRef = Ref(storage, `users/${selectedType}/${uid}/profile.jpg`);
                if (imageUpload.type.startsWith('image')) {
                    uploadBytes(imageRef, imageUpload).then(() => {
                        getDownloadURL(imageRef).then(url=> {
                            setImageURL(url);
                        })
                        console.log('Image Ref:', imageRef);
                        alert("image uploaded")
                    }).catch((error) => {
                        console.error('error uploading image: ',error)
                    });
                } else {
                    console.error('Error: Uploaded file is not an image');
                }
            } else {
                const defaultImageRef = Ref(storage, `users/${selectedType}/${uid}/${profileLogo}`);
                uploadBytes(defaultImageRef, profileLogo).then(() => {
                    getDownloadURL(defaultImageRef).then(url => {
                        setImageURL(url);
                    });
                    console.log('Default Image uploaded:', defaultImageRef);
                    alert("Default image uploaded");
                }).catch((error) => {
                    console.error('error uploading default image: ', error);
                });
            }
            nav('/profile');
            localStorage.setItem('userUID', uid);
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                setErrorMessage('Email already in use');
            }
        });
    }


    return (
        <div className='sign-container'>
            {selectedType ? (
                <div className="sign2">
                        <div className="sign2-box">
                <div className="sign2-head">
                <h1 className="text-large"><strong>Register</strong></h1>
                <p className="text-normal">Already a user? <span><a href="/login" className="text-link">Login</a></span></p>
                </div>
                {errorMessage && <p className='error-message'>{errorMessage} </p>}
                    <form className='form' onSubmit={register}>
                        <div className="profile-info-input">
                            <input type='file' onChange={imageUploadEvent}/>
                            <img src={imageURL || profileLogo} alt='profile' className="profile-image"></img>
                            <div className="name-input">
                                <input required type="text" placeholder='First name' value={firstName} onChange={(event) => setFirstName(event.target.value)} className="name-input-entry"/>
                                <input required type="text" placeholder='Last name' value={lastName} onChange={(event) => setLastName(event.target.value)} className="name-input-entry" />
                            </div>
                        </div>
                        <div className="input">
                            <input required type="text" placeholder='Enter postcode' value={postcode} onChange={(event) => setPostcode(event.target.value)} className="input-entry" />
                        </div>
                        <div className="input">
                            <input required type="email" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)} className='input-entry' />
                        </div>
                        <div className="input">
                            <input required type="password" placeholder='Enter password' value={password} onChange={(event) => setPassword(event.target.value)} className="input-entry" />
                        </div>
                        <button className="register-button" name='register' type='register'>Register</button>
                    </form>
                </div>
                </div>
            ) : (
                <div className="sign-box">
                    <h2>What type are you:</h2>
                    <div className="type-buttons">
                        <button className="sign-button walker" onClick={() => switchToSign2('Walkers')}>Walker</button>
                        <button className="sign-button owner" onClick={() => switchToSign2('Owners')}>Owner</button>
                    </div>
                </div>
            )}
        </div>
    );
}
  
  export default Sign;