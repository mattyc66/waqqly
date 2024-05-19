import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import './login.css';


const Login = () => {
const navigate = useNavigate()
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const login = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;

        localStorage.setItem('userUID', uid);
        console.log(userCredential);
        navigate('/main');
    })
    .catch((error) => {
        console.error("auth error", error)
        alert("please check your email and password")
    })
}

    return (
        <div className='login-container'>
        <div className="login-box">
            <div className="login-head">
                <h1 className="text-large"><strong>Sign in</strong></h1>
                <p className="text-normal">New user? <span><a href="/sign" className="text-link">Create an account</a></span>
            </p>
            </div>
            <form className='form' onSubmit={login}>
                <div className="input">
                    <input type="email" placeholder="Enter email" value={email} onChange={(event) => setEmail(event.target.value)}  className='input-entry' />
                </div>
                <div className="input">
                    <input required type="password" placeholder='Enter password' value={password} onChange={(event) => setPassword(event.target.value)} className="input-entry" />
                </div>
                <button required className="login-button" name='login' type='login'>Login</button>
            </form>
        </div>
      </div>
    );
  }
  
  export default Login;