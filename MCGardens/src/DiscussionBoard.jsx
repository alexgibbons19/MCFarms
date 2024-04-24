import React, { useState, useEffect } from "react";
import './assets/DiscussionBoard.css';
import { v4 as uuidv4 } from 'uuid';
import BurgerMenu from './BurgerMenu';
import { 
    fetchThreads, getUser,
    listenForUpdates,
    addThread as addThreadToDB,
    addReply as addReplyToDB 
} from '../backend/Firebase';

const DiscussionBoard = () => {
    const [threads, setThreads] = useState([]);
    const [showThreadForm, setShowThreadForm] = useState(false);
    const [threadTitle, setThreadTitle] = useState("");
    const [threadText, setThreadText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [currUser, setCurrUser] = useState("");
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedThreads = await fetchThreads();        
                setThreads(fetchedThreads);
                const currUser = await getUser();
                console.log("Current User:",currUser);
                setCurrUser(currUser);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        const unsubscribe = listenForUpdates(({ threads }) => {
            console.log("Listening...");
          
            if (threads) {
              setThreads(threads);
            }
          });
        
          return () => {
            unsubscribe();
          };
    }, []);

    const handleCreateThreadClick = () => {
        setShowThreadForm(true);
    };

    const handleSubmitThread = async (e) => {
        e.preventDefault();
        const creationDate = new Date();
        const newThread = { 
            id: uuidv4(),
            title: threadTitle, 
            text: threadText ,
            author: currUser,
            created_on: creationDate.toLocaleString(),
        };
        try {
            await addThreadToDB(newThread);
            console.log("New Thread added successfully:", newThread);
        } catch (error) {
            console.error("Error adding thread:", error);
        }
        setThreadTitle("");
        setThreadText("");
        setShowThreadForm(false);
    };

    const handleSubmitReply = async (e, thread) => {
        e.preventDefault();
        const creationDate = new Date();
        const newReply = {
            id: uuidv4(),
            threadId: thread.id,
            title: 'RE:' + thread.title,
            text: replyText,
            author: currUser, // Assuming 'user' is the correct field name
            created_on: creationDate.toLocaleString()
        };

        try {
            await addReplyToDB(newReply);
            console.log("Reply successfully added to DB:", newReply);
            setReplyText(""); // Clear reply text input
        } catch (error) {
            console.error("Error adding reply:", error);
        }
    };

    const handleCancelThread = () => {
        setThreadTitle("");
        setThreadText("");
        setShowThreadForm(false);
    }

  return (
    <>
        <div className='top-nav'>
            <BurgerMenu />
        </div>
        <main className='home'>
            {!showThreadForm && (
                <button className='create-thread-btn' onClick={handleCreateThreadClick}>CREATE THREAD</button>
            )}
            {showThreadForm && (
                <form className='create-thread-form' onSubmit={handleSubmitThread}>
                    <h2 className='create-thread-header'>Create a Thread</h2>
                    <div className='create-thread-container'>
                        <div className="create-thread-title-container">
                            <label className='create-thread-title-label' htmlFor='threadTitle'>Title</label>
                            <input
                                className='create-thread-title-input'
                                type='text'
                                id='threadTitle'
                                name='threadTitle'
                                required
                                value={threadTitle}
                                onChange={(e) => setThreadTitle(e.target.value)}
                            />
                        </div>
                        <div className="create-thread-text-container">
                            <label className='create-thread-text-label'htmlFor='threadText'>Text</label>
                            <input
                                className='create-thread-text-input'
                                type='text'
                                id='threadText'
                                name='threadText'
                                required
                                value={threadText}
                                onChange={(e) => setThreadText(e.target.value)}
                            />
                        </div>
                        
                    </div>
                    <div className="create-thread-btn-container">
                        <button className="submit-btn">SUBMIT THREAD</button>
                        <button className="cancel-btn" onClick={handleCancelThread}>CANCEL POST</button>
                    </div>
                    
                </form>
            )}

            <div className="thread-flex-container">
                <h2 className='home-title'>Check out these posts!</h2>
                {threads.length === 0 ? (
                    <p className='no-threads-text'>NO THREADS HAVE BEEN POSTED, BE THE FIRST!</p>
                ) : (
                    threads.map((thread) => (
                        <div className='thread-container' key={thread.id}>
                            
                            <div className="thread-contents">
                                <div className="thread-info">
                                    <p className="thread-title">{thread.title}</p>
                                    <div className="post-details">
                                        <p className="thread-author">{thread.author}</p>
                                        <div className="thread-date">
                                            <p className="date">
                                                Created On: {thread.created_on}
                                            </p>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="thread-text-container">
                                    <p className='thread-text'>{thread.text}</p>
                                </div>
                            </div>
                            <div className="replies-container">
                                <div className="reply-count">
                                    <p className="reply-count-text">
                                        Replies: {thread.replies ? thread.replies.length : 0}
                                    </p>
                                </div>
                                
                                {thread.replies && thread.replies.length > 0 ? (
                                    thread.replies.map((reply) => (
                                        <div className="reply-container" key={reply.id}>
                                            <div className="reply-contents">
                                                <div className="reply-info">
                                                    <p className="reply-title">{reply.title}</p>
                                                    <div className="post-details">
                                                        <p className="reply-author">{reply.author}</p>
                                                        <div className="reply-date">
                                                            <p className="date">
                                                                Created On: {reply.created_on}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                                <div className="reply-text-container">
                                                    <p className="reply-text">{reply.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) 
                                ) : (
                                    <p className='no-replies-text'>NO REPLIES YET! BE THE FIRST!</p>
                                )}
                                <form className="create-reply-form" onSubmit={(e) => handleSubmitReply(e, thread)}>
                                    <h2 className='create-reply-header'>Create a Reply</h2>
                                    <div className='create-reply-container'>
                                        <div className="create-thread-text-container">
                                            <label className='create-reply-text-label'htmlFor={`replyText-${thread.id}`}>Text</label>
                                            <input
                                                className='create-reply-text-input'
                                                type='text'
                                                id={`replyText-${thread.id}`}
                                                name='replyText'
                                                required
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <button className="submit-btn">SUBMIT REPLY</button>                                        
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    </>
);
};

export default DiscussionBoard;