import React from 'react';
import Subscribe from './components/subscribe';
import LoginForm from './components/LoginForm'
import './App.css';

class App extends React.Component {
   
  constructor(props) {
    super(props)
    // the initial application state
    this.state = {
      user: null,
      error: ''
    }
  }
    // App "actions" (functions that modify state)
  signIn(username, password, error) {
    this.setState({
      user: {
        username,
        password,
      },
      error
    })
  }
  
  signOut() {
      // clear out user from state
    this.setState({user: null, error: ''})
  }
    
  render() {
    return (
      <div className= 'App'>
        <h1>Brightness Control</h1>
        <h2>{this.state.error}</h2>
        { 
          (this.state.user) ? 
            <Welcome 
              user={this.state.user} 
              onSignOut={this.signOut.bind(this)} 
            />
          :
            <LoginForm 
              onSignIn={this.signIn.bind(this)} 
            />
        }
      </div>
    )
      
  }
}

const Welcome = ({user, onSignOut})=> {
  // This is a dumb "stateless" component
  return (
    <div className= 'Mainpage'>
      <h2>Device ID: {user.username}</h2>
      <a href="javascript:;" onClick={onSignOut}>Sign out</a>
      <Subscribe device={user.username} /> 
    </div>
  )
}
export default App; 