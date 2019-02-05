import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import DeviceInfoReducer from './DeviceInfoReducer';
import DeviceReducer from './DeviceReducer';
import RegisterReducer from './RegisterReducer';
import HouseReducer from './HouseReducer';
import HouseInfoReducer from './HouseInfoReducer';
import SetCurrentHouseReducer from './SetCurrentHouseReducer';

export default combineReducers({
    register: RegisterReducer,
    auth: AuthReducer,
    deviceCreate: DeviceInfoReducer,
    devices: DeviceReducer,
    houses: HouseReducer,
    houseCreate: HouseInfoReducer,
    activeHouse: SetCurrentHouseReducer
});
