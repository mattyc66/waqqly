import React from 'react';
import './homepage.css';
import banner from '../images/banner1.jpg'
import { Link } from 'react-router-dom'
import banner2 from '../images/waqq.ly3.png'
import dog1 from '../images/dog1.jpg'
import dog2 from '../images/dog2.jpg'


const Home = () => {
  return (
    <div className='home-container'>
    <div className="hero-section">
      <img src={banner2} alt="home banner" className='banner-image' />
      <div className='hero-content'>
        <p>sign up today to use our servies</p>
        <Link to='/sign'>
        <button className='start-button'>Get started</button>
        </Link>
      </div>
    </div>
    <div className="content-container">
      <div className="section top-left">
        <img src={dog1} alt="dog 1" className="home-image" />
      </div>
      <div className="section top-right">
        <h2>About us</h2>
        <p>At Waqqly, we're passionate about connecting local dog walkers with dog owners in need of reliable pet care. Our platform is designed to make finding the perfect dog walker easy and convenient. Whether you're a busy professional, a new pet parent, or just in need of some extra help, Waqqly is here to ensure your furry friend gets the care and attention they deserve.</p>
      </div>
      <div className="section bottom-left">
        <h2>What we offer</h2>
        <p><p>With Waqqly, you can find experienced dog walkers in your neighborhood who are ready to take your pup on exciting adventures. Our network of vetted and trustworthy walkers are passionate about dogs and committed to providing top-notch care. Whether it's daily walks, playtime at the park, or customized care tailored to your pet's needs, Waqqly has you covered. Sign up today and discover the perfect dog walking solution for you and your four-legged friend!</p></p>
      </div>
      <div className="section bottom-right">
        <img src={dog2} alt="dog 2" className="home-image" />
      </div>
    </div>
  </div>
  );
}

export default Home;