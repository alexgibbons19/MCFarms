import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/PlantDetails.css';
import BurgerMenu from './BurgerMenu';
import defaultImg from './assets/logo.png';

const PlantDetails = () => {
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

    useEffect(() => {
        if (plantQuery) {
            setPlant({
                plantName: "Fetching Information....",
                plantBio: "Fetching Information...",
                plantInst: ["Fetching Information..."],
                plantCare: ["Fetching Information..."],
                plantImg: defaultImg
            });

            axios.post('https://us-central1-mcgardens-bd0b1.cloudfunctions.net/askGpt/askGpt', { plantInput: plantQuery.toLowerCase() })
            .then(response => {
                const { data } = response;
                if (data && data.bio && data.howToPlant && data.howToTakeCare) {
                    // Format and validate data here before fetching the image
                    const formattedBio = data.bio;  // Assume some formatting is needed
                    const formattedPlantInst = data.howToPlant.split(/(?=\d+\. )/).filter(line => line.trim() !== '');
                    const formattedPlantCare = data.howToTakeCare.split(/(?=\d+\. )/).filter(line => line.trim() !== '');

                    // Fetch the image from Unsplash
                    axios.get(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(plantQuery)}&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`)
                    .then(imgResponse => {
                        const image = imgResponse.data.results[0]?.urls.regular || defaultImg;
                        setPlant({
                            plantName: plantQuery || "Unknown Plant",
                            plantBio: formattedBio,
                            plantInst: formattedPlantInst,
                            plantCare: formattedPlantCare,
                            plantImg: image
                        });
                    })
                    .catch(imgError => {
                        console.error("Image fetch failed:", imgError);
                        // Even if image fetch fails, update the rest of the data
                        setPlant(prevState => ({
                            ...prevState,
                            plantBio: formattedBio,
                            plantInst: formattedPlantInst,
                            plantCare: formattedPlantCare,
                            plantImg: defaultImg // Use default image if Unsplash call fails
                        }));
                    });
                } else {
                    throw new Error("Data is missing some required fields.");
                }
            })
            .catch(error => {
                console.error("API call failed or data was incomplete:", error);
                setPlant(prevState => ({
                    ...prevState,
                    plantName: "Failed to load data.",
                    plantBio: "Failed to load data.",
                    plantInst: ["Failed to load data."],
                    plantCare: ["Failed to load data."],
                    plantImg: defaultImg
                }));
            });
        }
    }, [plantQuery, location]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) {
            alert('Please enter a valid plant name.');
            return;
        }
        
        navigate(`/plant-details?query=${encodeURIComponent(query)}`);
        setQuery('');
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
                        placeholder="Please enter plant"
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
