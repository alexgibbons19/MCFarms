import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import './assets/Thread.css'

const ThreadPage = ({ updateNumReplies }) => {
  const{ id } = useParams();
  const [thread, setThread] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyTitle, setReplyTitle] = useState("");
  const [replies, setReplies] = useState();
  const [showForm, setShowForm] = useState(false);
  const [numReplies, setNumReplies] = useState(0);
  console.log('Id: ',id);

  useEffect(() => {
    const storedThreads = JSON.parse(localStorage.getItem("threads"));
    if(storedThreads){
      const foundThread = storedThreads.find(thread => thread.id === id);
      setThread(foundThread);
    }
    const storedReplies = JSON.parse(localStorage.getItem("replies")) || [];
    if(storedReplies) {
      const foundReplies = storedReplies.filter(reply => reply.threadId === id);
      console.log('Replies:',foundReplies);
      setReplies(foundReplies);
    }
  }, [id]);

  const handleCreateReplyClick = () => {
    setShowForm(true);
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    const creationDate = new Date();
    const newReply = {
      id: uuidv4(),
      threadId: thread.id,
      title: 'RE:' + thread.title,
      text: replyText,
      author: 'Anonymous',
      created_on: creationDate.toLocaleString()
    };
    console.log({ newReply });
    const updatedReplies = [...replies, newReply];
    setReplies(updatedReplies);
    if (thread) {
      const newNumReplies = (thread.numReplies || 0) + 1;
      updateNumReplies(thread.id, newNumReplies);
    }
    localStorage.setItem("replies", JSON.stringify(updatedReplies));
    setReplyTitle("");
    setReplyText("");
    setShowForm(false);
  }

  const handleCancel = () => {
    setReplyText("");
    setShowForm(false);
  }

  if( !thread ) {
    return <p> There was an error loading the thread. Please try again </p>
  }
  return (
    <>
      <main className="home">
        <Link to="/" className="back-btn">Back to the Discussion Board</Link>

        <Thread 
          key={thread.id}
          thread={thread}
          updateNumReplies={updateNumReplies}
          />
        
        {!showForm && (
          <button className="create-reply-btn" onClick={handleCreateReplyClick}
          >CREATE REPLY</button>
        )}
        {showForm && (
          <form className="create-reply-form" onSubmit={handleSubmitReply}>
            
            <h2 className='create-title'>Create a Reply</h2>
            <div className='create-reply-container'>
                <label htmlFor='replyText'>Text</label>
                <input
                    type='text'
                    id='replyText'
                    name='replyText'
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                />
            </div>
            <button className="submit-btn">SUBMIT REPLY</button>
            <button className="cancel-btn" onClick={handleCancel}>CANCEL</button>
                
          </form>
        )}
        <div className="reply-flex-container">
          {replies.length === 0 ? (
            <p>NO REPLIES</p>
          ) : (
            replies.map((reply,index) => (
              <div className="reply-container" key={index}>
                <p className="reply-title">Title: {reply.title}</p>
              
                <div className="reply-contents">
                  <div className="reply-info">
                    <p className="reply-author">batman</p>
                    <div className="reply-date">
                      <p className="date">
                        Date: {reply.created_on}
                      </p>
                    </div>
                  </div>
                  <div className="reply-text">
                    {reply.text}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>


      </main>
    </>
  )
}

export default Thread