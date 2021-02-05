import React from 'react';
import './App.css';
import Welcome from './containers/Welcome';
import UserLoginSignUp from './components/UserLoginSignUp';
import UserMainContent from './containers/UserMainContent';
import { Switch, Route, withRouter} from 'react-router-dom';

class App extends React.Component {
  state = {
    user: {
      id: null,
      name: "",
    },
    user_names: [], 
    friend_requests: [],
    friend_requests_as_receiver: [],
    friend_requests_as_requestor: [],
    location: [], 
    locate_user: [], 
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

    //all user names 
    fetch('http://localhost:3000/locators')
    .then(res => res.json())
    .then(json => this.setState({location: json}))

    fetch('http://localhost:3000/locate_users')
    .then(res => res.json())
    .then(json => this.setState({user_names: json}))

    fetch('http://localhost:3000/users')
    .then(res => res.json())
    .then(json => this.setState({user_names: json}))
  }

  userAuthResponse = (json) => {
    if (json.user){
      localStorage.token = json.token
      this.setState({
        user: {
          id: json.user.data.attributes.id,
          name: json.user.data.attributes.name,
        },
        user_names: [], 
        friend_requests_as_receiver: json.user.data.attributes.friend_requests_as_receiver, 
        friend_requests_as_requestor: json.user.data.attributes.friend_requests_as_requestor, 
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

  // Friend requests
  postFriendRequests = (e, user, target) => {
    e.preventDefault()
    fetch(`http://localhost:3000/friend_requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        requestor_id: user.id,
        requestor_name: user.name,
        receiver_id: target.id,
        receiver_name: target.name, 
        status: 'pending'
      })
    })
    .then(r => r.json())
    .then(json => {
      this.setState({
        friend_requests: [...this.state.friend_requests, {
          requestor_id: user.id,
          requestor_name: user.name,
          receiver_id: target.id,
          receiver_name: target.name, 
          status: 'pending'
        }]
      })
    })
  }

  handleAccept = (e, target) => {
    e.preventDefault()
    fetch(`http://localhost:3000/friend_requests/${target}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        id: target,
        status: 'accepted'
      })
    })
  }

  handleDelete = (target) => {
    fetch(`http://localhost:3000/friend_requests/${target}`, {
      method: 'DELETE'
    })
  }

  renderUserLogin = () => {
    return <UserLoginSignUp login={true} userLogin={this.userLogin}/>
  }

  renderUserSignUp = () => {
    return <UserLoginSignUp login={false} userSignUp={this.userSignUp}/>
  }

  renderUserMainContent = () => {
    return <UserMainContent user ={this.state.user} token={this.state.token} postFriendRequests={this.postFriendRequests} 
            handleAccept={this.handleAccept} handleDelete={this.handleDelete} friend_requests_as_receiver={this.state.friend_requests_as_receiver}
            friend_requests_as_requestor={this.state.friend_requests_as_requestor} user_names={this.state.user_names}/>
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