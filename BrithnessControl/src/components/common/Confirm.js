import React from 'react';
import { Text, View, Modal } from 'react-native';
import { CardSection } from './CardSection';
import { Button } from './Button';

const Confirm = ({ children, visible, onAccept, onDecline }) => {
    const { containerStyle, textStyle, cardeSectionStyle } = styles;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide" // slide up from bottom of screen
            onRequestClose={() => {}}
        >
            <View style={containerStyle}>
                <CardSection style={cardeSectionStyle}>
                    <Text style={textStyle}>{children}</Text>
                </CardSection>

                <CardSection style={cardeSectionStyle}>
                    <Button onPress={onAccept}> Yes </Button>
                    <Button onPress={onDecline}> No </Button>
                </CardSection>
            </View>
        </Modal>
    );
};

const styles = {
    cardeSectionStyle: {
        borderBottomWidth: 2,
        padding: 10,
        backgroundColor: '#32999b',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#fff',
        position: 'relative'
    },
    textStyle: { 
        flex: 1,
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 40
    },
    containerStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        position: 'relative',
        flex: 1,
        justifyContent: 'center'
    }
};

export { Confirm };
