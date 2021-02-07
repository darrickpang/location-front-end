import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import CurrentLocation from '../components/Map';
// https://www.digitalocean.com/community/tutorials/how-to-integrate-the-google-maps-api-into-react-applications

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {}
    };
    
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
  
export default GoogleApiWrapper({
    apiKey: `${process.env.REACT_APP_YOUR_API_KEY_NAME}`
})(MapContainer);