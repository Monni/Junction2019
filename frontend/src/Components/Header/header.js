import React, { Component } from 'react';
import './header.css';

class Header extends Component {
    render() {
        // TODO Scale header
        return (
            <div className="header-container">
                <img alt="imagine" src={require('../../Images/stara.jpg')} height="65"/>
            </div>
        );
    }
}

export default Header;