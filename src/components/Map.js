import React from 'react';
import MyMapComponent from './GooglePlaces'
// https://www.digitalocean.com/community/tutorials/how-to-integrate-the-google-maps-api-into-react-applications

const mapStyles = {
    map: {
        position: 'absolute',
        width: '50%',
        height: '50%'
    }
};

export class CurrentLocation extends React.Component {
    constructor(props) {
        super(props);
        const { lat, lng } = this.props.initialCenter;
        this.state = {
            currentLocation: {
                lat: lat,
                lng: lng
            }
        };
    }
  
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
            this.loadMap();
        }
        if (prevState.currentLocation !== this.state.currentLocation) {
            this.recenterMap();
        }
    }

    recenterMap() {
        const map = this.map;
        const current = this.state.currentLocation;
        const google = this.props.google;
        const maps = google.maps;
    
        if (map) {
            let center = new maps.LatLng(current.lat, current.lng);
            map.panTo(center);
        }
    }

    componentDidMount() {
        if (this.props.centerAroundCurrentLocation) {
          if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
              const coords = pos.coords;
              this.setState({
                currentLocation: {
                  lat: coords.latitude,
                  lng: coords.longitude
                }
              });
            });
          }
        }
        this.loadMap();<^>
      }

    render() {
        const style = Object.assign({}, mapStyles.map);
        return (
            <div id="map">
                <div style={style} ref="map">
                    Loading map...
                </div>
                <MyMapComponent currentLocation={this.state.currentLocation}/>
                {this.renderChildren()}
            </div>
        );
    }
}

export default CurrentLocation;

CurrentLocation.defaultProps = {
    zoom: 14,
    initialCenter: {
        lat: 37.43247,
        lng: 121.8676
    },
    centerAroundCurrentLocation: false,
    visible: true
};