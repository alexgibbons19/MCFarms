import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import './assets/Thread.css'
import BurgerMenu from './BurgerMenu';

const Thread = () => {
  const{ id } = useParams();
  const [thread, setThread] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyTitle, setReplyTitle] = useState("");
  const [replies, setReplies] = useState();
  const [allReplies,setAllReplies] = useState();
  const [showForm, setShowForm] = useState(false);
  const [numReplies, setNumReplies] = useState(0);
  
  console.log('Id: ',id);

  useEffect(() => {
    const storedThreads = JSON.parse(localStorage.getItem("threads"));
    if(storedThreads){
      const foundThread = storedThreads.find(thread => thread.id === id);
      console.log('Found thread:',foundThread);
      setThread(foundThread);
    }
    const storedReplies = JSON.parse(localStorage.getItem("replies")) || [];
    setAllReplies(storedReplies);
    if(storedReplies) {
      const foundReplies = storedReplies.filter(reply => reply.threadId === id);
      console.log('Replies:',foundReplies);
      setReplies(foundReplies);
      const numReplies = foundReplies.length;
      console.log(numReplies);
      setNumReplies(numReplies);
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
    
    const updatedReplies = [...allReplies, newReply];
    setReplies(updatedReplies);
    const updatedNumReplies = numReplies + 1;
    setNumReplies(updatedNumReplies);
    console.log({ thread });
    localStorage.setItem("replies", JSON.stringify(updatedReplies));
    setReplyTitle("");
    setReplyText("");
    setShowForm(false);
  }

  const handleCancel = () => {
    setReplyText("");
    setShowForm(false);
  }


  // TESTING
  const handleRemoveReplies = () => {
    localStorage.removeItem('replies');
    console.log('All Replies removed from localStorage.');
  };
  const handleRemoveThisReply = (replyId) => {
    const updatedReplies = replies.filter((reply) => reply.id !== replyId);
    setReplies(updatedReplies);
    // Update localStorage with the updated replies
    localStorage.setItem('replies', JSON.stringify(updatedReplies));
    const updatedNumReplies = numReplies - 1;
    setNumReplies(updatedNumReplies);
  };



  
  return (
    <>
      <BurgerMenu />
      {!thread && (
        <p> There was an error loading the thread. Please try again </p>
      )}
      {thread && (
      <main className="home">  
        <Link to="/discussion-board" className="back-btn">Back to the Discussion Board</Link>
        <button className="remove-replies-btn" onClick={handleRemoveReplies}>
                Remove All Replies from LocalStorage
        </button>
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
          <div className="reply-count">
            <p className="reply-count-text">
                Replies: {numReplies}
            </p>
        </div>
        </div>
      
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
                <button className="remove-reply-btn" onClick={() => handleRemoveThisReply(reply.id)}>
            Remove Reply
        </button>
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
    )}
    </>
  )
}

export default Thread