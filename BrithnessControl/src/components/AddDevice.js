import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { CardSection, Input, Button } from './common';
import { deviceUpdate, addDevice } from '../actions';


class AddDevice extends Component {  
    onButtonPress() {
        const { token, house, id, password, username } = this.props;

        this.props.addDevice({ token, id, password, username, house });
    }

    renderError() {
        if (this.props.error) {
            return (
                <View style={{ backgroundColor: 'white' }}>
                    <Text style={styles.errorTextStyle} >
                        {this.props.id}{this.props.error}
                    </Text>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={styles.ViewContainer}>
                 <CardSection style={{ paddingTop: 20 }}>
                    <Input
                        lable="Device ID"
                        placeholder="node#"
                        value={this.props.id}
                        onChangeText={text =>
                            this.props.deviceUpdate({ prop: 'id', value: text })}
                    />
                </CardSection>

                 <CardSection >
                    <Input
                        secureTextEntry
                        lable="Password"
                        placeholder="device password"
                        value={this.props.password}
                        onChangeText={text =>
                             this.props.deviceUpdate({ prop: 'password', value: text })}
                    />
                </CardSection>
                {this.renderError()}
                <CardSection style={{ borderBottomWidth: 0, borderWidth: 0 }}>
                    <Button onPress={this.onButtonPress.bind(this)}>
                        Add
                    </Button>
                </CardSection>
            </View>
        );
    }
}

const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    ViewContainer: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#57998d',
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#57998d', 
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
    const { name, id, password, deviceStatus, error } = state.deviceCreate;
    const { token, username } = state.auth;
    return { 
        house: state.activeHouse.activeHouse, 
        token, 
        name, 
        id, 
        password, 
        deviceStatus, 
        username, 
        error 
    };
};

export default connect(mapStateToProps, 
    { deviceUpdate, addDevice }
)(AddDevice);
