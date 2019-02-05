import { 
    USERNAME_CHANGED, 
    PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    REGISTER_USER_FAIL,
    REGISTER_USER_SUCCESS,
    LOGIN_USER,
    HOUSE_DELETE,
    HOUSE_DELETE_FAIL,
    LOGOUT_USER,
    USER_UPDATE_LOCATION,
    USER_UPDATE_LOCATION_FAIL
} from '../actions/types';

const INITIAL_STATE = { 
    user: null,
    username: '',
    password: '',
    activeHouses: {},
    location: {
        lat: 36.42199833,
        lon: -122.0840002
    },
    error: '',
    token: '',
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    //console.log(action);
    switch (action.type) { 
        case USERNAME_CHANGED: 
            return { ...state, username: action.payload };
        case PASSWORD_CHANGED:
            return { ...state, password: action.payload };
        case LOGIN_USER_SUCCESS: 
            return { 
                ...state, 
                user: action.payload.content, 
                token: action.token, 
                error: '', 
                loading: false 
            };
        case LOGIN_USER_FAIL:
            return { ...state, error: 'Authentication Failed.', loading: false };
        case REGISTER_USER_SUCCESS: 
            return { 
                ...state, 
                ...INITIAL_STATE,
                user: action.payload.content, 
                error: '', 
                loading: false 
            };
        case REGISTER_USER_FAIL:
            return { ...state, error: 'Registration Failed.', loading: false };
        case LOGIN_USER:
            return { ...state, loading: true, error: '' };
        case HOUSE_DELETE: 
            return { ...state, user: action.payload.content, error: '' };
        case HOUSE_DELETE_FAIL:
            return { ...state, error: 'Can not delete device.', loading: false };
        case LOGOUT_USER:
            return { state, error: 'Token expire.', loading: false };
        case USER_UPDATE_LOCATION: 
            return { ...state, user: action.payload.content }; 
        case USER_UPDATE_LOCATION_FAIL:
            return { ...state };
        default:
            return state;
    }
};
