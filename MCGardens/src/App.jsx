import './App.css'
import DiscussionBoard from './DiscussionBoard'
import OptimalPlants from './OptimalPlants'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Thread from './Thread';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<DiscussionBoard />} />
        <Route path="/thread/:id" element={<Thread />} />
      </Routes>
    </Router>      
  )
}

export default App
