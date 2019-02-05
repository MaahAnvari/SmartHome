import React, { Component } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { houseFetch, updateLocation } from '../actions';
import HouseItem from './HouseItem';


class HouseList extends Component { 
          
    componentWillMount() {
        navigator.geolocation.clearWatch(this.watchID);
        this.props.houseFetch({ token: this.props.token, username: this.props.username });
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
                <FlatList
                    data={this.props.houses}
                    keyExtractor={item => item.name}               
                    renderItem={({ item }) => (
                        <HouseItem 
                            house={item} 
                        />
                    )}
                />
            </ScrollView>
        );
    }
}  

const styles = {
    backgroundImage: {
        backgroundColor: '#ffd2c4'
    }
};


const mapStateToProps = (state) => {
    console.log('map state  ', state);
    const { token, username, location } = state.auth;
    let houses = [];
    if (state.houses.houses !== undefined) {
        houses = Object.values(state.houses.houses);     
    }
    return { token, houses, username, location };
};
export default connect(mapStateToProps, { houseFetch, updateLocation })(HouseList);
