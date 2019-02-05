import Kuzzle from 'kuzzle-sdk/dist/kuzzle';
import { Actions } from 'react-native-router-flux';
import { 
    USERNAME_CHANGED,
    PASSWORD_CHANGED,
    USERNAME_CHANGED_ON_REGISTER,
    PASSWORD_CHANGED_ON_REGISTER,
    PASSWORD_REPEAT,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    REGISTER_USER_FAIL,
    REGISTER_USER_SUCCESS,
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER, 
    USER_UPDATE_LOCATION,
    USER_UPDATE_LOCATION_FAIL
} from './types';


 const kuzzle = new Kuzzle('192.168.1.121', {}); 
// const kuzzle = new Kuzzle('172.20.10.5', {}); 

export const usernameChanged = (text) => {
    return {
        type: USERNAME_CHANGED,
        payload: text
    };
};

export const passwordChanged = (text) => {
    return {
        type: PASSWORD_CHANGED, 
        payload: text
    };
};

export const usernameChangedOnRegister = (text) => {
    return {
        type: USERNAME_CHANGED_ON_REGISTER,
        payload: text
    };
};

export const passwordChangedOnRegister = (text) => {
    return {
        type: PASSWORD_CHANGED_ON_REGISTER, 
        payload: text
    };
};

export const confirmPasswordChanged = (text) => {
    console.log('oomad too confirm');
    return {
        type: PASSWORD_REPEAT, 
        payload: text
    };
};

export const loginUser = ({ username, password }) => {
    const expiresIn = '2h';
    return (dispatch) => {
        dispatch({ type: LOGIN_USER });
        kuzzle.login('local', { username, password }, expiresIn, (err, res) => {
            if (err) {
                console.log('login fail', err);
                dispatch({ type: LOGIN_USER_FAIL });
            } else if (res) {
                kuzzle.setJwtToken(res);
                kuzzle.collection('users', 'brightness')
                 .fetchDocument(username, (error, result) => {
                     if (error) {
                         console.log('not find user doc');
                         dispatch({ type: LOGIN_USER_FAIL });
                     } else if (result) {
                        dispatch({ type: LOGIN_USER_SUCCESS, payload: result, token: res });
                        //subscribe(res, username);
                        Actions.houseList({ type: 'reset', username });
                     }
                });
            }
        });
    };
};


export const registerUser = ({ username, password, confirmPassword }) => {
    const user = {
        content: {
          profileIds: ['user'],
          firstname: username,
        },
        credentials: {
          local: {
            username,
            password
          }
        }
      };
    return (dispatch) => {
        dispatch({ type: REGISTER_USER });
        if (password === confirmPassword) {
            kuzzle.security.createUser(username, user, (error, response) => {
                if (error) {
                    console.log("you can't register", error);
                    dispatch({ type: REGISTER_USER_FAIL });
                } else if (response) {
                    console.log('create user', response);
                    kuzzle.login('local', { username, password }, '60s', (err, result) => {
                        kuzzle.setJwtToken(result);
                        kuzzle.collection('users', 'brightness')
                        .createDocument(
                            username,
                            { name: username,
                              password, 
                              activeHouses: {},
                              location: {
                                lat: 37.42199833,
                                lon: -122.084000
                               }
                            },
                            {}, 
                            (err2, res) => {
                                if (err2) {
                                    console.log('create this username before');
                                    dispatch({ type: REGISTER_USER_FAIL });
                                } else if (res) {
                                    dispatch({ type: REGISTER_USER_SUCCESS, payload: res });
                                    Actions.Login({ type: 'reset' });
                                }
                        });
                    });
                }
            });
        } else {
            console.log('password and confirm password does not match');
            dispatch({ type: REGISTER_USER_FAIL });
        }
    };
};

export const updateLocation = ({ token, username, location }) => {
    return (dispatch) => {
        const loc = {
            lat: location.latitude,
            lon: location.longitude
        };
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            if (!resT.valid) {
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                kuzzle.setJwtToken(token.jwt);
                kuzzle.collection('users', 'brightness')
                    .updateDocument(username, { location: loc }, 
                        (error, result) => {
                        if (error) {
                            console.error(error.status, ': ', error.message);
                                dispatch({ type: USER_UPDATE_LOCATION_FAIL });
                            } else if (result) {
                                dispatch({ type: USER_UPDATE_LOCATION, payload: result });
                            }
                    });
                }
            });
    };
};
