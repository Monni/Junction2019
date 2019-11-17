import {combineReducers} from 'redux-loop';
import jobsReducer from './jobs';
import usersReducer from './user';

const rootReducer = combineReducers({
    jobs: jobsReducer,
    users: usersReducer,
});

export default rootReducer;
