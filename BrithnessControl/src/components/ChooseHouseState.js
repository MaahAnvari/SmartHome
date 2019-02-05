import React, { Component } from 'react';
import { View, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { CardSection, Button } from './common';
import { createHouse } from '../actions';

const image = require('../../pictures/18.jpg');

class ChooseHouseState extends Component {
    
    onNewButtonPress() {
        Actions.createNewHouse();
    }

    onAddButtonPress() {
        Actions.AddHouse();
    }

    render() {
        return (
            <ImageBackground source={image} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }} >
            {/*<View style={styles.ViewContainer}>*/}
                <View>
                    <CardSection style={{ borderBottomWidth: 0, borderWidth: 0, borderColor: '#E5526A' }}>
                        <Button onPress={this.onNewButtonPress.bind(this)}>
                            Create new
                        </Button>
                    </CardSection>
                    <CardSection style={{ borderBottomWidth: 0, borderWidth: 0, borderColor: '#E5526A' }}>
                        <Button onPress={this.onAddButtonPress.bind(this)}>
                            Add house
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
        backgroundColor: '#E5526A',
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#E5526A', 
        borderBottomWidth: 0,
        shadowOffset: { width: 0, height: 10 },
        shadowColor: '#ffe4e1',
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
    }
};
    
const mapStateToProps = (state) => {
    const { name, id, password } = state.houseCreate;
    const { token, username } = state.auth;
    return { token, name, id, password, username };
};

export default connect(mapStateToProps, 
    { createHouse }
)(ChooseHouseState);
