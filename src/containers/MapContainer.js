import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Pusher from 'pusher-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CurrentLocation from '../components/Map';

// https://www.digitalocean.com/community/tutorials/how-to-integrate-the-google-maps-api-into-react-applications
const mapStyles = {
    width: '100%',
    height: '100%'
};

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        center: { lat: 5.6219868, lng: -0.23223 },
        locations: {},
        users_online: [],
        current_user: ''
    };

    componentDidMount() {
        let pusher = new Pusher('PUSHER_APP_KEY', {
            authEndpoint: "http://localhost:3128/pusher/auth",
            cluster: "mt1"
        })
        this.presenceChannel = pusher.subscribe('presence-channel');

        this.presenceChannel.bind('pusher:subscription_succeeded', members => {
            this.setState({
                users_online: members.members,
                current_user: members.myID
            });
            this.getLocation();
            this.notify();
        })

        this.presenceChannel.bind('location-update', body => {
            this.setState((prevState, props) => {
                const newState = { ...prevState }
                newState.locations[`${body.username}`] = body.location;
                return newState;
            });
        });

        this.presenceChannel.bind('pusher:member_removed', member => {
            this.setState((prevState, props) => {
                const newState = { ...prevState };
                // remove member location once they go offline
                delete newState.locations[`${member.id}`];
                // delete member from the list of online users
                delete newState.users_online[`${member.id}`];
                return newState;
          })
          this.notify()
        })

        this.presenceChannel.bind('pusher:member_added', member => {
            this.notify();
        })
    }

    notify = () => toast(`Users online : ${Object.keys(this.state.users_online).length}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: 'info'
    });

    getLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.watchPosition(position => {
                let location = { lat: position.coords.latitude, lng: position.coords.longitude };
                this.setState((prevState, props) => {
                    let newState = { ...prevState };
                    newState.center = location;
                    newState.locations[`${prevState.current_user}`] = location;
                    return newState;
                });
                axios.post("http://localhost:3128/update-location", {
                    username: this.state.current_user,
                    location: location
                }).then(res => {
                    if (res.status === 200) {
                        console.log("new location updated successfully");
                    }
                });
            })
        } 
        else {
            alert("Sorry, geolocation is not available on your device. You need that to use this app");
        }
    }
    
    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onClose = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    render() {
        return (
            <CurrentLocation
                centerAroundCurrentLocation
                google={this.props.google}
            >
                <Marker onClick={this.onMarkerClick} name={'Current Location'} />
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                >
                    <div>
                        <h4>{this.state.selectedPlace.name}</h4>
                    </div>
                </InfoWindow>
            </CurrentLocation>
        );
    }
}
  
MapContainer = GoogleApiWrapper({
    apiKey: '123' //`${process.env.REACT_APP_YOUR_API_KEY_NAME}`
})(MapContainer);

const rootElement = document.getElementById("root");
ReactDOM.render(<MapContainer />, rootElement);