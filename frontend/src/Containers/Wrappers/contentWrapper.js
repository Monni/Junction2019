import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './wrappers.css'
import Header from '../../Components/Header/header';
import List from '../Jobs/list';

import { LIST_PATH } from '../../Constants/globals';
import LandingPage from '../Landing/landingPage';

class ContentWrapper extends Component {
    render() {
        return (
            <div className="content-wrapper">
                <Header />
                <div className="content-container">
                    <Router>
                        <Switch>
                            <Route exact path={'/'} component={LandingPage} />
                            <Route exact path={LIST_PATH} component={List} />
                        </Switch>
                    </Router>
                </div>
            </div>
        );
    }
}

export default ContentWrapper;