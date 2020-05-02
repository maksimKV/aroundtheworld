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
        antipode: {
            long: 0,
            lat: 0,
            desc: "",
        }
    };

    handleSubmit(event) {
        event.preventDefault();

        let selectedLong = Number(event.target[0].value);
        let selectedLat = Number(event.target[1].value);

        let antipodeLong = selectedLong;

        if(selectedLong > 0)
        {
            antipodeLong = antipodeLong - 180;
        }
        else
        {
            antipodeLong = antipodeLong + 180;
        }
        
        this.setState({
            startPoint: {
                long: selectedLong,
                lat: selectedLat,
            }
        });

        this.setState({
            antipode: {
                long: antipodeLong,
                lat: (selectedLat * -1)
            }
        });
      }

    render() {
        return (
            <React.Fragment>

            <LeafletMap
                center={[this.state.startPoint.lat, this.state.startPoint.long]}
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

                <Marker position={[this.state.startPoint.lat, this.state.startPoint.long]}>
                <Popup>
                    {this.state.startPoint.desc}
                </Popup>
                </Marker>

                <Marker position={[this.state.antipode.lat, this.state.antipode.long]}>
                <Popup>
                    {this.state.antipode.desc}
                </Popup>
                </Marker>
            </LeafletMap>

            <div className="startMenu">
            <h3>Choose location</h3>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="long">Longitude</label>
                    <input type="number" id="long" name="long" max="180" min="-180"/>

                    <label htmlFor="lat">Latitude </label>
                    <input type="number" id="lat" name="lat" max="90" min="-90"/>

                    <input type="submit" value="Search"></input>
                </form>
            </div>

            </React.Fragment>
        );
    };
}

export default Map;