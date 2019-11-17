import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './Store/index';
import 'bootstrap/dist/css/bootstrap.css';
import ContentWrapper from './Containers/Wrappers/contentWrapper';

ReactDOM.render(
    <Provider store={store}>
        <ContentWrapper/>
    </Provider>
    , document.getElementById('root'));
