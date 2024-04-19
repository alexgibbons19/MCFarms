import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/PlantDetails.css';
import BurgerMenu from './BurgerMenu';
import defaultImg from './assets/logo.png';

const PlantDetails = () => {
    const [plant, setPlant] = useState({
        plantName: "Generating Information",
        plantBio: "Please wait while generating.",
        plantInst: ["Please wait while generating."],
        plantCare: ["Please wait while generating."],
        plantImg: defaultImg
    });
    const [query, setQuery] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const plantQuery = searchParams.get('query');

    const splitInstructions = (text) => {
        // This regex looks for numbers followed by a dot and space ("1. ", "2. ", etc.) to split into array elements
        return text.split(/(?=\d+\. )/).filter(line => line.trim() !== '');
    };

    const parsePlantDetails = (response) => {
        // Directly use the structured data from the response
        if (response && response.bio && response.howToPlant && response.howToTakeCare) {
            setPlant({
                plantName: plantQuery || "Unknown Plant",
                plantBio: response.bio,
                plantInst: splitInstructions(response.howToPlant),
                plantCare: splitInstructions(response.howToTakeCare),
                plantImg: defaultImg
            });
        } else {
            console.error("Received data is in an unexpected format or not successful:", response);
            setPlant(prevState => ({
                ...prevState,
                plantBio: "Data format error or request unsuccessful.",
                plantInst: ["Data format error or request unsuccessful."],
                plantCare: ["Data format error or request unsuccessful."]
            }));
        }
    };       
    
    useEffect(() => {
        if (plantQuery) {
            const plantName = plantQuery.toLowerCase();
            axios.post('https://us-central1-mcgardens-bd0b1.cloudfunctions.net/askGpt/askGpt', { plantInput: plantName })
                .then(response => {
                    parsePlantDetails(response.data);
                })
                .catch(error => {
                    console.error("API call failed:", error);
                    setPlant(prevState => ({
                    ...prevState,
                    plantBio: "Failed to load data.",
                    plantInst: ["Failed to load data."],
                    plantCare: ["Failed to load data."]
                    }));
                });
        }
    }, [location, plantQuery]);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Check if the query is empty
        if (!query.trim()) {
            alert('Please enter a valid plant name.'); // Display an alert if the input is empty
            return; // Return to prevent further actions
        }
    
        // Set plant to generating/loading state before navigating to the new URL
        setPlant({
            plantName: "Generating Information",
            plantBio: "Please wait while generating.",
            plantInst: ["Please wait while generating."],
            plantCare: ["Please wait while generating."],
            plantImg: defaultImg
        });
    
        // Clear the textbox by setting query to an empty string
        setQuery('');
    
        // Use a slight delay to ensure the state update is rendered before the navigation
        setTimeout(() => {
            navigate(`/plant-details?query=${encodeURIComponent(query)}`);
        }, 0);
    };

    return (
        <div className="plant-details">
            <BurgerMenu />
            <form onSubmit={handleSubmit} style={{ textAlign: 'center', margin: '20px' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for another plant..."
                />
                <button type="submit">Search</button>
            </form>
            <div className="left-container">
                <div className="pic-container">
                    <img className="pic" src={plant.plantImg} alt="Plant" />
                </div>
                <div className="smaller-title">Biography</div>
                <div className="bio-container">
                    <p>{plant.plantBio}</p>
                </div>
            </div>
            <div className="right-container">
                <div className="title-banner">
                    {plant.plantName}
                </div>
                <div className="smaller-title">Planting Instructions</div>
                <div className="inst-container">
                    {plant.plantInst.map((inst, idx) => (
                        <p key={idx} className="instruction-text">{inst}</p> // Changed from list to paragraph
                    ))}
                </div>
                <div className="smaller-title">Care Instructions</div>
                <div className="care-info-container">
                    {plant.plantCare.map((care, idx) => (
                        <p key={idx} className="instruction-text">{care}</p> // Changed from list to paragraph
                    ))}
                </div>
            </div>
        </div>
    );    
};

export default PlantDetails;
