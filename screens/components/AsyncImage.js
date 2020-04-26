import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import firebase from '../../firebase';

export default class AsyncImage extends React.Component {
	//The constructor for your component
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			mounted: true,
			image: 'students/testProfileImage.png',
			url: ''
		};
	}
	//The code that is called when the component is first mounted. Use it to setup the component and load the image files
	componentDidMount() {
		this.setState({ isMounted: true });
		this.getAndLoadHttpUrl();
	}
	async getAndLoadHttpUrl() {
		if (this.state.mounted == true) {
			const ref = firebase.storage().ref(this.props.image);
			ref
				.getDownloadURL()
				.then((data) => {
					this.setState({ url: data });
					this.setState({ loading: false });
				})
				.catch((error) => {
					console.log(error);
					this.setState({ url: '/students/testProfileImage.png' });
					this.setState({ loading: false });
				});
		}
	}
	//The code that is called when the component is about to unmount. Use it to cancel any http calls otherwise you will get a memory warning from React
	componentWillUnmount() {
		this.setState({ isMounted: false });
	}
	//The code that is called when the props passed to the component change. It is typically useful when say you are implementing a search functionality and you need to refresh the image after the component is refreshed on the component.
	//The render function to display the image
	render() {
		if (this.state.mounted == true) {
			if (this.state.loading == true) {
				return (
					<View
						key={this.props.image}
						style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
					>
						<ActivityIndicator />
					</View>
				);
			} else {
				return <Image style={this.props.style} source={{ uri: this.state.url }} />;
			}
		} else {
			return null;
		}
	}
}
