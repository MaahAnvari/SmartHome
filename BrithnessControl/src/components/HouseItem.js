import React, { Component } from 'react';
import { Text, TouchableOpacity, Modal, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';
import { CardSection, Card, Input, Button } from './common';
import { setActiveHouse, deleteHouse, editeHouseName, houseUpdate } from '../actions';
import subscribe from './subscribe';
import subscribe2 from './subscribe2'; //geolocation

class HouseItem extends Component {
    state = { showModal: false };

    onPress() {
        subscribe({ 
            token: this.props.token, 
            house: this.props.house.id, 
            username: this.props.username 
        });
        this.props.setActiveHouse({ house: this.props.house });
        Actions.deviceList({ username: this.props.username, house: this.props.house.id });
    }

    onAccept() {
        const { token, house, newName, username } = this.props;
        const { id } = this.props.house;
        this.props.editeHouseName({ token, house, username, newName, id });
    }

    onDecline() {
        this.setState({ showModal: false });
    }

    render() {
        const { TextStyle, buttonStyle } = styles;
        subscribe2({ 
            token: this.props.token, 
            house: this.props.house, 
        });
        return (
            <Card style={{ borderRadius: 15 }}>
                <Swipeout
                left={[
                    {
                      text: 'edit',
                      onPress: () => this.setState({ showModal: !this.state.showModal }),
                      backgroundColor: 'orange',
                      fontSize: 16,
                      color: 'white',
                      className: 'custom-class-1'
                    }
                  ]}
                  right={[
                    {
                      text: 'delete',
                      onPress: () => 
                        this.props.deleteHouse({ 
                            token: this.props.token, 
                            house: this.props.house,
                            username: this.props.username
                        }),
                      backgroundColor: '#bf0c51',
                      color: 'white',
                      className: 'custom-class-2'
                    }
                  ]}
                  onOpen={() => console.log('open')}
                  onClose={() => console.log('close')}
                >
                    <CardSection style={styles.cardeSectionStyle}> 
                        <TouchableOpacity onPress={this.onPress.bind(this)} style={buttonStyle}>
                            <Text style={TextStyle} >
                                {this.props.house.name}
                            </Text>
                     </TouchableOpacity>
                    </CardSection>
                </Swipeout>

                <Modal
                    visible={this.state.showModal}
                    transparent
                    animationType="slide" // slide up from bottom of screen
                    onRequestClose={() => {}}
                >
                    <View style={styles.containerStyle}>
                        <CardSection style={styles.cardeSectionStyle}>
                        <Input
                            lable=""
                            placeholder={this.props.house.name}
                            value={this.props.name}
                            onChangeText={text =>
                                this.props.houseUpdate({ prop: 'name', value: text })}
                        />
                        </CardSection>
                        <CardSection 
                            style={{ 
                                backgroundColor: '#32999b',
                                borderWidth: 2,
                                borderRadius: 2,
                                borderColor: '#fff' }}
                        >
                            <Button onPress={this.onAccept.bind(this)}> Save </Button>
                            <Button onPress={this.onDecline.bind(this)}> Back </Button>
                        </CardSection>
                     </View>
                </Modal>
            </Card>
        );
    }
}

const styles = {
    TextStyle: {
        alignSelf: 'center',
        color: '#264226',
        fontSize: 20,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    },
    buttonStyle: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: '#cdede7',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#cdede7',
        marginLeft: 5,
        marginRight: 5,
        padding: 5
    },
    cardeSectionStyle: {
        borderBottomWidth: 2,
        padding: 15,
        backgroundColor: '#008080',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#008080',
        position: 'relative'
    },
    containerStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        position: 'relative',
        flex: 1,
        justifyContent: 'center'
    }
};

const mapStateToProps = (state) => {
    const { token, username } = state.auth;
    return { username, token, newName: state.houseCreate.name, };
};

export default connect(mapStateToProps, { 
    setActiveHouse, 
    deleteHouse, 
    editeHouseName, 
    houseUpdate 
})(HouseItem);
