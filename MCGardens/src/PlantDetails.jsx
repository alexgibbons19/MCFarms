import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom'
import BurgerMenu from './BurgerMenu';
import './assets/PlantDetails.css';
import defaultImage from './assets/tomato.png';

//depending on header, we will know what data to pull where
//i think ideally the search page submission will trigger an api call and the ID will be sent to PlantDetails


//i think search page will submit a JSON form to pass to 
//details and then details renders the object

const PlantDetails = () => {

    const{id} = useParams();
    const [plant, setPlant] = useState(null);
    
    // this will change depending on whats in the text files
    const samplePlant = {
        plantName:"Tomato",
        plantBio:"Tomatos are great",
        plantCare:["Tomatos need water","Tomatos need soil","Tomatos need little sunlight"],
        plantFacts: ["fact1","fact2","fact3"]
    }

    useEffect(() => {
        //call API with submitted ID

        //save file from ID 

        //read file headers to pull page information

        setPlant(samplePlant);
    }, [id]);

    return (
    <>
    <BurgerMenu />
    <div className="plant-details">

        <div className="left-container">
            <div className="pic-container">
                <img className="pic" src={defaultImage} />
            </div>

            <div className="fast-facts">
            {plant?.plantFacts && plant.plantFacts.map((fact, index) => (
            <li key={index}>{fact}</li>
            ))}</div>
        </div>
        <div className="right-container">
            <div className="title-banner" title={plant ? plant.plantName : ''}>
                {plant ? plant.plantName : ''}
            </div>
            
        <div className="smaller-title">Biography</div>
        <div className="bio-container">
            {plant && <p>{plant.plantBio}</p>}
        </div>

        <div className="smaller-title">Care Info</div>
        <div className="care-info-container">
        {plant && plant.plantCare.map((item, index) => (
        <p key={index}>{index + 1}. {item}</p>
        ))}
        </div>

        </div>
    </div>
    </>
    );
};


export default PlantDetails;