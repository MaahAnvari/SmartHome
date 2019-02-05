import { 
    DEVICE_FETCH,
    DEVICE_UPDATE_STATUS,
    DEVICE_UPDATE_STATUS_FAIL,
    DEVICE_UPDATE_NAME,
    DEVICE_UPDATE_NAME_FAIL,
    LOGOUT_USER
} from '../actions/types';

const INITIAL_STATE = {
};

export default (state = INITIAL_STATE, action) => {  
    switch (action.type) { 
        case DEVICE_FETCH: 
            return { ...state, 
                devices: action.payload
            };
        case DEVICE_UPDATE_STATUS: { 
            const dev = state.devices;
            dev[action.name] = action.payload.content;
            return { ...state, devices: dev }; 
        }
        case DEVICE_UPDATE_STATUS_FAIL:
            return { ...state, error: 'Can not update device status' };
        case DEVICE_UPDATE_NAME: 
            return { ...state }; 
        case DEVICE_UPDATE_NAME_FAIL:
            return { ...state, error: 'Can not update device name' };
        case LOGOUT_USER:
            return state;
        default:
            return state;
    }
};
