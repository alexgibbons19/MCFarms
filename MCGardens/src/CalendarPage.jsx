import React, {useState} from 'react';
import BurgerMenu from './BurgerMenu.jsx';
import {Calendar,momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
//customized styles
import './assets/CalendarPage.css';


// moment localization
// default to current date and month and year
moment.locale('en');
const localizer = momentLocalizer(moment);

//testing
const events = [
  {
    title: 'Watering 1',
    start: new Date(2024, 3, 10, 0, 0),
    end: new Date(2024, 3, 10, 24, 0),
    data:{
      type:"watering"
    }
  },
  {
    title: 'Thunderstorm',
    start: new Date(2024, 3, 15, 11, 0),
    end: new Date(2024, 3, 15, 15, 0),
    data:{
      type:"weather",
    }
  },
  {
    title: 'Harvest date',
    start: new Date(2024, 3, 30, 0, 0),
    end: new Date(2024, 3, 30, 24, 0),
  },
];

const components = {
  event: (props,any) => {
  const eventType = props?.event?.data?.type;
    switch (eventType){
      case "watering":
        return(
          <div style={{background:"blue",color:"white"}}>
            {props.title}
          </div>
        );
      case "weather":
        return(
          <div style={{background:"red",color:"white",font:"bold"}}>
            WEATHER WARNING : <br />
            {props.title}
          </div>
        );
      default:
        return(
          <div style={{background:"green",color:"white"}}>
            {props.title}
          </div>
        )    
    }
  },
};

const CalendarPage = () => {
  //const [selectEvent,setSelectedEvent]=useState(null);
  //const [editEvent,]

    return(
    <>
    <BurgerMenu />
    <div style={{height: "100vh", width:"150vh",padding:"10px"}}>
    <Calendar
      localizer={localizer}
      events={events}
      components={components}
      startAccessor="start"
      endAccessor="end"
      defaultDate={new Date()} //current date
    />
    </div>
    </>
  );
}


export default CalendarPage;
