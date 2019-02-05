import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, CardSection, Input, Card } from './common';
import { checkUser } from '../actions';

class ConfirmWithInputs extends Component {
    render() {
        return (
                <Card>
                    <CardSection>
                        <Input
                            lable="Username"
                            placeholder="your username"
                            value={this.props.username}
                            onChangeText={text =>
                                this.props.checkUser({ prop: 'username', value: text })}
                        />
                    </CardSection>

                    <CardSection>
                        <Button onPress={this.props.checkUser(this.props.username)}> 
                            Confirm
                        </Button>
                    </CardSection>
                </Card>
        );
    }
}

export default connect(null, { checkUser })(ConfirmWithInputs);
