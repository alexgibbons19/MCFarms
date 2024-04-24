import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { updateEmailPreference, getUserEmailPreference } from '../backend/Firebase.js';
import BurgerMenu from './BurgerMenu.jsx';
import './assets/Account.css';

function AccountSettings() {
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const [emailPreference, setEmailPreference] = useState(true);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setCurrentUserEmail(user.email);
                fetchPreferences(user.email);
            } else {
                setMessage('No user logged in.');
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSendPasswordResetEmail = async () => {
        const auth = getAuth();
        if (currentUserEmail) {
            try {
                await sendPasswordResetEmail(auth, currentUserEmail);
                setMessage('Password reset email sent successfully. Please check your email.');
            } catch (error) {
                setMessage(`Failed to send password reset email: ${error.message}`);
            }
        } else {
            setMessage('No email found for the current user.');
        }
    };

    const fetchPreferences = async (userEmail) => {
        try {
            const preference = await getUserEmailPreference(userEmail);
            setEmailPreference(preference);
        } catch (error) {
            setMessage('Failed to load preferences');
        }
    };

    const handleEmailPreferenceChange = async () => {
        const auth = getAuth();
        const userEmail = auth.currentUser?.email;
        if (userEmail) {
            try {
                const newPreference = !emailPreference;
                const updated = await updateEmailPreference(userEmail, newPreference);
                setEmailPreference(updated);
                setMessage('Email preferences updated successfully.');
            } catch (error) {
                console.error('Failed to update email preferences:', error);
                setMessage(`Error updating preferences: ${error.message}`);
            }
        } else {
            setMessage('No user logged in.');
        }
    };    

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="body-style">
            <div className='top-nav'>
                <BurgerMenu />
            </div>
            <div className="form-container">
                <h1 className="main-heading">Account Settings</h1>
                {currentUserEmail && <p className="user-email">Logged in as: {currentUserEmail}</p>}
                <div>
                    <h2 className="sub-heading">Email Preferences</h2>
                    <label className="label-style">
                        <input
                            type="checkbox"
                            className="checkbox-style"
                            checked={emailPreference}
                            onChange={handleEmailPreferenceChange}
                        />
                        Receive Daily Event Emails
                    </label>
                </div>
                <button onClick={handleSendPasswordResetEmail} className="action-button">
                    Send Password Reset Email
                </button>
                <p className={message.includes("Error") ? "error-text" : "message-text"}>
                    {message}
                </p>
            </div>
        </div>
    );
}

export default AccountSettings;
