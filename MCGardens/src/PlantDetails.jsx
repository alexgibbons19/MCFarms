import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './assets/PlantDetails.css';
import defaultImg from './assets/tomato.png';

const PlantDetails = () => {
    const [plant, setPlant] = useState({
        plantName: "Default Plant",
        plantBio: "Plant bio default",
        plantInst: ["Planting instructions default"],
        plantCare: ["Plant care default"],
        plantImg: defaultImg
    });

    const location = useLocation(); 
    const searchParams = new URLSearchParams(location.search); // Use URLSearchParams to parse the query strings
    const plantQuery = searchParams.get('query');

    useEffect(() => {
        if (plantQuery) {
            const plantName = plantQuery.toLowerCase(); // Ensure it's in lowercase for consistent processing
            axios.post('http://localhost:3000/ask-gpt', { plantInput: plantName })
                .then(response => {
                    if (response.data.success) {
                        console.log("Data received:", response.data.content);
                        parsePlantDetails(response.data.content);
                    }
                })
                .catch(error => {
                    console.error("API call failed:", error.message);
                });
        }
    }, [location]); // Depend on location to re-run effect when URL changes

    const parsePlantDetails = (data) => {
        const lines = data.split("\n").map(line => line.trim()).filter(line => line);
    
        // Find the indices of each section, ensure these strings match exactly what you receive
        const bioIndex = getHeaderIdx("--bio", lines);
        const instIndex = getHeaderIdx("--how to plant", lines);
        const careIndex = getHeaderIdx("--how to take care", lines);
    
        // Correctly extract the biography text
        // Ensure to slice from the line after the bio index to the line before the instIndex
        const bio = bioIndex !== -1 && instIndex !== -1 ? lines.slice(bioIndex + 1, instIndex).join(' ') : "No biography found";
    
        const instructions = instIndex !== -1 ? populateList(instIndex, lines) : ["No planting instructions found"];
        const care = careIndex !== -1 ? populateList(careIndex, lines) : ["No care instructions found"];
    
        console.log("Bio Index:", bioIndex, "Inst Index:", instIndex, "Care Index:", careIndex);  // Check the indices
        console.log("Biography:", bio);  // Log parsed biography
        console.log("Instructions:", instructions);  // Log parsed instructions
        console.log("Care:", care);  // Log parsed care instructions
    
        setPlant({
            plantName: plantQuery,
            plantBio: bio,
            plantInst: instructions,
            plantCare: care,
            plantImg: defaultImg
        });
    };
    

    const getHeaderIdx = (header, lines) => {
        return lines.findIndex(line => line.startsWith(header));
    };

    const populateList = (idx, lines) => {
        let list = [];
        for (let i = idx + 1; i < lines.length && !lines[i].startsWith("--"); i++) {
            list.push(lines[i].trim());
        }
        return list;
    };

    return (
        <div className="plant-details">
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
                    {plant.plantInst.map((inst, idx) => <p key={idx}>{inst}</p>)}
                </div>
                <div className="smaller-title">Care Instructions</div>
                <div className="care-info-container">
                    {plant.plantCare.map((care, idx) => <p key={idx}>{care}</p>)}
                </div>
            </div>
        </div>
    );
};

export default PlantDetails;
