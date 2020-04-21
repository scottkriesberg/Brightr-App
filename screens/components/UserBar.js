import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Rating } from '../components/profile';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import { Button } from './buttons';

export class UserBar extends Component {
	static props = {
		containerStyle: PropTypes.any,
		textStyle: PropTypes.any,
		imageStyle: PropTypes.any,
		user: PropTypes.any,
		onPressFunc: PropTypes.any
	};
	render() {
		const { user } = this.props;
		var classList = '';
		for (var i = 0; i < user.classesArray.length; i++) {
			classList += user.classesArray[i] + ', ';
		}
		classList = classList.substring(0, classList.length - 2);
		return (
			<TouchableOpacity
				style={[
					this.props.containerStyle,
					{
						backgroundColor: secondaryColor,
						flexDirection: 'row',
						alignItems: 'center',
						flex: 1,
						borderWidth: 1,
						borderColor: primaryColor
					}
				]}
				onPress={this.props.onPressFunc}
			>
				<View>
					<Image
						style={[
							this.props.imageStyle,
							{
								height: 70,
								width: 70,
								borderRadius: 63,
								borderWidth: 2.5,
								borderColor: primaryColor,
								margin: 20
							}
						]}
						source={{
							uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'
						}}
					/>
				</View>
				<View
					style={{
						flex: 1
					}}
				>
					<Text
						style={{
							fontSize: 20
						}}
					>
						{user.name}
					</Text>
					<Rating rating={user.rating} />
					<Text adjustsFontSizeToFit={true} numberOfLines={2}>
						{user.major.code} / {user.year}
					</Text>
				</View>
				<View
					style={{
						flex: 1,
						alignSelf: 'center',
						justifyContent: 'center'
					}}
				>
					<Text
						style={{
							fontSize: 20
						}}
					>
						Classes
					</Text>
					<Text adjustsFontSizeToFit={true} numberOfLines={3}>
						{classList}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
}
