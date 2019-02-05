import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import LoginForm from './components/LoginForm';
import AddDevice from './components/AddDevice';
import AddHouse from './components/AddHouse';
import HouseList from './components/HouseList';
import DeviceList from './components/DeviceList';
import DeviceEdit from './components/DeviceEdit';
import CreateDevice from './components/CreateDevice';
import CreateHouse from './components/CreateHouse';
import RegisterForm from './components/RegisterForm';
import ChooseDeviceState from './components/ChooseDeviceState';
import ChooseHouseState from './components/ChooseHouseState';

const RouterComponent = () => {
    return (
        <Router>
            <Scene key="root">
                <Scene
                    key="Login" 
                    component={LoginForm} 
                    title="Please Login " 
                    titleStyle={{ paddingLeft: 140 }}
                    initial 
                />
                <Scene
                    key="Register" 
                    component={RegisterForm} 
                    title="Register " 
                    titleStyle={{ paddingLeft: 100 }}
                />
                <Scene
                    key="houseList"
                    component={HouseList}
                    title="Active Houses"
                    rightTitle="Add"
                    onRight={() => Actions.createHouse({ type: 'reset' })}
                    leftTitle="Logout"
                    onLeft={() => Actions.Login({ type: 'reset' })}
                    titleStyle={{ paddingLeft: 85 }}
                    
                    //initial
                />
                <Scene
                    key="createHouse"
                    component={ChooseHouseState}
                    title="Create House"
                    leftTitle="Back"
                    onLeft={() => Actions.houseList({ type: 'reset' })}
                    titleStyle={{ paddingLeft: 90 }}
                />
                <Scene
                    key="createNewHouse"
                    component={CreateHouse}
                    title="Create new House"
                    titleStyle={{ paddingLeft: 80 }}
                />
                <Scene
                    key="AddHouse"
                    component={AddHouse}
                    title="Add House"
                    titleStyle={{ paddingLeft: 105 }}
                />
                <Scene
                    key="deviceList"
                    component={DeviceList}
                    title="Active Devices"
                    rightTitle="Add"
                    onRight={() => Actions.createDevice({ type: 'reset' })}
                    leftTitle="House"
                    onLeft={() => Actions.houseList({ type: 'reset' })}
                    titleStyle={{ paddingLeft: 90 }}
                />
                <Scene
                    key="createDevice"
                    component={ChooseDeviceState}
                    title="Create Device"
                    leftTitle="Device"
                    onLeft={() => Actions.deviceList({ type: 'reset' })}
                    titleStyle={{ paddingLeft: 90 }}
                />
                <Scene
                    key="createNewDevice"
                    component={CreateDevice}
                    title="Create new Device"
                    titleStyle={{ paddingLeft: 70 }}
                />
                <Scene
                    key="AddDevice"
                    component={AddDevice}
                    title="Add Device"
                    titleStyle={{ paddingLeft: 105 }}
                />
                <Scene
                    key="editDevice"
                    component={DeviceEdit}
                    title="Edit Device "
                    leftTitle="Device"
                    onLeft={() => Actions.deviceList({ type: 'reset' })}
                    titleStyle={{ paddingLeft: 90 }}
                />
            </Scene>
        </Router>
    );
};

export default RouterComponent;
