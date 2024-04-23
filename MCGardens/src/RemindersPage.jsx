import React, {useState} from 'react';
import BurgerMenu from './BurgerMenu.jsx';
import './assets/RemindersStyle.css'

const Reminders = () => {

    const newReminders = ['Buy groceries', 'Call mom'];
    const olderReminders = ['Finish project', 'Submit report'];
 
    return(
    <>
    <div className='top-nav'>
        <BurgerMenu />
    </div>
    <div className="reminder-page-container">
        <h1>Reminders Page</h1>
        <div className="list-container">
         <div className="new-reminder-list">
            <h2>Most Recent Reminders</h2>
                {newReminders.map((list,index) => (
                <div key={index} className="reminder-item">
                {list}
                </div>
                ))}
        </div>
         <div className="old-reminder-list">
            <h2>Old Reminders</h2>
                {olderReminders.map((list,index) => (
                <div key={index} className="reminder-item">
                {list}
                </div>
                ))}
         </div>
         </div>
    </div>
    </>
    );
}

export default Reminders

