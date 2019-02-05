import { 
    HOUSE_FETCH,
    HOUSE_UPDATE_NAME,
    HOUSE_UPDATE_NAME_FAIL,
    LOGOUT_USER
} from '../actions/types';

const INITIAL_STATE = {
};

export default (state = INITIAL_STATE, action) => {  
    switch (action.type) { 
        case HOUSE_FETCH: 
            return { ...state, 
                houses: action.payload
            };
        case HOUSE_UPDATE_NAME: { 
                return { ...state }; 
            }
        case HOUSE_UPDATE_NAME_FAIL:
            return { ...state, error: 'Can not update device name' };
        case LOGOUT_USER:
            return state;
        default:
            return state;
    }
};
