import Kuzzle from 'kuzzle-sdk/dist/kuzzle';
import { Actions } from 'react-native-router-flux';
import { 
    HOUSE_FETCH,
    SET_ACTIVE_HOUSE,
    HOUSE_UPDATE,
    HOUSE_ADD,
    HOUSE_ADD_FAIL,
    HOUSE_CREATE_FAIL_EXIST,
    HOUSE_CREATE,
    HOUSE_CREATE_FAIL,
    HOUSE_DELETE,
    HOUSE_DELETE_FAIL,
    HOUSE_UPDATE_NAME,
    HOUSE_UPDATE_NAME_FAIL,
    LOGOUT_USER
} from './types';

// const kuzzle = new Kuzzle('172.20.10.5', {}); 
const kuzzle = new Kuzzle('192.168.1.121', {}); 

export const setActiveHouse = ({ house }) => {
    return {
        type: SET_ACTIVE_HOUSE,
        payload: house
    };
};

export const houseUpdate = ({ prop, value }) => {
    return {
        type: HOUSE_UPDATE,
        payload: { prop, value }
    };
};

export const houseFetch = ({ token, username }) => {
    return (dispatch) => {
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            if (!resT.valid) {
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                kuzzle.setJwtToken(token.jwt);
                kuzzle.collection('users', 'brightness')
                .fetchDocument(username, (error, result) => {
                    const house = result.content.activeHouses; 
                    if (error) {
                        console.log('error', error);
                        console.log('can not find user document');
                        Actions.Login({ type: 'reset' });
                    } else {
                        fetch(house, result)
                            .then((array) => dispatch({ type: HOUSE_FETCH, payload: [array][0] })); 
                    }
                });
            }
        });
    };
};

const fetch = async(house, result) => {
    let array = house;
    for (let index = 0; index < Object.values(house).length; index++) {
        if (index === Object.values(house).length - 1) {
            return await kuzzleFetch(array, index, result);
        }
        array = await kuzzleFetch(array, index, result);
    }
    return array;
};

const kuzzleFetch = (house, index, result) => new Promise((resolve, reject) => {
    const array = house;
    kuzzle.collection('house', 'brightness')
        .fetchDocument(Object.keys(house)[index], (err, res) => {
            if (!err) {
                array[Object.keys(result.content.activeHouses)[index]] = res.content;
                resolve(array);
            } else {
                reject(err);
            }
        }
    );
});

export const createHouse = ({ token, name, id, password, username, location }) => {
    return (dispatch) => {
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            if (!resT.valid) {
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                kuzzle.setJwtToken(token.jwt);
                kuzzle.collection('house', 'brightness')
                    .createDocument(id, 
                        { name, 
                            id, 
                            password, 
                            admin: username, 
                            activeDevices: {},
                            location
                        },
                        (err, res) => {
                            if (err) {
                                console.log('error ', err);
                                dispatch({ type: HOUSE_CREATE_FAIL_EXIST });
                            } else if (res) {
                                kuzzle.collection('users', 'brightness')
                                    .updateDocument(username, { ...{ activeHouses: { [id]: id } } },
                                        (error, result) => {
                                        if (error) {
                                        console.error(error.status, ': ', error.message);
                                        dispatch({ type: HOUSE_CREATE_FAIL });
                                    } else if (result) {
                                        dispatch({ type: HOUSE_CREATE, payload: result });
                                        Actions.houseList({ type: 'reset', username });
                                    }
                                });
                            }
                        });
                    }
                });
        };
};


export const addHouse = ({ token, id, password, username }) => {
    return (dispatch) => {
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            if (!resT.valid) {
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                kuzzle.setJwtToken(token.jwt);
                kuzzle.collection('house', 'brightness').fetchDocument(id, (error, result) => {
                        if (error || result.content.password !== password) {
                            console.log('add house fail', error);
                            dispatch({ type: HOUSE_ADD_FAIL });
                        } else if (result.content.password === password) {
                            kuzzle.collection('users', 'brightness')
                            .updateDocument(username, { ...{ activeHouses: { [id]: id } } },
                                (err, res) => {
                                    if (err) {
                                        console.error(error.status, ': ', error.message); 
                                        dispatch({ type: HOUSE_ADD_FAIL });
                                    } else if (res) {
                                        dispatch({ type: HOUSE_ADD, payload: res });
                                        Actions.houseList({ type: 'reset', username });
                                    }
                                });
                            }
                    });
                }
            });
        };
};

export const deleteHouse = ({ token, username, house }) => {
    // console.log('start delete', username, house.id);
    return (dispatch) => {
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            if (!resT.valid) {
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                kuzzle.setJwtToken(token.jwt);
                kuzzle.collection('users', 'brightness')
                    .fetchDocument(username, (err, res) => {
                        if (err) {
                            console.error(err.status, ': ', err.message); 
                        } else if (res) {
                            console.log('delete res ', res);
                            const doc = res.content;
                            delete doc.activeHouses[house.id];
                            console.log('house document', doc.activeHouses);
                            kuzzle.collection('users', 'brightness')
                            .replaceDocument(username, doc, (error, result) => {
                                if (error) {
                                    // console.log('can not delete dvice doc');
                                    dispatch({ type: HOUSE_DELETE_FAIL });
                                } else if (result) {
                                    dispatch({ type: HOUSE_DELETE, payload: result });
                                    Actions.houseList({ type: 'reset', username });
                                }
                            });
                        }
                });
            }
        });
    };
};

export const editeHouseName = ({ token, house, newName }) => {
    console.log('edit house', token);
    return (dispatch) => {
        kuzzle.setJwtToken(token.jwt);
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            if (!resT.valid) {
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                kuzzle.collection('house', 'brightness')
                .updateDocument(house.id, { name: newName }, 
                    (error, result) => {
                    if (error) {
                        console.error(error.status, ': ', error.message);
                            dispatch({ type: HOUSE_UPDATE_NAME_FAIL });
                        } else if (result) {
                            // console.log('update action', newName, result);
                            dispatch({ type: HOUSE_UPDATE_NAME, name: newName, payload: result });
                            Actions.houseList({ type: 'reset', house }); 
                        }
                });
            }
        });
    };
};

