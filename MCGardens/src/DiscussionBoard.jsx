import React, { useState, useEffect } from "react";
import './assets/DiscussionBoard.css'

const DiscussionBoard = () => {
    const [threadTitle, setThreadTitle] = useState("");
    const [threadText, setThreadText] = useState("");
    const [threads, setThreads] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const storedThreads = JSON.parse(localStorage.getItem("threads"));
        if (storedThreads) {
            storedThreads(storedThreads);
        }
    }, []);

    const handleCreateThreadClick = () => {
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const creationDate = new Date();
        const newThread = { 
            title: threadTitle, 
            text: threadText ,
            created_on: creationDate.toLocaleString()
        };
        console.log({ newThread });
        const updatedThreads = [newThread, ...threads];
        setThreads(updatedThreads);
        localStorage.setItem("threads", JSON.stringify(updatedThreads));
        setThreadTitle("");
        setThreadText("");
        setShowForm(false);
    };

    const handleCancel = () => {
        setThreadTitle("");
        setThreadText("");
        setShowForm(false);
    }
    return (
        <>
            <main className='home'>
                {!showForm && (
                    <button className='create-thread-btn' onClick={handleCreateThreadClick}>CREATE THREAD</button>

                )}
                {showForm && (
                    <form className='create-thread-form' onSubmit={handleSubmit}>
                        <h2 className='create-title'>Create a Thread</h2>
                        <div className='create-thread-container'>
                            <label htmlFor='threadTitle'>Title</label>
                            <input
                                type='text'
                                name='threadTitle'
                                required
                                value={threadTitle}
                                onChange={(e) => setThreadTitle(e.target.value)}
                            />
                            <p></p>
                            <label htmlFor='threadText'>Text(optional)</label>
                            <input
                                type='text'
                                name='threadText'
                                required
                                value={threadText}
                                onChange={(e) => setThreadText(e.target.value)}
                            />
                        </div>
                        <button className="submit-btn">SUBMIT THREAD</button>
                        <button className="cancel-btn" onClick={handleCancel}>CANCEL POST</button>
                    </form>
                )}
				
                <h2 className='home-title'>Check out these posts!</h2>
                {threads.length === 0 ? (
                    <p>NO THREADS HAVE BEEN POSTED, BE THE FIRST!</p>
                ) : (
                    threads.map((thread,index) => (
                        <div className='thread-container' key={index}>
                            <div className="thread-title">
                                <p>Title: {thread.title}</p>
                            </div>
                            <div className="thread-contents">
                                <div className="thread-info">
                                    <p className="thread-author">JOHN DOE</p>
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
                        </div>
                    ))
                )}
        </main>
        </>
    );
};

export default DiscussionBoard;