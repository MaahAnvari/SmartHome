import { 
    USERNAME_CHANGED_ON_REGISTER, 
    PASSWORD_CHANGED_ON_REGISTER,
    PASSWORD_REPEAT,
    REGISTER_USER_FAIL,
    REGISTER_USER_SUCCESS,
    REGISTER_USER,
    LOGOUT_USER
} from '../actions/types';

const INITIAL_STATE = { 
    user: null,
    username: '',
    password: '',
    confirmPassword: '',
    error: '',
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    //console.log(action);
    switch (action.type) { 
        case USERNAME_CHANGED_ON_REGISTER: 
            return { ...state, username: action.payload };
        case PASSWORD_CHANGED_ON_REGISTER:
            return { ...state, password: action.payload };
        case PASSWORD_REPEAT:
            console.log('reducer confirm');
            return { ...state, confirmPassword: action.payload };
        case REGISTER_USER_SUCCESS:
            return { ...state, ...INITIAL_STATE, user: action.payload, error: '', loading: false };
        case REGISTER_USER_FAIL:
            return { ...state, error: 'Registration Failed.', loading: false };
        case REGISTER_USER:
            return { ...state, loading: true, error: '' };
        case LOGOUT_USER:
            return state;
        default:
            return state;
    }
};
