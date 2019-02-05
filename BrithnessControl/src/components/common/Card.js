import React from 'react';
import { View } from 'react-native';

const Card = (props) => {
    return (
        <View style={styles.ViewContainer}>
        {props.children}
        </View>
    );
};

const styles = {
    ViewContainer: {
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#fff', 
        borderBottomWidth: 0,
        shadowOffset: { width: 0, height: 10 },
        shadowColor: '#934c93a',
        shadowOpacity: 0.9,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
    }     
};

export { Card };
