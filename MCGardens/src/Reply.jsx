import React from "react";
import { v4 as uuidv4 } from 'uuid';
import './assets/Thread.css';

const Reply = ({ reply }) => {
    return (
        <div className="reply-container">
            <p className="reply-title">Title: {reply.title}</p>
            <div className="reply-contents">
                <div className="reply-info">
                    <p className="reply-author">{reply.author}</p>
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
    );
};

export default Reply;
