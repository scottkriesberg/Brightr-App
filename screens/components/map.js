import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

const location = require('../../assets/location.png');
const selectedLocation = require('../../assets/selected_location.png');

export class Map extends Component {
    static props = {
        locationPressFunc: PropTypes.any,
        mapPressFunc: PropTypes.any,
        isStudent: PropTypes.any,
    };

    constructor() {
        super();
        this.state = {
            region: {
                latitude: 34.023,
                longitude: -118.286,
                latitudeDelta: 0.0035,
                longitudeDelta: 0.012,
            },
            markers: [
                {
                    latlng: {
                        latitude: 34.024664,
                        longitude: -118.288049,
                    },
                    title: 'Cafe 84',
                    description: 'description',
                },
                {
                    latlng: {
                        latitude: 34.021263,
                        longitude: -118.284002,
                    },
                    title: 'VKC Library',
                    description: 'description',
                },
                {
                    latlng: {
                        latitude: 34.019535,
                        longitude: -118.289527,
                    },
                    title: 'SAL',
                    description: 'description',
                },
                {
                    latlng: {
                        latitude: 34.021722,
                        longitude: -118.282791,
                    },
                    title: 'Leavey  Library',
                    description: 'description',
                },
                {
                    latlng: {
                        latitude: 34.025347,
                        longitude: -118.284961,
                    },
                    title: 'USC Village Tables',
                    description: 'description',
                },
                {
                    latlng: {
                        latitude: 34.020292,
                        longitude: -118.286084,
                    },
                    title: 'RTH Campus Center Tables',
                    description: 'description',
                },
                {
                    latlng: {
                        latitude: 34.018724,
                        longitude: -118.282418,
                    },
                    title: 'Fertitta Hall',
                    description: 'description',
                },
            ],
            selectedMarkerIndex: -1,
            selectedMarkerIndexs: [],
        };
    }

    onRegionChange(region) {
        this.setState({ region });
    }

    onMarkerPressStudent(marker, index) {
        this.setState({ selectedMarkerIndex: index });
        this.props.locationPressFunc(marker);
    }

    onMapPressStudent(e) {
        if (e.nativeEvent.action === 'marker-press') {
            return;
        }
        this.setState({ selectedMarkerIndex: -1 });
        this.props.mapPressFunc();
    }

    onMapPressTutor(e) {
        if (e.nativeEvent.action === 'marker-press') {
            return;
        }
        this.setState({ selectedMarkerIndex: -1 });
        this.props.mapPressFunc();
    }

    onMarkerPressTutor(marker, index) {
        if (this.state.selectedMarkerIndexs.includes(index)) {
            this.state.selectedMarkerIndexs = this.state.selectedMarkerIndexs.filter(
                (x) => x !== index,
            );
        } else {
            this.state.selectedMarkerIndexs.push(index);
        }
        this.setState();
        this.props.locationPressFunc(marker);
    }

    render() {
        if (this.props.isStudent) {
            return (
                <MapView
                    style={{ flex: 1 }}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={this.state.region}
                    onPress={(e) => this.onMapPressStudent(e)}
                >
                    {this.state.markers.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={marker.latlng}
                            title={marker.title}
                            onPress={() =>
                                this.onMarkerPressStudent(marker, index)
                            }
                        >
                            <Image
                                source={
                                    index === this.state.selectedMarkerIndex
                                        ? selectedLocation
                                        : location
                                }
                                style={{ width: 20, height: 30 }}
                            />
                        </Marker>
                    ))}
                </MapView>
            );
        }
        return (
            <MapView
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                initialRegion={this.state.region}
                onPress={(e) => this.onMapPressTutor(e)}
            >
                {this.state.markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={marker.latlng}
                        title={marker.title}
                        onPress={() => this.onMarkerPressTutor(marker, index)}
                    >
                        <Image
                            source={
                                this.state.selectedMarkerIndexs.includes(index)
                                    ? selectedLocation
                                    : location
                            }
                            style={{ width: 20, height: 30 }}
                        />
                    </Marker>
                ))}
            </MapView>
        );
    }
}
