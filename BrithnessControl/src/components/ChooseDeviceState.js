import React, { Component } from 'react';
import { View, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { CardSection, Button } from './common';
import { deviceUpdate, createDevice, } from '../actions';

const image = require('../../pictures/18.jpg');

class ChooseDeviceState extends Component {
    
    onNewButtonPress() {
        Actions.createNewDevice();
    }

    onAddButtonPress() {
        Actions.AddDevice();
    }

    render() {
        return (
            <ImageBackground source={image} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }} >
            {/*<View style={styles.ViewContainer}>*/}
                <View>
                    <CardSection style={{ borderBottomWidth: 0, borderWidth: 0, borderColor: '#309a86' }}>
                        <Button onPress={this.onNewButtonPress.bind(this)}>
                            Create new
                        </Button>
                    </CardSection>
                    <CardSection style={{ borderBottomWidth: 0, borderWidth: 0, borderColor: '#309a86' }}>
                        <Button onPress={this.onAddButtonPress.bind(this)}>
                            Add device
                        </Button>
                    </CardSection>
                </View>
                <View />
            </ImageBackground>
        );
    }
}

const styles = {
    ViewContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#32999b',
        borderWidth: 0,
        borderRadius: 5,
        borderColor: '#309a86', 
        borderBottomWidth: 0,
        shadowOffset: { width: 0, height: 10 },
        shadowColor: '#000',
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
    }
};
    
const mapStateToProps = (state) => {
    const { name, id, password, deviceStatus } = state.deviceCreate;
    const { username } = state.auth;
    return { name, id, password, deviceStatus, username, house: state.activeHouse.activeHouse };
};

export default connect(mapStateToProps, 
    { deviceUpdate, createDevice }
)(ChooseDeviceState);
