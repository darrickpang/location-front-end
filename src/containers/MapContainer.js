import React, { Component } from 'react';
import { GoogleApiWrapper, Marker }  from 'google-maps-react';
import CurrentLocation from '../components/Map';
// https://www.digitalocean.com/community/tutorials/how-to-integrate-the-google-maps-api-into-react-applications

export class MapContainer extends Component {
    render() {
        return (
            <div id="current-location">
                <CurrentLocation
                    centerAroundCurrentLocation
                    google={this.props.google}
                >
                    <Marker onClick={this.onMarkerClick} name={'current location'} />
                </CurrentLocation>
            </div>
        );
    }
}
  
export default GoogleApiWrapper({
    // apiKey: process.env.REACT_APP_YOUR_API_KEY_NAME
})(MapContainer);