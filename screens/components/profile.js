import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

class Rating extends Component {
	static props = {
		rating: PropTypes.any,
		style: PropTypes.any,
		size: PropTypes.any,
		color: PropTypes.any
	};
	render() {
		return (
			<Text style={this.props.style}>
				{Math.round(this.props.rating * 10) / 10}/5
				<Icon name="star" type="Entypo" color="#F0CE49" size={20} />
			</Text>
		);
	}
}

export default Rating;
