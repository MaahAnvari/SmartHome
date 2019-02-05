import React, { Component } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { setServer, usernameChanged, passwordChanged, loginUser, registerUser } from '../actions';
import { Card, CardSection, Input, Button, Spinner } from './common';

const image = require('../../pictures/b21.jpg');

class LoginForm extends Component {

    onUsernameChange(text) {
        this.props.usernameChanged(text); 
    }

    onPasswordChange(text) {
        this.props.passwordChanged(text);
    }

    onLoginButtonPress() {
        const { username, password } = this.props;
        this.props.loginUser({ username, password });
    }

    onRegisterButtonPress() {
        Actions.Register();
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

    renderLoginButton() {
        if (this.props.loading) {
            return <Spinner size="large" />;
        }
        return (
            <Button onPress={this.onLoginButtonPress.bind(this)}>
                Login
            </Button>
        );
    }

    render() {
        return (
            <ImageBackground source={image} style={styles.backgroundImage} >
            <Card style={{ flex: 2 }}>
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
                {this.renderError()}
            </Card>
            <View style={{ flex: 2, paddingRight: 1, paddingLeft: 300 }} >
            
                <CardSection style={{ backgroundColor: '#934c93a', borderBottomWidth: 0, borderWidth: 0 }} >
                    {this.renderLoginButton()} 
                </CardSection>
            </View>

            <View style={{ flex: 2, justifyContent: 'flex-end' }}>
                <CardSection style={{ backgroundColor: '#934c93a', borderBottomWidth: 0 }}>
                   <Button 
                     onPress={this.onRegisterButtonPress.bind(this)}
                     style={styles.button} 
                   >
                     Sign Up
                 </Button>
                </CardSection>
            </View>
            </ImageBackground>
        );
    }
}

const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
    },
    button: {
        alignSelf: 'stretch',
        backgroundColor: '#3e1c22',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
        marginLeft: 5,
        marginRight: 5
    }   
};


const mapStateToProps = (state) => {
    const { username, password, error, loading } = state.auth;
    return { username, password, error, loading };
};

export default connect(mapStateToProps, { 
    setServer, usernameChanged, passwordChanged, loginUser, registerUser
})(LoginForm);
