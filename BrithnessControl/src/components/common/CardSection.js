import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
    return (
        <View style={[styles.ViewContainer, props.style]}>
            {props.children}
        </View>
    );
};

const styles = {
    ViewContainer: {
        borderBottomWidth: 5,
        padding: 10,
        backgroundColor: '#934c93a',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#fff',
        borderWidth: 5,
        position: 'relative'

    }
};

export { CardSection };
