import { 
    SET_ACTIVE_HOUSE,
    DEVICE_DELETE,
    DEVICE_DELETE_FAIL,
    LOGOUT_USER   
} from '../actions/types';

const INITIAL_STATE = { 
    activeHouse: ''
};

export default (state = INITIAL_STATE, action) => {
    //console.log(action);
    switch (action.type) { 
        case SET_ACTIVE_HOUSE : 
            return { ...state, activeHouse: action.payload };
        case DEVICE_DELETE: {
            console.log('action', action.payload.content);
            return { ...state, activeHouse: action.payload.content, error: '' };
        }
        case DEVICE_DELETE_FAIL:
            return { ...state, error: 'Can not delete device.', loading: false };
        case LOGOUT_USER:
            return state;
        default:
            return state;
    }
};
