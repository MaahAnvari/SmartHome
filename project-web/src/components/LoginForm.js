import React from 'react';
import Kuzzle from 'kuzzle-sdk/dist/kuzzle';
import '../style/LoginForm.css'

const kuzzle = new Kuzzle('192.168.1.110', {}); 

class LoginForm extends React.Component {
    state = {
        user: null,
        error: ''
    }

    handleSignIn(e) {
      console.log(e);
      e.preventDefault();
      let username = this.refs.id.value;
      let password = this.refs.password.value;
      kuzzle.login('local', { username, password }, '1h', (err, res) => {
        if (err) {
            this.setState({user: null, error: 'wrong id or password'})
            console.log('login fail', err);
            console.log(this.state);
        } else if (res) {
            this.setState({error: ''})
          this.props.onSignIn(username, password,this.state.error)
        }
      });

    }
    
    render() {
      return (
        <form onSubmit={this.handleSignIn.bind(this)}>
          <h2 className= 'signIn'>Please Sign in </h2>
          <h3 className= 'error' >{this.state.error} </h3>
          <div >
            <input className= 'input' type="text" ref="id" placeholder="Enter device ID" />
          </div>
          <div>
            <input className= 'input' type="password" ref="password" placeholder="Enter device password" />
          </div>
          <input className= 'buttom' type="submit" value="Login" />
        </form>
      )
    }
  
  }

  export default LoginForm;