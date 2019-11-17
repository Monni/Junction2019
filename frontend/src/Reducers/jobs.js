import { loop, Cmd } from 'redux-loop';
import cloneDeep from 'lodash/cloneDeep';
import * as apicalls from 'Functions/index';
import { JOBS_URL } from '../Constants/globals';

const Run = (func, ...args) => Cmd.run(func, {
    successActionCreator: x => x,
    args
});
const initialState = {
    getAsync: '',
    createAsync: '',
    data: [],
    error: '',
    getSingleAsync: '',
};


const jobsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'RESET_ASYNC': {
            return { ...state, getAsync: '', createAsync: '' }
        }
        case 'GET_ALL_JOBS': {
            return loop(
                { ...state, getAsync: 'FETCHING' },
                Run(apicalls.Get, 'GET_ALL_JOBS', JOBS_URL)
            )
        }
        case 'GET_ALL_JOBS_RESULT': return { ...state, getAsync: 'SUCCESS', data: action.payload }
        case 'GET_ALL_JOBS_ERROR': return { ...state, getAsync: 'ERROR', error: action.payload }

        case 'CREATE_NEW_JOB': {
            return loop({ ...state, createAsync: 'FETCHING' }, Run(apicalls.Post, 'CREATE_NEW_JOB', action.payload, JOBS_URL))
        }
        case 'CREATE_NEW_JOB_RESULT': {
            let data = cloneDeep(state.data);
            data.unshift(action.payload);
            return { ...state, createAsync: 'SUCCESS', data: data }
        }

        case 'CREATE_NEW_JOB_ERROR': return { ...state, createAsync: 'ERROR', error: action.payload }

        case 'GET_SINGLE_JOB_DATA': {
            return loop(
                { ...state, getSingleAsync: 'FETCHING' },
                Run(apicalls.Get, 'GET_SINGLE_JOB_DATA', action.payload)
            )
        }
        case 'GET_SINGLE_JOB_DATA_RESULT': return { ...state, getSingleAsync: 'SUCCESS', singleJobData: action.payload };

        case 'GET_SINGLE_JOB_DATA_ERROR': return { ...state, getSingleAsync: 'ERROR', error: action.payload }
        default: return { ...state };
    }
}

export default jobsReducer;