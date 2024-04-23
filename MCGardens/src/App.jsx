import './App.css'
import DiscussionBoard from './DiscussionBoard'
import OptimalPlants from './OptimalPlants'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import CalendarPage from './CalendarPage';
import Reminders from './RemindersPage';
import Login from './Login.jsx';
import Weather from './Weather.jsx';
import PlantDetails from './PlantDetails.jsx';
import SignUp from './SignUp.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import AboutUs from './AboutUs.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<HomePage />}/>
        <Route path="/discussion-board" element={<DiscussionBoard />} />
        <Route path="/optimal-plants" element={<OptimalPlants />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/plant-details" element={<PlantDetails />} />
        <Route path="/about-us" element={<AboutUs />} />
        {/* <Route path="/inventory" element={<InventoryPage />} />  */}
      </Routes>
    </Router>      
  )
}

export default App
