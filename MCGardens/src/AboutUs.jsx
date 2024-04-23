import React from 'react';
import './assets/AboutUs.css';
import BurgerMenu from './BurgerMenu';
import defaultImg from './assets/logo.png';

const AboutUs = () => {
    // Function to handle email redirection
    const handleEmailClick = () => {
        window.location.href = 'mailto:mcgardens.reminders@gmail.com';
    };

    return (
        <div>
            <div className='top-nav'>
                <BurgerMenu />
            </div>

            <div className='backdrop'>
                <div className='content'>
                    <img className="about-us-pic" src={defaultImg} alt="Logo" />
                    <div>
                        <h1 className='about-us-title'>About Us</h1>
                        <p className='team-info'>
                            We are a dynamic team of Manhattan College students passionate about technology and environmental sustainability. 
                            As part of our capstone project, we created this platform to empower individuals interested in home gardening. 
                            Our diverse skills in software development have allowed us to design a comprehensive tool that simplifies learning 
                            about plants and managing gardening activities. Our website provides detailed plant biographies, care instructions, 
                            and user-friendly scheduling features, all enhanced by OpenAI's ChatGPT technology. Users can also interact on our discussion board, 
                            check real-time weather forecasts, and find the best plants for their local environment. Join us on this green journey to cultivate your 
                            garden and grow your community.
                        </p>
                        <button onClick={handleEmailClick} className="contact-us-button">Contact Us</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
