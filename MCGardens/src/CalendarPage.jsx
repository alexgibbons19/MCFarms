import React, {useState, useEffect} from 'react';
import BurgerMenu from './BurgerMenu.jsx';
import {Calendar,momentLocalizer} from "react-big-calendar";
import moment from "moment";
import { fetchEvents, getUser, addCommentToEvent, addEvent, deleteEvent,updateEvent} from '../backend/Firebase.js'
import "react-big-calendar/lib/css/react-big-calendar.css";
//customized styles
import './assets/CalendarPage.css';

const CalendarPage = () => {

  moment.locale('en');
  const localizer = momentLocalizer(moment);
  const [thisUser,setThisUser]=useState(null);
  const [events,setEvents]=useState([]);
  const [showAddEvent,setShowAddEvent]=useState(false);
  const [selectedEvent,setSelectedEvent]=useState(null);
  const [commentInput,setCommentInput]=useState([]);
  const [isEditMode,setIsEditMode] = useState(false);  
  const [formData,setFormData]= useState({
    title:'',
    startDate: new Date(),
    endDate: new Date(),
  });


// hook to initialize calendar with database info
useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setThisUser(storedUser);
      } else {
        const user = getUser();
        setThisUser(user);
        // Store user in localStorage for persistence
        localStorage.setItem('user', user);
      }
    };

    const loadEvents = async () => {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const eventsData = await fetchEvents(user);

          const eventsWithDateObjects = eventsData.map(event => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate)
          }));

          setEvents(eventsWithDateObjects);
        }
      } catch (error) {
        console.error("Error loading events:", error);
      }
    };

    loadUser();
    loadEvents();

  },[]);

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({
      ...formData,
      [name]: value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const {title,startDate,endDate}=formData;

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  if (!title || !startDate || !endDate) {
    alert('Please fill out all required fields.');
    return;
  }

  try {
    const user = getUser(); 

    setShowAddEvent(false);

    const thisId = await addEvent({ 
      username: user,
      title, 
      start: startDateObj, 
      end: endDateObj });

    console.log('New event added to database');
    const newEvent = {
      title,
      startDate: startDateObj,
      endDate: endDateObj,
      docID: thisId,
      comments: []
    };

    setEvents(prevEvents => [...prevEvents, newEvent]);
    console.log('New event added to front end');

    setFormData({ title: '', startDate: new Date(), endDate: new Date() });
    
  } catch (error) {
    console.error('Error adding event:', error);
  }
  }

const handleAddComment = async () => {
  if (selectedEvent && commentInput.trim()) {
    try {
    // commits changes to db
      await addCommentToEvent(selectedEvent.docID, commentInput);
      
      const updatedEvents = events.map(event => {
        if (event.docID === selectedEvent.docID) {
        // updates the comments field of selected event locally
          return {
            ...event,
            comments: [...event.comments, commentInput] 
          };
        }
      // returns the updated and old events
        return event; 
      });

    // update the events state
      setEvents(updatedEvents);

    // update the current selected event
      setSelectedEvent({
        ...selectedEvent,
        comments: [...selectedEvent.comments, commentInput] 
      });

      setCommentInput('');
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }
};

const handleDeleteEvent = async () => {
  if (selectedEvent) {
    try {
    // remove from db
      await deleteEvent(selectedEvent.docID);
    
    // remove from local
      const filteredEvents = events.filter(event => event.docID !== selectedEvent.docID);
      setEvents(filteredEvents);
      setSelectedEvent(null);

      console.log('Event deleted successfully from Firestore and frontend display.');

    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }
};

const handleEditEvent = () => {
  // Set edit mode to true
  setIsEditMode(true);

  // Populate form data with selected event details
  if (selectedEvent) {
    setFormData({
      title: selectedEvent.title,
      startDate: selectedEvent.startDate,
      endDate: selectedEvent.endDate,
    });
  }
};

const handleSubmitEdit = async (e) => {
  e.preventDefault();
  const { title, startDate, endDate } = formData;
  console.log("Edited Event:",formData);
  if (!title || !startDate || !endDate) {
    alert('Please fill out all required fields.');
    return;
  }
  console.log("hi",selectedEvent);

  try {
    const user = selectedEvent.user;
    const comments = selectedEvent.comments;
    // Update the selected event with new details
    await updateEvent(selectedEvent.docID, { title, startDate, endDate, user, comments });

    // Update the events array with the updated event
    const updatedEvents = events.map((event) => 
    event.docID === selectedEvent.docID ? { ...event, title, startDate, endDate } : event
  );
    console.log("updatedEvents:",updatedEvents);
    setEvents(updatedEvents);
    console.log("eD:",endDate);
    setSelectedEvent({
      ...selectedEvent,
      startDate: startDate,
      endDate: endDate,
    });

    // Exit edit mode and reset form data
    setIsEditMode(false);
    setFormData({ title: '', startDate: new Date(), endDate: new Date() });

    console.log('Event updated successfully!');
  } catch (error) {
    console.error('Error updating event:', error);
  }
};


    return(
      <>
      <div className='top-nav'>
        <BurgerMenu />
        <div style={{paddingTop:"10px"}}>
        {/* Button for Add Event modal */}
          <button style={{color:"white",backgroundColor: "green"}} onClick={() => setShowAddEvent(true)}>Add Event Here!</button>
      </div>
      </div>
      <div style={{display:'flex',height:"100vh",width:"150vh"}}>
      <div style={{height:"100%",width:"100%"}}> 
        <Calendar 
          localizer={localizer}
          events={events}//change process to handle real data
          startAccessor="startDate"
          endAccessor="endDate"
          defaultDate={new Date()}
          defaultView="month"
          selectable={false}
          onSelectEvent={(event) => setSelectedEvent(event)}
          eventPropGetter={(event) => ({
            className: event.comments.length > 0 ? 'has-comments' : 'no-comments'
          })}
          />
        </div>
        {/* ADD COMMENTS / EDIT EVENT /DELETE EVENT */}
        {/* not edit mode */}
        <div style={{ color:'black',backgroundColor:'rgb(235, 255, 205)',paddingTop: '10px', marginLeft: '20px', marginTop: '70px' }}>
          {selectedEvent && !isEditMode && (
            <div style={{ border: '2px solid black', padding: '10px', position: 'relative' }}>
              <span
                className="close"
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '10px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: 'black',
                }}
                onClick={() => setSelectedEvent(null)}
              >
                &times;
              </span>
              <h3>{selectedEvent.title}</h3>
              <p>Start: {moment(selectedEvent.startDate).format('LLL')}</p>
              <p>End: {moment(selectedEvent.endDate).format('LLL')}</p>
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
              <div style={{display:'flex',justifyContent:'center',marginTop:'20px'}}>
              <button onClick={handleAddComment}>Add Comment</button>
              <br />
              <button onClick={handleEditEvent}>Edit Event</button>
              <br />
              <button onClick={handleDeleteEvent}>Delete Event</button>
            </div>
            </div>
          )}
          {/* EDIT MODE */}
          {selectedEvent && isEditMode && (
            <div style={{color:'black',backgroundColor:'rgb(235, 255, 205)',display:'flex',justifyContent:'center', border: '2px solid black', padding: '10px', position: 'relative' }}>
              <h2>Edit your event :</h2>
            <form onSubmit={handleSubmitEdit}>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </label>
              <br />
              <label>
                Start Date & Time:
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <br />
              <label>
                End Date & Time:
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <br />
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditMode(false)}>Cancel</button>
            </form>
            </div>
          )}
    {/* POP UP FOR ADD EVENT */}
    <div style={{paddingTop: '10px', marginLeft: '20px',fontSize:"10px"}}></div>
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
            <br />
            <label>
                  Start Date & Time:
                  <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
            </label>
            <br />
            <label>
                  End Date & Time:
                  <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
            </label>
            <br />


          <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
      )}
      </div>
      
      </div>
      </>
    );
};

export default CalendarPage;

