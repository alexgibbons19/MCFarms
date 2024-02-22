import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

const Thread = () => {
  const{ id } = useParams();
  const [thread, setThread] = useState(null);
  console.log('Id: ',id);

  useEffect(() => {
    const storedThreads = JSON.parse(localStorage.getItem("threads"));
    if(storedThreads){
      const foundThread = storedThreads.find(thread => thread.id === id);
      setThread(foundThread);
    }
  }, [id]);

  if( !thread ) {
    return <p> There was an error loading the thread. Please try again </p>
  }
  return (
    <>
      <Link to="/" className="back-btn">Back to the Discussion Board</Link>

      <div className="thread-container">
        <h2 className="thread-title">Title: {thread.title}</h2>
        <div className="thread-contents">
          <div className="thread-info">
            <p className="thread-author">Author: ME</p>
            <div className="thread-date-container">
              <p className="thread-date">Date: {thread.created_on}</p>
            </div>
          </div>
          <div className="thread-text">{thread.text}</div>
        </div>
      </div>
    </>
  )
}

export default Thread