import './App.css'
import DiscussionBoard from './DiscussionBoard'
import OptimalPlants from './OptimalPlants'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Thread from './Thread';
import HomePage from './HomePage';
import CalendarPage from './CalendarPage';
import Reminders from './RemindersPage';
import Login from './Login.jsx';
import Weather from './Weather.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/home-page" element={<HomePage />}/>
        <Route path="/discussion-board" element={<DiscussionBoard />} />
        <Route path="/thread/:id" element={<Thread/>} />
        <Route path="/optimal-plants" element={<OptimalPlants />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/weather" element={<Weather />} />
        {/* <Route path="/inventory" element={<InventoryPage />} />  */}
      </Routes>
    </Router>      
  )
}

export default App
