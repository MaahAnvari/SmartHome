import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { CardSection, Input, Button } from './common';
import { houseUpdate, createHouse, } from '../actions';


class CreateHouse extends Component {
    
    
    onButtonPress() {
        const { token, name, id, password, username, location } = this.props;
        console.log(location);
        this.props.createHouse({ token, name, id, password, username, location });
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
                        lable="House ID"
                        placeholder="house id"
                        value={this.props.id}
                        onChangeText={text =>
                            this.props.houseUpdate({ prop: 'id', value: text })}
                    />
                </CardSection>

                <CardSection>
                    <Input
                        lable="Name"
                        placeholder="House name"
                        value={this.props.name}
                        onChangeText={text =>
                            this.props.houseUpdate({ prop: 'name', value: text })}
                    />
                </CardSection>

                <CardSection>
                    <Input
                        secureTextEntry
                        lable="Password"
                        placeholder="House password"
                        value={this.props.password}
                        onChangeText={text =>
                             this.props.houseUpdate({ prop: 'password', value: text })}
                    />
                </CardSection>
                {this.renderError()}
                <CardSection style={{ borderBottomWidth: 0, borderWidth: 0 }}>
                    <Button onPress={this.onButtonPress.bind(this)}>
                        Create
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
        backgroundColor: '#de8567',
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#c76354', 
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
    //console.log('map state create', state);
    const { name, id, password, error } = state.houseCreate;
    const { token, username, user } = state.auth;
    return { token, name, id, password, username, location: user.location, error };
};

export default connect(mapStateToProps, 
    { houseUpdate, createHouse }
)(CreateHouse);
