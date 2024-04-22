import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/PlantDetails.css';
import BurgerMenu from './BurgerMenu';
import defaultImg from './assets/logo.png';

const PlantDetails = () => {
    // Adjusted initial state to have more contextual initial messages
    const [plant, setPlant] = useState({
        plantName: "Please enter a plant in the search.",
        plantBio: "Here will be bio information",
        plantInst: ["Planting instructions will appear here after a search."],
        plantCare: ["Care information will be displayed here once you search for a plant."],
        plantImg: defaultImg
    });
    const [query, setQuery] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const plantQuery = searchParams.get('query');

    const splitInstructions = (text) => {
        return text.split(/(?=\d+\. )/).filter(line => line.trim() !== '');
    };

    const parsePlantDetails = (response) => {
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
            setPlant({
                plantName: "Generating Information",
                plantBio: "Please wait while generating.",
                plantInst: ["Please wait while generating."],
                plantCare: ["Please wait while generating."],
                plantImg: defaultImg
            });

            const plantName = plantQuery.toLowerCase();
            axios.post('https://us-central1-mcgardens-bd0b1.cloudfunctions.net/askGpt/askGpt', { plantInput: plantName })
                .then(response => {
                    parsePlantDetails(response.data);
                })
                .catch(error => {
                    console.error("API call failed:", error);
                    setPlant({
                        plantName: "Failed to load data.",
                        plantBio: "Failed to load data.",
                        plantInst: ["Failed to load data."],
                        plantCare: ["Failed to load data."],
                        plantImg: defaultImg
                    });
                });
        }
    }, [location, plantQuery]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) {
            alert('Please enter a valid plant name.');
            return;
        }
        setPlant({
            plantName: "Generating Information",
            plantBio: "Please wait while generating.",
            plantInst: ["Please wait while generating."],
            plantCare: ["Please wait while generating."],
            plantImg: defaultImg
        });
        // Using a timeout to delay navigation until after the state updates
        setTimeout(() => {
            navigate(`/plant-details?query=${encodeURIComponent(query)}`);
            setQuery(''); // Clear the search query right after submission
        }, 0);
    };

    return (
        <div className="plant-details">
            <div className="top-nav">
                <BurgerMenu />
                <form onSubmit={handleSubmit} className="search-bar">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Please enter plant" // Updated placeholder text
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
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
                        <p key={idx} className="instruction-text">{inst}</p>
                    ))}
                </div>
                <div className="smaller-title">Care Instructions</div>
                <div className="care-info-container">
                    {plant.plantCare.map((care, idx) => (
                        <p key={idx} className="instruction-text">{care}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlantDetails;
