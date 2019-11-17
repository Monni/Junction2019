import {applyMiddleware, createStore, compose} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../Reducers/index';
import {install} from 'redux-loop';

const loadStore = () => {
    try {
        const serializedState = sessionStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};
const saveStore = state => {
    try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem('state', serializedState);
    } catch (err) {
    }
};
const middleware = applyMiddleware(thunk, logger);
const enhancer = compose(
    middleware, install()
);
const persistedState = loadStore();
const store = createStore(rootReducer, persistedState, enhancer);
store.subscribe(() => {
    saveStore({
        jobs: store.getState().jobs,
        users: store.getState().users,
    });
});

export default store;

