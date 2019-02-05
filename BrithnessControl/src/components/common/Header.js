import React from 'react';
import { Text, View } from 'react-native';

const Header = (props) => { 
    const { textStyle, viewStyle } = styles;
    return (
    <View style={viewStyle}>
        <Text style={textStyle} >{props.HeaderText}</Text>
    </View>
    );
};

const styles = {
    viewStyle: {
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        paddingTop: 15,
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 5,
        position: 'relative'
    },
    textStyle: {
        fontSize: 20
    }
};

export { Header };
