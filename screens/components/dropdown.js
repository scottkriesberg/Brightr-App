import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableHighlight, TouchableOpacity, Modal, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { SearchBar } from 'react-native-elements';
import Loading from './utils.js';

export class Dropdown extends Component {
	static props = {
		items: PropTypes.any,
		getSelectedItem: PropTypes.Func,
		modalHeaderText: PropTypes.any,
		dropdownTitle: PropTypes.any,
		placeholder: PropTypes.any,
		intitalValue: PropTypes.any
	};

	constructor(props) {
		super(props);

		this.state = {
			pickerSelection: this.props.intitalValue,
			pickerDisplayed: false
		};
	}

	setPickerValue(newValue) {
		this.setState({
			pickerSelection: newValue
		});

		this.togglePicker();
	}

	togglePicker() {
		this.setState({
			pickerDisplayed: !this.state.pickerDisplayed
		});
	}

	renderItem = ({ item }) => {
		return (
			<TouchableOpacity
				style={styles.row}
				onPress={() => {
					this.setPickerValue(item.title);
					this.props.getSelectedItem(item.title);
				}}
			>
				<Text style={styles.itemText}>{item.title}</Text>
			</TouchableOpacity>
		);
	};

	render() {
		const { items, dropdownTitle, modalHeaderText } = this.props;

		return (
			<View style={styles.container}>
				<Text style={styles.dropDownHeaderText}>{dropdownTitle}</Text>
				<TouchableOpacity style={styles.selectedTouchable} onPress={() => this.togglePicker()}>
					<Text style={styles.placeHolderText}>{this.state.pickerSelection}</Text>
				</TouchableOpacity>

				<Modal
					style={styles.modalContainer}
					visible={this.state.pickerDisplayed}
					animationType={'slide'}
					transparent={true}
				>
					<View style={styles.modalView}>
						<Text style={styles.modalTextHeader}>{modalHeaderText}</Text>
						<FlatList
							style={styles.list}
							data={items}
							renderItem={this.renderItem}
							keyExtractor={(item, index) => index.toString()}
						/>

						<TouchableHighlight
							onPress={() => {
								this.togglePicker();
							}}
							style={{ paddingTop: 4, paddingBottom: 4 }}
						>
							<Text style={{ color: 'black' }}>Cancel</Text>
						</TouchableHighlight>
					</View>
				</Modal>
			</View>
		);
	}
}

export class SearchableDropdown extends Component {
	static props = {
		items: PropTypes.any,
		getSelectedItem: PropTypes.Func,
		modalHeaderText: PropTypes.any,
		dropdownTitle: PropTypes.any,
		placeholder: PropTypes.any,
		intitalValue: PropTypes.any
	};

	constructor(props) {
		super(props);

		this.state = {
			pickerSelection: this.props.intitalValue,
			pickerDisplayed: false,
			data: this.props.items,
			searchVaule: ''
		};
	}

	setPickerValue(newValue) {
		this.setState({
			pickerSelection: newValue
		});

		this.togglePicker();
	}

	renderSeparator = () => {
		return (
			<View
				style={{
					height: 1,
					width: '86%',
					backgroundColor: '#CED0CE',
					marginLeft: '14%'
				}}
			/>
		);
	};

	togglePicker() {
		this.setState({
			pickerDisplayed: !this.state.pickerDisplayed
		});
	}

	searchFilterFunction = (text) => {
		this.setState({
			searchVaule: text
		});

		const newData = this.props.items.filter((item) => {
			const itemData = `${item.title.toUpperCase()}`;
			const textData = text.toUpperCase();

			return itemData.indexOf(textData) > -1;
		});
		this.setState({
			data: newData
		});
	};

	renderItem = ({ item }) => {
		return (
			<TouchableOpacity
				style={styles.row}
				onPress={() => {
					this.setPickerValue(item.title);
					this.props.getSelectedItem(item.title);
				}}
			>
				<Text style={styles.itemText} allowFontScaling>
					{item.title}
				</Text>
			</TouchableOpacity>
		);
	};

	render() {
		const { dropdownTitle, modalHeaderText } = this.props;

		return (
			<View style={styles.container}>
				<Text style={styles.dropDownHeaderText}>{dropdownTitle}</Text>
				<TouchableOpacity style={styles.selectedTouchable} onPress={() => this.togglePicker()}>
					<Text style={styles.placeHolderText}>{this.state.pickerSelection}</Text>
				</TouchableOpacity>

				<Modal
					style={styles.searchModalContainer}
					visible={this.state.pickerDisplayed}
					animationType={'slide'}
					transparent={true}
				>
					<View style={styles.searchModalView}>
						<Text style={styles.modalTextHeader}>{modalHeaderText}</Text>
						<TextInput
							style={styles.searchBar}
							placeholder="Search"
							onChangeText={(text) => this.searchFilterFunction(text)}
							value={this.state.searchVaule}
							autoFocus={true}
						/>
						<FlatList
							style={styles.list}
							data={this.state.data}
							renderItem={this.renderItem}
							keyExtractor={(item, index) => index.toString()}
						/>
						<View style={styles.cancelModalButtonContainer}>
							<TouchableHighlight
								onPress={() => {
									this.togglePicker();
								}}
								style={styles.cancelModalButton}
							>
								<Text style={styles.cancelModalButtonText}>Cancel</Text>
							</TouchableHighlight>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

export class MultiSelectSearchableDropdown extends Component {
	static props = {
		items: PropTypes.any,
		getSelectedItem: PropTypes.Func,
		modalHeaderText: PropTypes.any,
		dropdownTitle: PropTypes.any,
		placeholder: PropTypes.any,
		intitalValue: PropTypes.any,
		doneFunc: PropTypes.Func
	};

	constructor(props) {
		super(props);

		this.state = {
			selected: [],
			pickerDisplayed: false,
			data: this.props.items,
			searchVaule: ''
		};
	}

	renderSeparator = () => {
		return (
			<View
				style={{
					height: 1,
					width: '86%',
					backgroundColor: '#CED0CE',
					marginLeft: '14%'
				}}
			/>
		);
	};

	togglePicker() {
		this.setState({
			pickerDisplayed: !this.state.pickerDisplayed
		});
	}

	searchFilterFunction = (text) => {
		this.setState({
			searchVaule: text
		});

		const newData = this.props.items.filter((item) => {
			const itemData = `${item.title.toUpperCase()}`;
			const textData = text.toUpperCase();

			return itemData.indexOf(textData) > -1;
		});
		this.setState({
			data: newData
		});
	};

	renderItem = ({ item }) => {
		if (this.state.selected.includes(item)) {
			return;
		}
		return (
			<TouchableOpacity
				style={styles.row}
				onPress={() => {
					this.state.selected.push(item);
					this.setState({ update: true });
				}}
			>
				<Text style={styles.itemText} allowFontScaling>
					{item.title}
				</Text>
			</TouchableOpacity>
		);
	};

	renderItemSelected = ({ item }) => {
		return (
			<TouchableOpacity
				style={styles.selectedRow}
				onPress={() => {
					this.state.selected = this.state.selected.filter((classObj) => {
						return classObj.title !== item.title;
					});
					this.setState({ update: true });
				}}
			>
				<Text style={styles.itemText} allowFontScaling>
					{item.department} {item.code}
				</Text>
			</TouchableOpacity>
		);
	};

	render() {
		const { dropdownTitle, modalHeaderText, doneFunc } = this.props;

		return (
			<View style={styles.multiContainer}>
				<Text style={styles.dropDownHeaderText}>{dropdownTitle}</Text>
				<TouchableOpacity style={styles.selectedTouchable} onPress={() => this.togglePicker()}>
					<FlatList
						style={styles.list}
						data={this.state.selected}
						renderItem={this.renderItemSelected}
						keyExtractor={(item, index) => index.toString()}
					/>
				</TouchableOpacity>

				<Modal
					style={styles.searchModalContainer}
					visible={this.state.pickerDisplayed}
					animationType={'slide'}
					transparent={true}
				>
					<View style={styles.searchModalView}>
						<View style={styles.selectedContainer}>
							<FlatList
								horizontal={true}
								style={styles.selectedList}
								data={this.state.selected}
								renderItem={this.renderItemSelected}
								keyExtractor={(item, index) => index.toString()}
							/>
						</View>
						<View style={styles.multiHeaderContainer}>
							<Text style={styles.modalTextHeader}>{modalHeaderText}</Text>
							<TextInput
								style={styles.multiSearchBar}
								placeholder="Search"
								onChangeText={(text) => this.searchFilterFunction(text)}
								value={this.state.searchVaule}
								autoFocus={true}
							/>
						</View>
						<View style={styles.multiOptionsContainer}>
							<FlatList
								style={styles.multiList}
								data={this.state.data}
								renderItem={this.renderItem}
								keyExtractor={(item, index) => index.toString()}
							/>
						</View>
						<View style={styles.multiCancelModalButtonContainer}>
							<TouchableHighlight
								onPress={() => {
									this.togglePicker();
									doneFunc(this.state.selected);
								}}
								style={styles.cancelModalButton}
							>
								<Text style={styles.cancelModalButtonText}>Done</Text>
							</TouchableHighlight>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	//MultiSelectSearchabledropdown
	multiContainer: {
		width: '100%',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	multiSelectedTouchable: {
		width: '100%'
	},
	selectedList: {
		flex: 0.25,
		width: '100%',
		flexWrap: 'wrap'
	},
	selectedRow: {
		height: 45,
		paddingVertical: 10,
		marginVertical: 5,
		borderRadius: 15,
		borderWidth: 1,
		backgroundColor: '#6A7BD6',
		width: 100,
		alignItems: 'center',
		justifyContent: 'center'
	},
	multiList: {
		flex: 15
	},
	multiCancelModalButtonContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		height: 50
	},
	multiHeaderContainer: {
		flex: 1,
		marginBottom: '8%'
	},
	selectedContainer: { flex: 1, width: '100%' },
	multiOptionsContainer: { flex: 4 },
	multiSearchBar: {
		width: '70%',
		height: 60
	},
	//StartWaiting Styles
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	modalContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: 10
	},
	dropDownHeaderText: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold'
	},
	placeHolderText: {
		fontSize: 20,
		paddingLeft: 10,
		color: '#6A7BD6'
	},
	modalView: {
		margin: '5%',
		borderRadius: 15,
		borderWidth: 1,
		padding: 20,
		backgroundColor: '#efefef',
		bottom: 20,
		left: 20,
		right: 20,
		alignItems: 'center',
		position: 'absolute',
		height: '40%'
	},
	modalTextHeader: {
		fontSize: 20
	},
	selectedTouchable: {
		backgroundColor: 'white',
		borderRadius: 15,
		width: 200,
		height: '45%',
		justifyContent: 'center'
	},
	list: {
		flex: 15,
		width: '100%'
	},
	row: {
		flex: 1,
		height: 45,
		paddingVertical: 10,
		marginVertical: 5,
		borderRadius: 15,
		borderWidth: 1,
		backgroundColor: '#6A7BD6',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	itemText: {
		color: 'white',
		fontSize: 20
	},
	cancelModalButtonContainer: {
		flex: 0.25,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%'
	},
	cancelModalButton: {
		borderRadius: 15,
		borderWidth: 1,
		borderColor: '#6A7BD6',
		height: '90%',
		width: '90%',
		marginTop: '10%'
	},
	cancelModalButtonText: {
		fontSize: 40,
		color: '#6A7BD6',
		alignSelf: 'center'
	},
	modalTitleText: {
		paddingTop: '50%',
		textAlign: 'center',
		fontSize: 35,
		color: '#6A7BD6'
	},

	searchBar: {
		width: '100%',
		height: 50
	},
	searchModalContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		height: 10
	},
	searchModalView: {
		margin: '5%',
		borderRadius: 15,
		borderWidth: 1,
		padding: 20,
		backgroundColor: '#efefef',
		alignItems: 'center',
		height: '50%',
		marginTop: 50
	}
});
