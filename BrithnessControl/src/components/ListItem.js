import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import SwitchToggle from 'react-native-switch-toggle';
import { CardSection } from './common';
import { deviceStatusUpdate } from '../actions';

class ListItem extends Component {
    onRowPress() {
        // console.log('edit', this.props.device);
        Actions.editDevice({ type: 'reset', device: this.props.device });
    }

    onPress1 = () => {
        // console.log('c1', this.props.device.deviceStatus.c1);
        this.props.deviceStatusUpdate(
            { token: this.props.token,
              name: this.props.device.id, 
              deviceStatus: !this.props.device.deviceStatus.c1,
              channel: 'c1'
            });
    }
    onPress2 = () => {
        // console.log('c2', this.props.device.deviceStatus.c2);
        this.props.deviceStatusUpdate(
            { token: this.props.token,
              name: this.props.device.id, 
              deviceStatus: !this.props.device.deviceStatus.c2,
              channel: 'c2' 
            });
    }
    onPress3 = () => {
        // console.log('c3', this.props.device.deviceStatus.c3);
        this.props.deviceStatusUpdate(
            { token: this.props.token,
              name: this.props.device.id, 
              deviceStatus: !this.props.device.deviceStatus.c3,
              channel: 'c3'
            });
    }

    render() {
        const { name } = this.props.device;
        //console.log('list item ', this.props.device);
        return (
            <View >
                <TouchableWithoutFeedback onPress={this.onRowPress.bind(this)}>
                    <View>
                        <CardSection style={styles.containerStyle}>
                            <Text style={styles.titleStyle}>
                                {name}
                            </Text>
                            <SwitchToggle
                                circleColorOn='#45ddc0'
                                switchOn={this.props.device.deviceStatus.c1}
                                onPress={this.onPress1}
                            />
                            <SwitchToggle
                                circleColorOn='#3ec6ac'
                                switchOn={this.props.device.deviceStatus.c2}
                                onPress={this.onPress2}
                            />
                            <SwitchToggle
                                circleColorOn='#37b099'
                                switchOn={this.props.device.deviceStatus.c3}
                                onPress={this.onPress3}
                            />
                        </CardSection>
                        
                    </View>
                </TouchableWithoutFeedback>
                
            </View>
        );
    }
}

const styles = {
    titleStyle: {
        fontFamily: 'Roboto',
        fontSize: 30,
        fontWeight: 'bold',
        color: '#00595b',
        paddingLeft: 15,
    },
    containerStyle: { 
        justifyContent: 'space-between', 
        borderWidth: 3,
        borderRadius: 15,
        borderColor: '#7ce7d2',  
        borderBottomWidth: 2,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: '#7ce7d2',
        shadowOpacity: 15,
        shadowRadius: 10,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        padding: 25,
        backgroundColor: '#ecfbf8'
    }
};

const mapStateToProps = (state) => {
    const { name, id, password, deviceStatus } = state.deviceCreate;
    const { token, username } = state.auth;
    return { token, name, id, password, deviceStatus, username, devices: state.devices.devices };
};

export default connect(mapStateToProps, 
    { deviceStatusUpdate }
)(ListItem);
