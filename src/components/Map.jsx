import React, { Component } from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';

class Map extends Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    state = {
        startPoint: {
            long: 0,
            lat: 0,
            desc: "",
        },
        endPoint: {
            long: 0,
            lat: 0,
            desc: "",
        }
    };

    handleSubmit(event) {
        event.preventDefault();
        
        this.setState({
            startPoint: {
                long: event.target[0].value,
                lat: event.target[1].value,
            }
        });
      }

    render() {
        return (
            <React.Fragment>

            <LeafletMap
                center={[this.state.startPoint.long, this.state.startPoint.lat]}
                zoom={3}
                attributionControl={true}
                zoomControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
                >

                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />

                <Marker position={[this.state.startPoint.long, this.state.startPoint.lat]}>
                <Popup>
                    {this.state.startPoint.desc}
                </Popup>
                </Marker>
            </LeafletMap>

            <div class="startMenu">
            <h3>Choose location</h3>
                <form onSubmit={this.handleSubmit}>
                    <label for="long">Longitude</label>
                    <input type="number" id="long" name="long"/>

                    <label for="lat">Latitude </label>
                    <input type="number" id="lat" name="lat"/>

                    <input type="submit" value="Search"></input>
                </form>
            </div>

            </React.Fragment>
        );
    };
}

export default Map;