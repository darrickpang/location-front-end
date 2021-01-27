/*global google*/
import React from "react"
import { compose, withProps, withHandlers, withState } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
// https://stackoverflow.com/questions/47114169/how-to-use-react-with-google-places-api-to-display-place-markers-on-a-google-ma
// ${process.env.REACT_APP_YOUR_API_KEY_NAME}

const MyMapComponent = compose(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_YOUR_API_KEY_NAME}&libraries=places`,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `500px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap,
    withState('places', 'updatePlaces', ''),
    withHandlers(() => {
        const refs = {
            map: undefined,
        }
        return {
            onMapMounted: () => ref => {
                refs.map = ref
            },
            fetchPlaces: ({ updatePlaces }) => {
                const bounds = refs.map.getBounds();
                const service = new google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
                const request = {
                    bounds: bounds,
                    type: ['gym']
                };
                service.nearbySearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        updatePlaces(results);
                    }
                })
            }
        }
    }),
)

((props) => {
    return (
        <div>
            <div>
                <GoogleMap
                    onTilesLoaded={props.fetchPlaces}
                    ref={props.onMapMounted}
                    onBoundsChanged={props.fetchPlaces}
                    defaultZoom={8}
                    defaultCenter={{ lat: props.currentLocation.lat, lng: props.currentLocation.lng }} // now this works
                >
                {props.places && props.places.map((place, i) =>
                    <Marker key={i} position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }} />
                )}
                </GoogleMap> 
            </div>
            <div id="locations">
                {props.places && props.places.map((place, i) =>
                    <div>
                        {place.name}, {place.vicinity}
                    </div>
                )}
            </div>
        </div>
    )
})
export default MyMapComponent