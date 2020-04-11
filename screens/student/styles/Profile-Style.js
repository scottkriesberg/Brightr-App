import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    activity:{},
    container:{},
	backButton: {
		marginTop: 30
	},
	rating: {
		paddingTop: 10
	},
	myStarStyle: {
		color: 'yellow',
		backgroundColor: 'transparent',
		textShadowColor: 'black',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2
	},
	myEmptyStarStyle: {
		color: secondaryColor
	},
	header: {
		backgroundColor: primaryColor,
		height: 200
	},
	avatar: {
		width: 130,
		height: 130,
		borderRadius: 63,
		borderWidth: 4,
		borderColor: secondaryColor,
		marginBottom: 10,
		alignSelf: 'center',
		position: 'absolute',
		marginTop: 130
	},
	name: {
		margin: 'auto',
		fontSize: 22,
		color: '#FFFFFF',
		fontWeight: '600'
	},
	body: {
		marginTop: 10,
		alignItems: 'center',
		padding: 60
	},
	bodyContent: {
		flex: 1,
		alignItems: 'center',
		padding: 60
	},
	name: {
		fontSize: 28,
		color: '#696969',
		fontWeight: '600'
	},
	info: {
		fontSize: 16,
		color: '#00BFFF',
		marginTop: 10
	},
	description: {
		fontSize: 16,
		color: '#696969',
		marginTop: 10,
		textAlign: 'center'
	},
	buttonContainer: {
		marginTop: 10,
		height: 45,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
		width: 250,
		borderRadius: 30,
		backgroundColor: '#00BFFF'
	}
});
export {styles};