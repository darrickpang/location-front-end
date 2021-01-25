import React from 'react';
import './App.css';
import Welcome from './containers/Welcome';
import UserLoginSignUp from './components/UserLoginSignUp';
// import UserMainContent from './containers/UserMainContent';
import { Switch, Route, withRouter} from 'react-router-dom';

class App extends React.Component {
  state = {
    user: {
      id: null,
      name: "",
    },
    token: ""
  }

  componentDidMount(){
    if(localStorage.token){  
      fetch('http://localhost:3000/user_persist',{
      headers: {
        "Authorization": `Bearer ${localStorage.token}`
      }
      })
      .then(res => res.json())
      .then(json => this.userAuthResponse(json))
    }
  }

  userAuthResponse = (json) => {
    if (json.user){
      localStorage.token = json.token
      this.setState({
        user: {
          id: json.user.data.attributes.id,
          name: json.user.data.attributes.name,
        },
        token: json.token
      }, () => this.props.history.push('/user_main'))
    }
  }

  userLogin = ({name, password}) => {
    let user = {
      name: name,
      password: password
    }

    fetch('http://localhost:3000/user_login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(json => {
      if (!json.error){
        this.userAuthResponse(json)
      } else {
        alert(json.error)
      }
    })
  }

  userSignUp = ({name, password}) => {
    let newUser = {
      name: name,
      password: password,
    }
    
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })
    .then(res => res.json())
    .then(json => {
      if (!json.error) {
        this.userAuthResponse(json)
      } else {
        alert(json.error)
      }
    })
  }

  renderUserLogin = () => {
    return <UserLoginSignUp login={true} userLogin={this.userLogin}/>
  }

  renderUserSignUp = () => {
    return <UserLoginSignUp login={false} userSignUp={this.userSignUp}/>
  }

  renderUserMainContent = () => {
    return <UserMainContent user ={this.state.user} token={this.state.token} />
  }

  render(){
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact component={Welcome}/>
          <Route path="/user_login" render={this.renderUserLogin}/>
          <Route path="/user_signup" render={this.renderUserSignUp}/>
          <Route path="/user_main" render={this.renderUserMainContent}/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);