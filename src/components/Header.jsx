// src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Optional: For styling

const Header = () => {
    return (
        <header className="app-header">
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/questions">All Questions</Link>
                    </li>
                    {/* Add more navigation links as needed */}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
