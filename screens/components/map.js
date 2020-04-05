import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Button, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

export class Map extends Component {
	constructor() {
		super();
		this.state = {
			region: {
				latitude: 34.023,
				longitude: -118.286,
				latitudeDelta: 0.0035,
				longitudeDelta: 0.012
			},
			markers: [
				{
					latlng: {
						latitude: 34.024664,
						longitude: -118.288049
					},
					title: 'Cafe 84',
					description: 'description'
				},
				{
					latlng: {
						latitude: 34.021263,
						longitude: -118.284002
					},
					title: 'VKC Library',
					description: 'description'
				},
				{
					latlng: {
						latitude: 34.019535,
						longitude: -118.289527
					},
					title: 'SAL',
					description: 'description'
				},
				{
					latlng: {
						latitude: 34.021722,
						longitude: -118.282791
					},
					title: 'Leavey  Library',
					description: 'description'
				}
			],
			selectedMarkerIndex: -1,
			selectedMarkerIndexs: []
		};
	}
	static props = {
		locationPressFunc: PropTypes.any,
		mapPressFunc: PropTypes.any,
		isStudent: PropTypes.any
	};

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
			this.state.selectedMarkerIndexs = this.state.selectedMarkerIndexs.filter((x) => x != index);
		} else {
			this.state.selectedMarkerIndexs.push(index);
		}
		this.setState({ update: true });
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
							coordinate={marker.latlng}
							title={marker.title}
							pinColor={index == this.state.selectedMarkerIndex ? 'blue' : 'red'}
							onPress={() => this.onMarkerPressStudent(marker, index)}
						/>
					))}
				</MapView>
			);
		} else {
			return (
				<MapView
					style={{ flex: 1 }}
					provider={PROVIDER_GOOGLE}
					initialRegion={this.state.region}
					onPress={(e) => this.onMapPressTutor(e)}
				>
					{this.state.markers.map((marker, index) => (
						<Marker
							coordinate={marker.latlng}
							title={marker.title}
							pinColor={this.state.selectedMarkerIndexs.includes(index) ? 'blue' : 'red'}
							onPress={() => this.onMarkerPressTutor(marker, index)}
						/>
					))}
				</MapView>
			);
		}
	}
}
