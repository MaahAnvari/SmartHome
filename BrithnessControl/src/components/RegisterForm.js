import React, { Component } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { 
    usernameChangedOnRegister,
    passwordChangedOnRegister, 
    confirmPasswordChanged, 
    registerUser 
} from '../actions';
import { Card, CardSection, Input, Button, Spinner } from './common';

const image = require('../../pictures/b21.jpg');

class RegisterForm extends Component {

    onUsernameChange(text) {
        this.props.usernameChangedOnRegister(text); 
    }

    onPasswordChange(text) {
        this.props.passwordChangedOnRegister(text);
    }

    onConfirmPasswordChange(text) {
        this.props.confirmPasswordChanged(text);
    }

    onRegisterButtonPress() {
        const { username, password, confirmPassword } = this.props;
        this.props.registerUser({ username, password, confirmPassword });
    }

    renderError() {
        if (this.props.error) {
            return (
                <View style={{ backgroundColor: 'white' }}>
                    <Text style={styles.errorTextStyle} >
                        {this.props.error}
                    </Text>
                </View>
            );
        }
    }

    renderRegisterButton() {
        if (this.props.loading) {
            return <Spinner size="large" />;
        }
        return (
            <Button onPress={this.onRegisterButtonPress.bind(this)} >
                Register
            </Button>
        );
    }

    render() {
        return (
            <ImageBackground source={image} style={styles.backgroundImage} >
            <Card>
                <CardSection style={{ backgroundColor: '#934c93a' }}>
                    <Input
                        lable="Username"
                        placeholder="username"
                        onChangeText={this.onUsernameChange.bind(this)}
                        value={this.props.username}
                    />
                </CardSection>
                
                <CardSection style={{ backgroundColor: '#934c93a' }}>
                    <Input
                        secureTextEntry
                        lable="Password"
                        placeholder="password"
                        onChangeText={this.onPasswordChange.bind(this)}
                        value={this.props.password}
                    />
                </CardSection>

                <CardSection style={{ backgroundColor: '#934c93a' }}>
                    <Input
                        secureTextEntry
                        lable="Repeat Password"
                        placeholder="password"
                        onChangeText={this.onConfirmPasswordChange.bind(this)}
                        value={this.props.confirmPassword}
                    />
                </CardSection>
                {this.renderError()}

                <CardSection style={{ paddingTop: 20, backgroundColor: '#934c93a', borderWidth: 0, borderBottomWidth: 0 }}>
                    {this.renderRegisterButton()}
                </CardSection>
            </Card>
            </ImageBackground>
            //</View>
        );
    }
}

const styles = {
    errorTextStyle: {
        fontSize: 30,
        alignSelf: 'center',
        color: 'red'
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    }
};


const mapStateToProps = (state) => {
    const { username, password, error, loading, confirmPassword } = state.register;

    return { username, password, error, loading, confirmPassword };
};

export default connect(mapStateToProps, { 
    usernameChangedOnRegister, passwordChangedOnRegister, confirmPasswordChanged, registerUser
})(RegisterForm);
