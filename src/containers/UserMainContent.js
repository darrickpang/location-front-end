import React from 'react';
import {  withRouter, BrowserRouter as Router, Route } from 'react-router-dom';
import { Button } from 'reactstrap';
import { MapContainer } from './MapContainer';
import Location  from '../components/Location'
import Locator from '../components/Locator'

class UserMainContent extends React.Component {
    state = {
        receiver: [],
        friends: [],
        pending: []
    }

    renderUserInfo = () => {
        return (
            <div className="user-info">
                <h3>User name: {this.props.user.name}</h3>
            </div>
        )
    }

    renderLogout = () => {
        return (
            <Button className="button" onClick={() => {
                localStorage.clear()
                this.props.history.push('/')
                }}>Log Out
            </Button>
        )
    }

    renderNames = () => {
        let receiver = []
        for(let x = 0; x < this.props.friend_requests_as_receiver.length; x++){
            this.state.receiver.push(this.props.friend_requests_as_receiver[x].requestor_name)
        }
        for(let x = 0; x < this.props.friend_requests_as_requestor.length; x++){
            this.state.receiver.push(this.props.friend_requests_as_requestor[x].receiver_name)
        }
        let arr = [...receiver, this.props.user.name]
        let names = this.props.user_names.filter(name => !arr.includes(name.name))

        return names.map(name => {
            return(
                <div>
                    {name.name}
                    <button className="button" onClick={(e) => this.props.postFriendRequests(e, this.props.user, name)}>add friend</button>
                </div>
            ) 
        })
    }

    renderFriendRequests = () => {
        let friends = []
        let pending = []

        for(let x = 0; x < this.props.friend_requests_as_receiver.length; x++){
            if(this.props.friend_requests_as_receiver[x].status === 'accepted'){
                this.state.friends.push(this.props.friend_requests_as_receiver[x].requestor_name)
            }   
            else{
                this.state.pending.push(this.props.friend_requests_as_receiver[x].requestor_name)
            }
        }

        for(let x = 0; x < this.props.friend_requests_as_requestor.length; x++){
            if(this.props.friend_requests_as_requestor[x].status === 'accepted'){
                friends.push(this.props.friend_requests_as_requestor[x].receiver_name)
            }
            else{
                pending.push(this.props.friend_requests_as_requestor[x].receiver_name)
            }
        }

        return this.props.friend_requests_as_receiver.map(name => {
            if(name.status === 'pending'){
                return(
                    <div>
                        {name.requestor_name}
                        <button className="button" onClick={(e) => this.props.handleAccept(e, name.id)}>Accept</button>
                    </div>
                )
            }
        })
    }

    renderFriends = () => {
        let friends = []

        for(let x = 0; x < this.props.friend_requests_as_receiver.length; x++){
            if(this.props.friend_requests_as_receiver[x].status === 'accepted'){
                friends.push(this.props.friend_requests_as_receiver[x].requestor_name)
            }   
        }

        for(let x = 0; x < this.props.friend_requests_as_requestor.length; x++){
            if(this.props.friend_requests_as_requestor[x].status === 'accepted'){
                friends.push(this.props.friend_requests_as_requestor[x].receiver_name)
            }
        }
        return friends.map(name => {
            return(
                <div>
                    {name}
                </div>
            )
        })
    }

    renderMap = () => {
        return(
            <div>
                <MapContainer />
            </div>
        )
    }

    renderLocation = () => {
        return(
            <div>
                Location.js
                <Location />
            </div>
        )
    }

    renderLocator = () => {
        return(
            <div>
                <Locator />
            </div>
        )
    }

    render(){
        return(
            <div className="main-page">
                Welcome to your main page. 
                {this.renderUserInfo()}
                {this.renderLogout()}               
                Friend suggestions:
                {this.renderNames()}
                Waiting: 
                {this.renderFriendRequests()}
                Friends:    
                {this.renderFriends()}
                {this.renderLocation()}
                {this.renderLocator()}
                {this.renderMap()}
            </div> 
        )
    }
}

export default withRouter(UserMainContent)