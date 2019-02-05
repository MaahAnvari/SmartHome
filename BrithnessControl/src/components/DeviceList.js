import React, { Component } from 'react';
import { FlatList, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import { devicesFetch, updateLocation } from '../actions';
import ListItem from './ListItem';

class DeviceList extends Component { 
    componentWillMount() {
        const { token, house } = this.props;
        this.props.devicesFetch({ token, house });
        navigator.geolocation.clearWatch(this.watchID);
    }

    componentDidMount = () => {
        navigator.geolocation.getCurrentPosition(
           (position) => {
              const initialPosition = position;
              this.props.updateLocation({ 
                token: this.props.token, 
                username: this.props.username, 
                location: initialPosition.coords
            });
           },
           (error) => console.log(error.message),
           { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        this.watchID = navigator.geolocation.watchPosition((position) => {
           const lastPosition = position;
            this.props.updateLocation({ 
                token: this.props.token, 
                username: this.props.username, 
                location: lastPosition.coords
            });
        });
     }
     watchID: ?number = null;

    render() {
        return (
            <ScrollView style={styles.backgroundImage}> 
                <Text style={{ backgroundColor: '#fff', paddingLeft: 10, borderColor: '#fff', borderWidth: 2, padding: 5, flex: 1, alignSelf: 'center', color: '#008080', fontSize: 25, fontWeight: 'bold', fontStyle: 'italic' }}>{this.props.house.name}</Text>
                <FlatList
                    data={this.props.devices}
                    keyExtractor={item => item.id}               
                    renderItem={({ item }) => (
                        <ListItem 
                            device={item} 
                        />
                    )}
                />
            </ScrollView>
        );
    }
}  

const styles = {
    backgroundImage: {
        backgroundColor: '#008080'
    }
};


const mapStateToProps = (state) => {
    const { token, username, location } = state.auth;
    let devices = [];
    if (state.devices.devices !== undefined) {
        devices = Object.values(state.devices.devices);     
    }
    return { token, devices, username, location, house: state.activeHouse.activeHouse };
};
export default connect(mapStateToProps, { devicesFetch, updateLocation })(DeviceList);
