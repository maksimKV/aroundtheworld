import React, { Component } from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';

class Map extends Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.searchForCity = this.searchForCity.bind(this);
        this.searchForClosestCity = this.searchForClosestCity.bind(this);
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
        },

        cities: [],
        error: null,

        closestCityToPoint: {
            long: 0,
            lat: 0,
            desc: "",
        },
        clossestCityToAntipode: {
            long: 0,
            lat: 0,
            desc: "",
        },
    };

    handleSubmit(event) {
        event.preventDefault();

        let selectedLong = event.target[0].value;
        let selectedLat = event.target[1].value;
        let selectedCity = event.target[2].value;

        let antipodeLong = selectedLong;

        if(selectedLat !== "" && selectedLong !== "" || selectedCity !== "")
        {
            let findCity = this.state.cities.find(c => c.display_name == selectedCity);
            let pointDesc = "";

            if(typeof(findCity) !== "undefined")
            {
                selectedLong = findCity.lon;
                selectedLat = findCity.lat;
                pointDesc = 'You have selected the city of "' + findCity.display_name +  '" which is at ' + selectedLong + ' longitude and at ' + selectedLat + ' Latitude';

                document.getElementById("long").value = findCity.lon;
                document.getElementById("lat").value = findCity.lat;
            }
            else {
                this.searchForClosestCity(selectedLong, selectedLat, "point");
            }

            if(selectedLong > 0)
            {
                antipodeLong = Number(selectedLong) - 180;
            }
            else
            {
                antipodeLong = Number(selectedLong) + 180;
            }
            
            this.setState({
                startPoint: {
                    long: selectedLong,
                    lat: selectedLat,
                    desc: ((pointDesc) ? pointDesc : "The point you have selected is at long: " + selectedLong + " | lat: " + selectedLat)
                }
            });

            let antipodeLat = (selectedLat * -1);

            this.setState({
                antipode: {
                    long: antipodeLong,
                    lat: antipodeLat,
                    desc: "The antipode of the selected coordinate is long: " + antipodeLong + " | lat: " + (selectedLat * -1)
                }
            });

            this.searchForClosestCity(antipodeLong, antipodeLat, "antipode");
        }
      }

    searchForCity() {
        document.getElementById("long").value = "";
        document.getElementById("lat").value = "";

        let searchValue = document.getElementById("city").value;
        let searchUrl = "https://nominatim.openstreetmap.org/search?city=" + searchValue + "&format=json";

        let cityCheck = this.state.cities.some(c => c.display_name == searchValue);

        if(!cityCheck)
        {
            fetch(searchUrl)
            .then(res => res.json())
                .then((result) => {
                        this.setState({
                            cities: result
                                        });
                    })
                .catch((err) => {
                    this.setState({
                        error: err,
                        cities: []
                    });
                })
        }
    };

    searchForClosestCity(long, lat, option)
    {
        let roundedLong = Number(long);
        roundedLong = roundedLong.toFixed(5);

        let roundedLat = Number(lat);
        roundedLat = roundedLat.toFixed(5);

        let searchUrl = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + roundedLat + "&lon=" + roundedLong + "&zoom=0";

        fetch(searchUrl)
            .then(res => res.json())
                .then((result) => {
                        if(option == "point")
                        {
                            this.setState({
                                closestCityToPoint: {
                                    long: result.lon,
                                    lat: result.lat,
                                    desc: "The closest city to the coordinates of long: " + long + "| lat: " + lat + " is the city of " + result.display_name + " at long: " + result.lon + " and lat: " + result.lat
                                    }
                                });
                        }
                        else if(option == "antipode")
                        {
                            this.setState({
                                clossestCityToAntipode: {
                                    long: result.lon,
                                    lat: result.lat,
                                    desc: "The closest city to the antipode coordinates of long: " + long + "| lat: " + lat + " is the city of " + result.display_name + " at long: " + result.lon + " and lat: " + result.lat
                                    }
                                });
                        }
                    })
                .catch((err) => {
                    this.setState({
                        error: err
                    });
                })
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

                { this.state.startPoint.lat === 0 && this.state.startPoint.long === 0 ? "" : 
                    <Marker position={[this.state.startPoint.lat, this.state.startPoint.long]}>
                    <Popup>
                        {this.state.startPoint.desc}
                    </Popup>
                    </Marker> 
                }

                { this.state.closestCityToPoint.lat === 0 && this.state.closestCityToPoint.long === 0 ? "" : 
                    <Marker position={[this.state.closestCityToPoint.lat, this.state.closestCityToPoint.long]}>
                    <Popup>
                        {this.state.closestCityToPoint.desc}
                    </Popup>
                    </Marker> 
                }

                { this.state.antipode.lat === 0 && this.state.antipode.long === 0 ? "" :
                    <Marker position={[this.state.antipode.lat, this.state.antipode.long]}>
                        <Popup>
                            {this.state.antipode.desc}
                        </Popup>
                    </Marker>  
                }

                
            </LeafletMap>

            <div className="startMenu">
            <h3>Choose location</h3>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="long">Longitude</label>
                    <input type="number" id="long" name="long" max="180" min="-180" step="0.000001"/>

                    <label htmlFor="lat">Latitude </label>
                    <input type="number" id="lat" name="lat" max="90" min="-90" step="0.000001"/>

                    <label htmlFor="city">City </label>
                    <input type="search" id="city" name="city" onKeyUp={this.searchForCity} list="cities" autoComplete="off"/>

                    <datalist id="cities">
                        {this.state.cities.map((city, key) =>
                            <option key={key} value={city.display_name} />
                        )}
                    </datalist>

                    <input type="submit" value="Search"></input>
                </form>
            </div>

            </React.Fragment>
        );
    };
}

export default Map;