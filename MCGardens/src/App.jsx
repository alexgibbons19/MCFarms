import './App.css'
import DiscussionBoard from './DiscussionBoard'
import OptimalPlants from './OptimalPlants'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Thread from './Thread';
import HomePage from './HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />}/>
        {/* <Route exact path="/" element={<DiscussionBoard />} />
        <Route path="/thread/:id" element={<Thread/>} />
        <Route path="/optimal-plants" element={<OptimalPlants />} /> */}
      </Routes>
    </Router>      
  )
}

export default App
