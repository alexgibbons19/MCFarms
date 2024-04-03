import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BurgerMenu from './BurgerMenu';
import './assets/PlantDetails.css';
import defaultImg from './assets/tomato.png';

const getHeaderIdx = (header,lines) => {
    for (let i = 0; i<lines.length; i++){
        if (lines[i].startsWith(header)){
            return i;
        }
    }
    return -1; //header not passed correctly
};

const populateList = (idx,lines) => {
    let list = [];
    for(let i = idx; i < lines.length; i++){
        if(lines[i].trim() !=""){
            list= [...list,lines[i]]
        }
        else{
            break
        }
    }
    return list;
}



const PlantDetails = () => { 
    const [plant, setPlant] = useState({
        plantName: ["Default Plant"],
        plantBio: ["Plant bio default"],
        plantInst: ["Planting instructions default"],
        plantCare: ["Plant care default"],
        plantImg: defaultImg
    });
    const [notif,setNotif] = useState(false);
    //const thisPlant = useParams();
    
    // testing
    const thisPlant = "apple";

    useEffect(() => {    
    // will update with firebase connection
        const fetchFileContent = async (plantName) => {
        try {
            const response = await fetch(plantName);
            if(!response.ok){
                throw new Error('Failed to fetch plant file..calling gbt');
                //this is where we'd call gbt function
            }
            const fileContent = await response.text();
            const lines = fileContent.split("\n");

    // remove header from bio
            const thisBio = lines[0].substring("Biography: ".length).trim();
    
            let instIdx = getHeaderIdx("How to Plant:",lines);
            let careIdx = getHeaderIdx("How to Take Care",lines)

            const thisPlantInst = populateList(instIdx,lines);
            const thisCare = populateList(careIdx,lines);

    
            console.log("Bio:",thisBio);
            console.log("Planting Inst:",thisPlantInst);
            console.log("Care Inst:",thisCare);


        // update plant obj   
            setPlant(prevPlant => ({
                ...prevPlant,
                plantName:thisPlant,
                plantBio:thisBio,
                plantInst:thisPlantInst,
                plantCare:thisCare,
                plantImg:defaultImg // this also needs a api call
            }));

        } catch (error) {
            console.error("Error finding and parsing file",error);
        }
    };
    // call function to get file content
        fetchFileContent(`../backend/crops/${thisPlant}.txt`)
    }, [thisPlant]); 

    const addToInventory = (plantName) => {
        //should add tuple to user db
        //for now log in console
        console.log("Plant name: %s", plant.plantName)

        //after adding, display notif
        setNotif(true);
    }

    const closeNotif = () => {
        setNotif(false);
    }

    return (
        <>
        <BurgerMenu />
            <div className="plant-details">
                <div className="left-container">
                    <div className="pic-container">
                        {plant && <img className="pic" src={plant.plantImg} alt="Plant" />}
                    </div>
                    <div className="smaller-title">Biography</div>
                   <div className="bio-container">
                        {plant && (
                            <p>{plant.plantBio}</p>
                        )}
                    </div>
                    <button className="add-button" onClick={ () => addToInventory(plant && plant.plantName)}>Add to Inventory </button>
                </div>
                <div className="right-container">
                    <div className="title-banner" title={plant ? plant.plantName : ''}>
                        {plant ? plant.plantName : ''}
                    </div>
                    <div className="smaller-title">Planting Instructions</div>
                    <div className="inst-container">
                        {plant && plant.plantInst.map((instLine, index) => {
                        if(index !==0){ 
                            return <p key={index}>{instLine}</p>;}
                        return null;
                        })}
                    </div>
                    <div className="smaller-title">Care Instructions</div>
                    <div className="care-info-container">
                        {plant && plant.plantCare.map((careLine, index) => {
                            if(index !==0){ 
                                return <p key={index}>{careLine}</p>;}
                            return null;
                            })}
                    </div>
                </div>
                </div>
        {notif && (
            <div className = "notif">
            <span> Added {plant && plant.plantName} to user inventory!</span>
            <button className="close-notif" onClick={closeNotif}>Close</button>
            </div>
        )}     
        </>
    );
};

export default PlantDetails;
