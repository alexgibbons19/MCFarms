import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './assets/DiscussionBoard.css';
import { v4 as uuidv4 } from 'uuid';
import BurgerMenu from './BurgerMenu';
import { 
    fetchThreads, fetchReplies, getUser,
    listenForThreadsUpdates,
    listenForRepliesUpdates,
    deleteThread as deleteThreadFromDB,
    deleteReply,
    addThread as addThreadToDB,
    addReply as addReplyToDB 
} from '../backend/Firebase';

const DiscussionBoard = () => {
    const [threads, setThreads] = useState([]);
    const [replies, setReplies] = useState([]);
    const [showThreadForm, setShowThreadForm] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [threadTitle, setThreadTitle] = useState("");
    const [threadText, setThreadText] = useState("");
    const [replyTitle, setReplyTitle] = useState("");
    const [replyText, setReplyText] = useState("");
    const [numReplies, setNumReplies] = useState(0);
    const [threadReplies, setThreadReplies] = useState([]);
    const [selectedThreadId, setSelectedThreadId] = useState(null);
    const [currUser, setCurrUser] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedThreads = await fetchThreads();
                fetchedThreads.sort((a, b) => new Date(a.created_on) - new Date(b.created_on));
                const fetchedReplies = await fetchReplies();
                fetchedReplies.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
                const threadsWithReplies = fetchedThreads.map(thread => ({
                    ...thread,
                    replies: fetchedReplies.filter(reply => reply.threadId === thread.id)
                }));

                setThreads(threadsWithReplies);
                setReplies(fetchedReplies);
                const currUser = await getUser();
                console.log(currUser);
                setCurrUser(currUser);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        const unsubscribeThreads = listenForThreadsUpdates((updatedThreads) => {
            setThreads(updatedThreads);
        });
        const unsubscribeReplies = listenForRepliesUpdates((updatedReplies) => {
            setReplies(updatedReplies);
        });


        return () => {
            unsubscribeThreads();
            unsubscribeReplies();
        }
    }, []);

    const handleCreateThreadClick = () => {
        setShowThreadForm(true);
    };

    const handleCreateReplyClick = (threadId) => {
        setSelectedThreadId(threadId);
        setShowReplyForm(true);     
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
            numReplies: 0
        };
        try {
            await addThreadToDB(newThread);
            const updatedThreads = [newThread, ...threads];
            setThreads(updatedThreads);
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
            const updatedReplies = [...replies, newReply];
            setReplies(updatedReplies);

            // Refetch threads and replies after a new reply is posted
            const fetchedThreads = await fetchThreads();
            const fetchedReplies = await fetchReplies();

            const threadsWithReplies = fetchedThreads.map(thread => ({
                ...thread,
                replies: fetchedReplies.filter(reply => reply.threadId === thread.id)
            }));

            setThreads(threadsWithReplies);
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

    const handleCancelReply = () => {
        setReplyText("");
        setSelectedThreadId(null);
        setShowReplyForm(false);
      }

    const handleLinkClick = (id) => {
        console.log("Clicked thread ID: ", id);
    };

    const updateNumReplies = (threadId, numReplies) => {
        const updatedThreads = threads.map(thread => {
            if (thread.id === threadId) {
                return { ...thread, numReplies: numReplies };
            }
            return thread;
        });
        setThreads(updatedThreads);
        localStorage.setItem("threads", JSON.stringify(updatedThreads));
    };

    // TESTING
  const handleRemoveThreads = () => {
    localStorage.removeItem('threads');
    localStorage.removeItem('replies');
    console.log('All Threads and Replies removed from localStorage.');
  };
  const handleRemoveThisThread = async (threadId) => {
    try {
        await deleteThreadFromDB(threadId);
        console.log('Thread deleted successfully.');
    } catch (error) {
        console.error('Error deleting thread:', error);
    }
  };

  return (
    <>
        <BurgerMenu />
        <button className="remove-threads-btn" onClick={handleRemoveThreads}>
            Remove All Threads from LocalStorage
        </button>
        <main className='home'>
            {!showThreadForm && (
                <button className='create-thread-btn' onClick={handleCreateThreadClick}>CREATE THREAD</button>
            )}
            {showThreadForm && (
                <form className='create-thread-form' onSubmit={handleSubmitThread}>
                    <h2 className='create-title'>Create a Thread</h2>
                    <div className='create-thread-container'>
                        <label htmlFor='threadTitle'>Title</label>
                        <input
                            type='text'
                            id='threadTitle'
                            name='threadTitle'
                            required
                            value={threadTitle}
                            onChange={(e) => setThreadTitle(e.target.value)}
                        />
                        <p></p>
                        <label htmlFor='threadText'>Text(optional)</label>
                        <input
                            type='text'
                            id='threadText'
                            name='threadText'
                            required
                            value={threadText}
                            onChange={(e) => setThreadText(e.target.value)}
                        />
                    </div>
                    <button className="submit-btn">SUBMIT THREAD</button>
                    <button className="cancel-btn" onClick={handleCancelThread}>CANCEL POST</button>
                </form>
            )}

            <div className="thread-flex-container">
                <h2 className='home-title'>Check out these posts!</h2>
                {threads.length === 0 ? (
                    <p>NO THREADS HAVE BEEN POSTED, BE THE FIRST!</p>
                ) : (
                    threads.map((thread) => (
                        <div className='thread-container' key={thread.id}>
                            <button className="remove-thread-btn" onClick={() => handleRemoveThisThread(thread.id)}>Remove Thread</button>
                            <Link 
                                to={`/thread/${thread.id}`} 
                                className="thread-title"
                                onClick={() => handleLinkClick(thread.id)}>
                                <p>Title: {thread.title}</p>
                            </Link>
                            <div className="thread-contents">
                                <div className="thread-info">
                                    <p className="thread-author">{thread.author}</p>
                                    <div className="thread-date">
                                        <p className="date">
                                            Created On: {thread.created_on}
                                        </p>
                                    </div>
                                </div>
                                <div className="thread-text">
                                    {thread.text}
                                </div>
                            </div>
                            <div className="replies-container">
                                <div className="reply-count">
                                    <p className="reply-count-text">
                                        Replies: {thread.replies ? thread.replies.length : 0}
                                    </p>
                                </div>
                                
                                <form className="create-reply-form" onSubmit={(e) => handleSubmitReply(e, thread)}>
                                    <h2 className='create-reply-title'>Create a Reply</h2>
                                    <div className='create-reply-container'>
                                        <label htmlFor={`replyText-${thread.id}`}>Text</label>
                                        <input
                                            type='text'
                                            id={`replyText-${thread.id}`}
                                            name='replyText'
                                            required
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                        />
                                    </div>
                                    <button className="submit-btn">SUBMIT REPLY</button>
                                    <button className="cancel-btn" onClick={handleCancelReply}>CANCEL</button>
                                        
                                </form>
                                
                                {thread.replies && thread.replies.length > 0 ? (
                                    thread.replies.map((reply) => (
                                        <div className="reply-container" key={reply.id}>
                                            <div className="reply-contents">
                                                <div className="reply-info">
                                                    <p className="reply-title">{reply.title}</p>
                                                    <p className="reply-author">{reply.author}</p>
                                                    <div className="reply-date">
                                                        <p className="date">
                                                            Created On: {reply.created_on}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="reply-text">
                                                    {reply.text}
                                                </div>
                                            </div>
                                        </div>
                                    )) 
                                ) : (
                                    <p>NO REPLIES YET! BE THE FIRST!</p>
                                )}
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