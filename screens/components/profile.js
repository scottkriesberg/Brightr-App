import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Button, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

export class Rating extends Component {
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

export class ProfileHeadingInfo extends Component {
	static props = {
		rating: PropTypes.any,
		containerStyle: PropTypes.any,
		major: PropTypes.any,
		bio: PropTypes.any,
		name: PropTypes.any,
		image: PropTypes.any,
		year: PropTypes.any,
		bio: PropTypes.any
	};
	render() {
		return (
			<View style={this.props.containerStyle || styles.container}>
				<View style={styles.basicText}>
					<Image resizeMode="stretch" style={styles.avatar} source={this.props.image} />

					<Text adjustsFontSizeToFit style={styles.profileNameText}>
						{this.props.name}
					</Text>
					<Text adjustsFontSizeToFit style={styles.profileInfoText}>
						{this.props.year} / {this.props.major}
					</Text>
					<Rating style={styles.profileInfoText} rating={this.props.rating} />
				</View>

				<View style={styles.bioContainer}>
					<Text adjustsFontSizeToFit style={styles.bio}>
						{this.props.bio}
					</Text>
				</View>
			</View>
		);
	}
}

export class ProfileTopBar extends Component {
	static props = {
		containerStyle: PropTypes.any,
		editPageFunction: PropTypes.any,
		logoutFunction: PropTypes.any,
		name: PropTypes.any
	};
	render() {
		return (
			<View style={styles.header}>
				<Button
					style={styles.logoutButton}
					icon={<Icon name="arrow-left" size={15} color="white" />}
					iconLeft
					title="Logout"
					onPress={this.props.logoutFunction}
				/>
				<Icon
					style={styles.editProfile}
					name="account-edit"
					type="MaterialCommunityIcons"
					color="black"
					size={50}
					onPress={this.props.editPageFunction}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	//ProfileHeaderInfo Styles
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	avatar: {
		borderRadius: 45,
		borderWidth: 4,
		borderColor: 'white',
		flex: 3,
		alignSelf: 'center',
		aspectRatio: 1
	},
	basicText: {
		flex: 3,
		alignItems: 'center'
	},
	profileInfoText: {
		fontSize: 20
	},
	profileNameText: {
		fontSize: 40
	},
	selfInfo: {
		flex: 3,
		backgroundColor: 'skyblue',
		flexDirection: 'column',
		backgroundColor: 'black'
	},
	bioContainer: {
		flex: 2,
		justifyContent: 'center'
	},
	bio: {
		alignSelf: 'center',
		paddingLeft: 5,
		paddingRight: 5,
		textAlign: 'center'
	},
	//ProfileTopBar Styles
	header: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#6A7BD6',
		justifyContent: 'space-between'
	},
	logoutButton: {
		alignSelf: 'flex-start'
	},
	profileText: {
		fontSize: 50
	},
	editProfile: {
		alignSelf: 'flex-end'
	}
});
