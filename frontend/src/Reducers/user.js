import { loop, Cmd } from 'redux-loop';
import * as apicalls from 'Functions/index';
import { USERS_URL, LIST_PATH } from '../Constants/globals';

const Run = (func, ...args) => Cmd.run(func, {
    successActionCreator: x => x,
    args
});
const initialState = {
    async: '',
    data: {},
    error: '',
};

const navToListing = () => {
    window.location.href = LIST_PATH;
}

const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_USER_INFO': {
            return loop(
                { ...state, async: 'FETCHING' },
                Run(apicalls.Get, 'GET_USER_INFO', USERS_URL + action.payload + '/')
            )
        }
        case 'GET_USER_INFO_RESULT': {
            return loop(
                { ...state, async: 'SUCCESS', data: action.payload },
                Run(navToListing)
            )
        }
        case 'GET_USER_INFO_ERROR': return { ...state, async: 'ERROR', error: action.paylaod }

        default: return state;
    }
}

export default usersReducer;