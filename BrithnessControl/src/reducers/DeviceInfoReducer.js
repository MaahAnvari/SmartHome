import { 
    DEVICE_USER_CHECK,
    DEVICE_UPDATE,
    DEVICE_CREATE,
    DEVICE_CREATE_FAIL,
    DEVICE_CREATE_FAIL_EXIST,
    DEVICE_ADD,
    DEVICE_ADD_FAIL,
    LOGOUT_USER
} from '../actions/types';

const INITIAL_STATE = {
    name: '',
    id: '',
    password: '',
    admin: '',
    deviceStatus: {
        c1: false,
        c2: false,
        c3: false
    },
    activeHouses: {},
    activeUsers: {},
    error: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) { 
        case DEVICE_UPDATE:
            return { ...state, [action.payload.prop]: action.payload.value };
       case DEVICE_CREATE:
            return { ...state, ...INITIAL_STATE, error: '' };
        case DEVICE_CREATE_FAIL:
            return { ...state, error: 'Create Device Fail' };
        case DEVICE_CREATE_FAIL_EXIST:
            return { 
                ...state, 
                password: '', 
                error: ' is already exist, You should Add this device' 
            };
        case DEVICE_USER_CHECK:
            return { ...state, ...{ activeUser: { [action.payload]: action.payload } } };
        case DEVICE_ADD:
            return { ...state, ...INITIAL_STATE, error: '' };
        case DEVICE_ADD_FAIL:
            return { ...state, error: 'Add Device Fail' };
        // case DEVICE_UPDATE_STATUS_FAIL:
        //     return { ...state, error: 'Can not update device status' };
        case LOGOUT_USER:
            return state;
        default:
            return { ...INITIAL_STATE };
    }
};
