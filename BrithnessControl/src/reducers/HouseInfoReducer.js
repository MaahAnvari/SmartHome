import { 
    HOUSE_USER_CHECK,
    HOUSE_UPDATE,
    HOUSE_CREATE,
    HOUSE_CREATE_FAIL,
    HOUSE_CREATE_FAIL_EXIST,
    HOUSE_ADD,
    HOUSE_ADD_FAIL,
    LOGOUT_USER
} from '../actions/types';

const INITIAL_STATE = {
    name: '',
    id: '',
    password: '',
    admin: '',
    activeDevices: {},
    activeHouses: {},
    location: {
        lat: null,
        lon: null
    },
    error: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) { 
        case HOUSE_UPDATE:
            return { ...state, [action.payload.prop]: action.payload.value };
       case HOUSE_CREATE:
            return { ...state, ...INITIAL_STATE, error: '' };
        case HOUSE_CREATE_FAIL:
            return { ...state, error: 'Create House Fail' };
        case HOUSE_CREATE_FAIL_EXIST:
            return { 
                ...state, 
                password: '', 
                error: ' is already exist, You should Add this house' 
            };
        case HOUSE_USER_CHECK:
            return { ...state, ...{ activeUser: { [action.payload]: action.payload } } };
        case HOUSE_ADD:
            return { ...state, ...INITIAL_STATE, error: '' };
        case HOUSE_ADD_FAIL:
            return { ...state, error: 'Add House Fail' };
        case LOGOUT_USER:
            return state;
        default:
            return { ...INITIAL_STATE };
    }
};
