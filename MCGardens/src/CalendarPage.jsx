import React, {useState} from 'react';
import BurgerMenu from './BurgerMenu.jsx';
import './assets/Calendar.css';

const Calendar = () => {

    return(
    <>
    <BurgerMenu />
    <div className="calendar-container">
      <h1>User's Calendar</h1>
      <div className="month-banner"></div>
      <div className = "weekdays-container">
      <div className = "weekday">
        <h1>Sunday</h1></div>
      <div className = "weekday">
        <h1>Monday</h1></div>
      <div className = "weekday">
        <h1>Tuesday</h1></div>
      <div className = "weekday">
        <h1>Wednesday</h1></div>
      <div className = "weekday">
        <h1>Thursday</h1></div>
      <div className = "weekday">
        <h1>Friday</h1></div>
      <div className = "weekday">
        <h1>Saturday</h1></div>
      </div>
      <div className = "day-grid-container"/*these need data from reminders api*/>
      <div className="day">1</div>
      <div className="day">2</div>
      <div className="day">3</div>
      <div className="day">4</div>
      <div className="day">5</div>
      <div className="day">6</div>
      <div className="day">7</div>
      <div className="day">8</div>
      <div className="day">9</div>
      <div className="day">10</div>
      <div className="day">11</div>
      <div className="day">12</div>
      <div className="day">13</div>
      <div className="day">14</div>
      <div className="day">15</div>
      <div className="day">16</div>
      <div className="day">17</div>
      <div className="day">18</div>
      <div className="day">19</div>
      <div className="day">20</div>
      <div className="day">21</div>
      <div className="day">22</div>
      <div className="day">23</div>
      <div className="day">24</div>
      <div className="day">25</div>
      <div className="day">26</div>
      <div className="day">27</div>
      <div className="day">28</div>
      </div>
    </div>
    </>
  );
}


export default Calendar