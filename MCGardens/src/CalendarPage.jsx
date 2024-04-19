import React, {useState, useEffect} from 'react';
import BurgerMenu from './BurgerMenu.jsx';
import {Calendar,momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
//customized styles
import './assets/CalendarPage.css';
/*
commenting to implement later
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
*/

const CalendarPage = () => {
  // moment localization
  // default to current date and month and year
  moment.locale('en');
  const localizer = momentLocalizer(moment);

  //default event ensures the full calendar redners every time

  const defaultEvent = {
    title:'Todays date',
    start: moment().startOf('day').toDate(),
    end: moment().endOf('day').toDate(),
    comments: []
  };

  const [events,setEvents]=useState([defaultEvent]);
// event params
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(moment().toDate());
  const [endTime,setEndTime] = useState(moment().add(1,'hour').toDate());
  const [comments,setComments] = useState([]);

// functionalities

// for add event form
  const [showAddEvent,setShowAddEvent]=useState(false);
  const [formData,setFormData]= useState({
    title:'',
    startTime:'',
    endTime:''
  });

  const [selectedEvent,setSelectedEvent]=useState(null);
// for add comment
  const [commentInput,setCommentInput]=useState('');

  /*

  revist when its time to use firebase

  useEffect(() => {
    //find events file if it exists
    const getSavedEvents = async() => {
      try{
        const response = await fetch("../backend/calendar/user1");

        if(response.ok){
          const savedEvents = await response.json();
          setEvents(savedEvents);
        }
        else{
          throw new Error("file not found or events do not exist");
        }
      } catch(error){
        console.log("Error fetching or parsing events",error.message);
      }
    };

    getSavedEvents();
  }, []);
*/

const handleInputChange = (e) => {
  const {name,value}=e.target;
    setFormData({
      ...formData,
      [name]:value
    });
};

const handleSubmit = (e) => {
  e.preventDefault();
  const {title,startTime,endTime}=formData;

  if (title.trim() === '' || startTime.trim() === '' || endTime.trim() === '') {
    alert('Please fill out all fields.');
    return;
}

  const newEvent = {
    title,
    start: new Date(startTime),
    end: new Date(endTime),
    comments: []
};

  //update w new event
  setEvents([...events,newEvent]);
  console.log("New event created..");
  console.log("title: ",newEvent.title);
  console.log("start: ",newEvent.start);
  console.log("end: ",newEvent.end);
  console.log("comments: ",newEvent.comments);

  //should add this to the db as well as a json***********************

  //reset params
  setFormData({title:'',startTime:'',endTime:''});
  setShowAddEvent(false);
}

const handleAddComment = () => {
  if (selectedEvent && commentInput.trim()) {
    const updatedEvent = {
      ...selectedEvent,
      comments: [...selectedEvent.comments, commentInput],
    };
    const updatedEvents = events.map((event) =>
      event === selectedEvent ? updatedEvent : event
    );
    setEvents(updatedEvents);
    setCommentInput('');
  }
};

const handleDeleteEvent = () => {
  if (selectedEvent) {
    const filteredEvents = events.filter((event) => event !== selectedEvent);
    setEvents(filteredEvents);
    setSelectedEvent(null);
  }
};
    return(
      <>
      <BurgerMenu />
      <div style={{display:'flex',height:"100vh",width:"150vh"}}>
      <div style={{height:"100%",width:"100%"}}> 
        <Calendar 
          localizer={localizer}
          events={events}//change process to handle real data
          startAccessor="start"
          endAccessor="end"
          defaultDate={new Date()}
          defaultView="month"
          selectable={false}
          onSelectEvent={(event) => setSelectedEvent(event)}
          //components={components}//may or may not need
        />
        </div>
        {/* ADD COMMENTS / DELETE EVENT */}
        <div style={{ paddingTop: '10px',marginLeft: '20px' }}>
          {/* Event details and actions */}
          {selectedEvent && (
            <div>
              <h3>{selectedEvent.title}</h3>
              <p>Start: {moment(selectedEvent.start).format('LLL')}</p>
              <p>End: {moment(selectedEvent.end).format('LLL')}</p>
              <h4>Comments:</h4>
              <ul>
                {selectedEvent.comments.map((comment, index) => (
                  <li key={index}>{comment}</li>
                ))}
              </ul>
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
              />
              <button onClick={handleAddComment}>Add Comment</button>
              <button onClick={handleDeleteEvent}>Delete Event</button>
            </div>
          )}
    {/* POP UP FOR ADD EVENT */}
    <div style={{paddingTop: '10px', marginLeft: '20px'}}></div>
    { showAddEvent && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => setShowAddEvent(false)}>&times;</span>
          <form onSubmit={handleSubmit}>
            <h3>Add a new event to your calendar:</h3>

            <label>
              Title:
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
            </label>

            <label>
                  Start Date & Time:
                  <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleInputChange} required />
            </label>

            <label>
                  End Date & Time:
                  <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleInputChange} required />
            </label>

          <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
      )}
      </div>
      <div style={{paddingTop:"10px"}}>
        {/* Button for Add Event popup */}
          <button style={{color:"white",backgroundColor: "green"}} onClick={() => setShowAddEvent(true)}>Add Event Here!</button>
      </div>
      </div>
      </>
    );
};

export default CalendarPage;

