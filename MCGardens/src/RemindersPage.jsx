import BurgerMenu from './BurgerMenu.jsx';
import './assets/RemindersStyle.css'
import React, { useState, useEffect } from 'react';
import { fetchEvents, getUser, auth } from '../backend/Firebase.js'; // Import the function

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const username = getUser();

    useEffect(() => {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

        fetchEvents(username, today, nextMonth).then(events => {
            events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            setEvents(events);
        }).catch(console.error);
    }, []);

    // Group events by their start date and format time
    const groupEventsByDate = (events) => {
        const grouped = {};
        events.forEach(event => {
            const eventStartDate = new Date(event.startDate);
            const eventEndDate = new Date(event.endDate);
            const dateKey = eventStartDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push({
                ...event,
                startTime: eventStartDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }),
                endTime: eventEndDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }),
                endDate: eventEndDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            });
        });

        return grouped;
    };

    const eventGroups = groupEventsByDate(events);

    return (
        <div className="events-list">
            <h2>Upcoming Events</h2>
            {Object.entries(eventGroups).sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([date, dailyEvents]) => (
                <div key={date} className="daily-events">
                    <h3>{date}</h3>
                    {dailyEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).map((event, index) => (
                        <div key={index} className="event-item">
                            <p>{event.startTime} - {event.endTime} {new Date(event.endDate) > new Date(event.startDate) ? `(${event.endDate})` : ''} - {event.title}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const Reminders = () => {
    const [authInitialized, setAuthInitialized] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setAuthInitialized(true); // Set to true when user is confirmed
            } else {
                setAuthInitialized(false); // Optionally handle logged out / no user state
            }
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, []);

    return (
        <>
            <div className='top-nav'>
                <BurgerMenu />
            </div>
            <div className="reminder-page-container">
                <h1>Reminders Page</h1>
                {authInitialized && <EventsList />} {/* Render EventsList only if auth is initialized */}
            </div>
        </>
    );
};

export default Reminders;
