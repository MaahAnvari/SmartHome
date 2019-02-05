import Kuzzle from 'kuzzle-sdk/dist/kuzzle';
import { Actions } from 'react-native-router-flux';
import { 
    DEVICE_USER_CHECK,
    DEVICE_UPDATE,
    DEVICE_CREATE,
    DEVICE_CREATE_FAIL,
    DEVICE_CREATE_FAIL_EXIST,
    DEVICE_ADD,
    DEVICE_ADD_FAIL,
    DEVICE_FETCH,
    DEVICE_UPDATE_STATUS,
    DEVICE_UPDATE_STATUS_FAIL,
    DEVICE_UPDATE_NAME,
    DEVICE_UPDATE_NAME_FAIL,
    DEVICE_DELETE,
    DEVICE_DELETE_FAIL,
    LOGOUT_USER
    // DEVICE_DELETE_FAIL
} from './types';

// const kuzzle = new Kuzzle('172.20.10.5', {}); 
const kuzzle = new Kuzzle('192.168.1.121', {}); 

export const ckekUser = ({ token, username }) => {
    return (dispatch) => {
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            console.log('valid', resT);
            if (!resT.valid) {
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                kuzzle.setJwtToken(token.jwt);
                kuzzle.collection('current_users', 'users')
                .fetchDocument(username, (error, result) => {
                    if (error) {
                        console.log('invalid username');
                    } else if (result) {
                        dispatch({ type: DEVICE_USER_CHECK, payload: result });
                        Actions.createDevice({ type: 'reset' });
                    }
                });
            }
        });
    };
};


export const deviceUpdate = ({ prop, value }) => {
    return {
        type: DEVICE_UPDATE,
        payload: { prop, value }
    };
};

export const createDevice = ({ token, name, id, password, deviceStatus, username, house }) => {
    return (dispatch) => {
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            console.log('valid', resT);
            if (!resT.valid) {
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                kuzzle.setJwtToken(token.jwt);
                kuzzle.collection('devices', 'brightness')
                    .createDocument(id, 
                        { name, 
                            id, 
                            password, 
                            admin: username, 
                            deviceStatus, 
                            activeHouse: { [house.id]: house.id },
                            activeUsers: { [username]: username }
                        },
                        (err, res) => {
                            if (err) {
                                console.log('error ', err);
                                dispatch({ type: DEVICE_CREATE_FAIL_EXIST });
                            } else if (res) {
                                kuzzle.collection('house', 'brightness')
                                    .updateDocument(house.id, { 
                                        ...{ activeDevices: { [id]: id } 
                                    } },
                                        (error, result) => {
                                        if (error) {
                                        console.error(error.status, ': ', error.message);
                                        dispatch({ type: DEVICE_CREATE_FAIL });
                                    } else if (result) {
                                        dispatch({ type: DEVICE_CREATE, payload: result });
                                        Actions.deviceList({ username, house: house.id });
                                    }
                                });
                            }
                        });
                    }
                });
        };
};


export const addDevice = ({ token, id, password, username, house }) => {
    return (dispatch) => {
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            console.log('valid', resT);
            if (!resT.valid) {
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                kuzzle.setJwtToken(token.jwt);
                kuzzle.collection('devices', 'brightness').fetchDocument(id, (error, result) => {
                        if (error || result.content.password !== password) {
                            console.log('add device fail', error);
                            dispatch({ type: DEVICE_ADD_FAIL });
                        } else if (result.content.password === password) {
                            kuzzle.collection('house', 'brightness')
                            .updateDocument(house.id, { ...{ activeDevices: { [id]: id } } },
                                (err, res) => {
                                    console.log('find user collection');
                                    if (err) {
                                        console.error(error.status, ': ', error.message); 
                                        dispatch({ type: DEVICE_ADD_FAIL });
                                    } else if (res) {
                                        kuzzle.collection('devices', 'brightness')
                                        .updateDocument(
                                            id, 
                                            { ...{ 
                                                activeHouse: { [house.id]: house.id },
                                                activeUsers: { [username]: username } 
                                            } 
                                        },
                                            (er, re) => {
                                                if (er) {
                                                    dispatch({ type: DEVICE_ADD_FAIL });
                                                } else {
                                                    dispatch({ type: DEVICE_ADD, payload: re });
                                                    Actions.deviceList({ username, house });
                                                }
                                        });
                                    }
                                });
                            }
                    });
                }
            });
        };
};

export const deleteDevice = ({ token, id, username, house }) => {
    console.log('start delete', username, house);
    return (dispatch) => {
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            console.log('valid', resT);
            if (!resT.valid) {
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                kuzzle.setJwtToken(token.jwt);
                kuzzle.collection('house', 'brightness')
                    .fetchDocument(house.id, (err0, res0) => {
                        if (err0) {
                            console.error(err0.status, ': ', err0.message); 
                        } else if (res0) {
                            const doc0 = res0.content;
                            delete doc0.activeDevices[id];
                            kuzzle.collection('house', 'brightness')
                            .replaceDocument(house.id, doc0, (error0, result0) => {
                                if (error0) {
                                    console.log('can not delete dvice doc');
                                    dispatch({ type: DEVICE_DELETE_FAIL });
                                } else if (result0) {
                                    kuzzle.collection('devices', 'brightness')
                                        .fetchDocument(id, (err, res) => {
                                            if (err) {
                                                console.error(err.status, ': ', err.message); 
                                            } else if (res) {
                                                const doc = res.content;
                                                delete doc.activeHouse[house.id];
                                                console.log('delete id from house');
                                                kuzzle.collection('devices', 'brightness')
                                                .replaceDocument(id, doc, (error, result) => {
                                                    if (error) {
                                                        console.log('can not delete dvice doc');
                                                        dispatch({ type: DEVICE_DELETE_FAIL });
                                                    } else if (result) {
                                                        console.log('delete end', result0);
                                                        dispatch({ 
                                                            type: DEVICE_DELETE, payload: result0 
                                                        });
                                                        Actions.deviceList({ 
                                                            type: 'reset', house 
                                                        });
                                                    }
                                                });
                                            }
                                    });
                                }
                            });
                        }
                });
            }
        });
    };
};

export const deleteDeviceAdmin = ({ token, id, username, house }) => {
    console.log('start delete', username, id);
    return (dispatch) => {
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            console.log('valid', resT);
            if (!resT.valid) {
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                kuzzle.setJwtToken(token.jwt);
                kuzzle.collection('devices', 'brightness')
                    .fetchDocument(id, (err0, res0) => {
                        if (err0) {
                            console.error(err0.status, ': ', err0.message); 
                        } else if (res0) {
                            const houseDoc = Object.values(res0.content.activeHouse);
                            console.log('delete admin', houseDoc);
                            if (fetchHouse(houseDoc, id)) {
                                kuzzle.collection('devices', 'brightness')
                                .deleteDocument(id, (err, res) => {
                                    if (!err) {
                                        kuzzle.collection('house', 'brightness')
                                        .fetchDocument(house.id, (err1, res1) => {
                                            if (!err1) {
                                                dispatch({ type: DEVICE_DELETE, payload: res1 });
                                                Actions.deviceList({ type: 'reset' });
                                            }
                                            });
                                    } else { 
                                    dispatch({ type: DEVICE_DELETE_FAIL });
                                    }
                                });
                            } else {
                                dispatch({ type: DEVICE_DELETE_FAIL });
                            }
                        }
                });
            }
        });
    };
};

const fetchHouse = async(house, id) => {
    for (let index = 0; index < house.length; index++) {
        await kuzzleFetchHouse(house[index], id);
    }
    return true;
};

const kuzzleFetchHouse = (house, id) => new Promise((resolve, reject) => {
    kuzzle.collection('house', 'brightness')
        .fetchDocument(house, (err, res) => {
            if (!err) {
                console.log(id);
                const doc = res.content;
                delete doc.activeDevices[id];
                kuzzle.collection('house', 'brightness')
                    .replaceDocument(house, doc, (error, result) => {
                        if (!error) {
                            console.log('house delete', house);
                            resolve(true);
                        } else {
                            console.log('can not delete house', house);
                            reject(err);
                        }
                });
            } else {
                reject(err);
            }
        }
    );
});


export const devicesFetch = ({ token, house }) => {
    // console.log('fetch house');
    return (dispatch) => {
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            if (!resT.valid) {
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                kuzzle.setJwtToken(token.jwt);
                kuzzle.collection('house', 'brightness')
                  .fetchDocument(house.id, (error, result) => {
                    if (error) {
                        console.log('error', error);
                        console.log('can not find house document');
                        Actions.Login({ type: 'reset' });
                    } else {
                        const device = result.content.activeDevices; 
                        fetch(device, result)
                            .then((array) => dispatch({ 
                                type: DEVICE_FETCH, payload: [array][0] 
                            })); 
                    }
                });
            }
        });
    };
};

const fetch = async(device, result) => {
    let array = device;
    for (let index = 0; index < Object.values(device).length; index++) {
        if (index === Object.values(device).length - 1) {
            return await kuzzleFetch(array, index, result);
        }
        array = await kuzzleFetch(array, index, result);
    }
    return array;
};

const kuzzleFetch = (device, index, result) => new Promise((resolve, reject) => {
    const array = device;
    kuzzle.collection('devices', 'brightness')
        .fetchDocument(Object.keys(device)[index], (err, res) => {
            if (!err) {
                array[Object.keys(result.content.activeDevices)[index]] = res.content;
                resolve(array);
            } else {
                reject(err);
            }
        }
    );
});


export const deviceStatusUpdate = ({ token, name, deviceStatus, channel }) => {
    return (dispatch) => {
        console.log('tokeeeeeeeeeeeen', token);
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            console.log('valid', resT);
            if (!resT.valid) {
                console.log('invalid');
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                console.log('valid');
                kuzzle.setJwtToken(token.jwt);
                kuzzle.collection('devices', 'brightness')
                    .updateDocument(name, { deviceStatus: { [channel]: deviceStatus } }, 
                        (error, result) => {
                        if (error) {
                            console.log('oomad too');
                            console.error(error.status, ': ', error.message);
                                dispatch({ type: DEVICE_UPDATE_STATUS_FAIL });
                            } else if (result) {
                                console.log('updateeeeeeeeeeeeee');
                                dispatch({ 
                                    type: DEVICE_UPDATE_STATUS, name, channel, payload: result 
                                });
                            }
                    });
                }
            });
    };
};

export const editeDeviceName = ({ token, house, username, newName, id }) => {
    return (dispatch) => {
        kuzzle.checkToken(token.jwt, (errT, resT) => {
            console.log('valid', resT);
            if (!resT.valid) {
                kuzzle.unsetJwtToken();
                dispatch({ type: LOGOUT_USER });
                Actions.Login({ type: 'reset' });
            } else {
                kuzzle.setJwtToken(token.jwt);
                kuzzle.collection('devices', 'brightness')
                    .updateDocument(id, { name: newName }, 
                        (error, result) => {
                        if (error) {
                            console.error(error.status, ': ', error.message);
                                dispatch({ type: DEVICE_UPDATE_NAME_FAIL });
                            } else if (result) {
                                console.log('update action', newName, result);
                                dispatch({ 
                                    type: DEVICE_UPDATE_NAME, name: newName, payload: result 
                                });
                                Actions.deviceList({ type: 'reset', username, house }); 
                            }
                    });
                }
            });
    };
};
