import React, { Component } from 'react';
import { Text, View, Modal, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { CardSection, Button, Input } from './common';
import { deviceUpdate, editeDeviceName, deleteDevice, deleteDeviceAdmin } from '../actions';

const image = require('../../pictures/22.jpg');

class DeviceEdit extends Component {
    state = { nameModal: false, showModal: false };

    onAcceptName() {
        const { token, house, newName, username } = this.props;
        const { id } = this.props.device;
        this.props.editeDeviceName({ token, house, username, newName, id });
    }

    onDeclineName() {
        this.setState({ nameModal: false });
    }

    onAccept() {
        const { id, admin } = this.props.device;
        const { token, username, house } = this.props;
        console.log(admin, username, id, house);
        if (admin === username) {
         this.props.deleteDeviceAdmin({ token, username, id, house });
        } else {                       
         this.props.deleteDevice({ token, id, username, house });
        }
    }

    onDecline() {
        this.setState({ showModal: false });
    }

    render() {
        const {
             textStyle, 
             containerStyle,
             cardeSectionStyle 
        } = styles;
        console.log(this.props.device);
        const author = this.props.device.admin;
        const updater = this.props.device['_kuzzle_info'].updater;
        return (
            <ImageBackground source={image} style={{ flex: 1, resizeMode: 'cover' }} >
            {/*<View style={ViewContainer}>*/}
                <CardSection style={cardeSectionStyle}>
                    <Text style={textStyle}>Device id:</Text>
                    <Text style={textStyle}>{this.props.device.id}</Text>
                </CardSection>

                <CardSection style={cardeSectionStyle}>
                <Text style={textStyle}>Device name:</Text>
                <Button onPress={() => this.setState({ nameModal: !this.state.nameModal })}>
                        {this.props.device.name}
                    </Button>
                </CardSection>
                <CardSection style={cardeSectionStyle}>
                    <Text style={textStyle}>Device creator:</Text>
                    <Text style={textStyle}>{author}</Text>
                </CardSection>
                <CardSection style={cardeSectionStyle}>
                    <Text style={textStyle}>Device updater:</Text>
                    <Text style={textStyle}>{updater}</Text>
                </CardSection>
                <CardSection style={cardeSectionStyle}>
                    <Button onPress={() => this.setState({ showModal: !this.state.showModal })}>
                        Delete Device
                    </Button>
                </CardSection>
                
                <Modal
                    visible={this.state.nameModal}
                    transparent
                    animationType="slide" // slide up from bottom of screen
                    onRequestClose={() => {}}
                >
                    <View style={containerStyle}>
                        <CardSection style={cardeSectionStyle}>
                        <Input
                            lable=""
                            placeholder={this.props.device.name}
                            value={this.props.name}
                            onChangeText={text =>
                                this.props.deviceUpdate({ prop: 'name', value: text })}
                        />
                        </CardSection>
                        <CardSection 
                            style={{ 
                                backgroundColor: '#32999b',
                                borderWidth: 2,
                                borderRadius: 2,
                                borderColor: '#fff' }}
                        >
                            <Button onPress={this.onAcceptName.bind(this)}> Save </Button>
                            <Button onPress={this.onDeclineName.bind(this)}> Back </Button>
                        </CardSection>
                     </View>
                </Modal>

                <Modal
                    visible={this.state.showModal}
                    transparent
                    animationType="slide" // slide up from bottom of screen
                    onRequestClose={() => {}}
                >
                    <View style={containerStyle}>
                        <CardSection style={cardeSectionStyle}>
                        <Text style={textStyle}> 
                            Are you sure you want to delete this device
                        </Text>
                        </CardSection>
                        <CardSection 
                            style={{ 
                                backgroundColor: '#32999b',
                                borderWidth: 2,
                                borderRadius: 2,
                                borderColor: '#fff' }}
                        >
                            <Button onPress={this.onAccept.bind(this)}> Yes </Button>
                            <Button onPress={this.onDecline.bind(this)}> No </Button>
                        </CardSection>
                     </View>
                </Modal>

            </ImageBackground>
        );
    }
}
const styles = {
    cardeSectionStyle: {
        borderBottomWidth: 1,
        padding: 10,
        paddingTop: 10,
        backgroundColor: '#32999b',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#fff',
        position: 'relative'
    },
    textStyle: { 
        flex: 1,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 20,
        lineHeight: 40
    },
    containerStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        position: 'relative',
        flex: 1,
        justifyContent: 'center'
    },
    ViewContainer: {
        flex: 1,
        backgroundColor: '#6fb7b9',
        borderWidth: 2,
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
    console.log('edit map', state);
    const { name, id, deviceStatus, password } = state;
    const { token, username } = state.auth;
    return { 
        token,
        name,
        id, 
        deviceStatus,
        username,
        password, 
        house: state.activeHouse.activeHouse,
        newName: state.deviceCreate.name, 
    };
};

export default connect(mapStateToProps, { 
    deviceUpdate, 
    editeDeviceName, 
    deleteDevice,
    deleteDeviceAdmin
})(DeviceEdit);
