import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	TextInput,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	Modal,
	FlatList,
	SectionList
} from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { Button } from './buttons';

export class Dropdown extends Component {
	static props = {
		items: PropTypes.any,
		getSelectedItem: PropTypes.Func,
		modalHeaderText: PropTypes.any,
		dropdownTitle: PropTypes.any,
		placeholder: PropTypes.any,
		intitalValue: PropTypes.any,
		containerStyle: PropTypes.any,
		modalStyle: PropTypes.any,
		titleStyle: PropTypes.any,
		touchableStyle: PropTypes.any,
		renderItemTextFunc: PropTypes.Func
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
		var text;
		if (this.props.renderItemTextFunc) {
			text = this.props.renderItemTextFunc(item);
		} else {
			text = item;
		}
		return (
			<TouchableOpacity
				style={styles.row}
				onPress={() => {
					this.setPickerValue(text);
					this.props.getSelectedItem(item);
				}}
			>
				<Text style={styles.itemText} adjustsFontSizeToFit={true} numberOfLines={1}>
					{text}
				</Text>
			</TouchableOpacity>
		);
	};

	render() {
		const { containerStyle, modalStyle, titleStyle, items, dropdownTitle, modalHeaderText } = this.props;

		return (
			<View style={containerStyle || styles.container}>
				<Text style={titleStyle || styles.dropDownHeaderText}>{dropdownTitle}</Text>
				<TouchableOpacity style={styles.selectedTouchable} onPress={() => this.togglePicker()}>
					<Text style={styles.placeHolderText} adjustsFontSizeToFit={true} numberOfLines={1}>
						{this.state.pickerSelection}
					</Text>
				</TouchableOpacity>

				<Modal
					style={styles.modalContainer}
					visible={this.state.pickerDisplayed}
					animationType={'slide'}
					transparent={true}
				>
					<View style={modalStyle || styles.modalView}>
						<View style={{ alignItems: 'center', flex: 4, width: '95%' }}>
							<Text style={styles.modalTextHeader}>{modalHeaderText}</Text>
							<FlatList
								style={styles.list}
								data={items}
								renderItem={this.renderItem}
								keyExtractor={(item, index) => index.toString()}
							/>
						</View>
						<View style={{ alignItems: 'center', flex: 1, width: '90%' }}>
							<Button
								onPress={() => {
									this.togglePicker();
								}}
								text={'Cancel'}
								type={'secondary'}
							/>
						</View>
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
			const itemData = `${item.name.toUpperCase()}`;
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
					this.setPickerValue(item.name);
					this.props.getSelectedItem(item);
				}}
			>
				<Text style={styles.itemText} adjustsFontSizeToFit={true} numberOfLines={1}>
					{item.name}
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
					<Text style={styles.placeHolderText} adjustsFontSizeToFit={true} numberOfLines={2}>
						{this.state.pickerSelection}
					</Text>
				</TouchableOpacity>

				<Modal
					style={styles.searchModalContainer}
					visible={this.state.pickerDisplayed}
					animationType={'slide'}
					transparent={true}
				>
					<View style={styles.searchModalView}>
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
			const itemData = item.title.toUpperCase();
			const textData = text.toUpperCase();
			return itemData.indexOf(textData) > -1;
		});
		this.setState({
			data: newData
		});
	};

	renderItem = ({ item }) => {
		if (this.state.selected.includes(item)) {
			return null;
		}
		return (
			<TouchableOpacity
				style={styles.multiRow}
				onPress={() => {
					this.state.selected.push(item);
					this.setState({ update: true });
				}}
			>
				<Text style={styles.itemText} adjustsFontSizeToFit={true} numberOfLines={1}>
					{item.name}
				</Text>
			</TouchableOpacity>
		);
	};

	renderItemSelected = ({ item }) => {
		return (
			<View style={styles.selectedRow}>
				<Text style={styles.itemText} adjustsFontSizeToFit={true} numberOfLines={1}>
					{item.department} {item.code}
				</Text>
				<Icon
					name="circle-with-cross"
					type="entypo"
					color="white"
					onPress={() => {
						this.state.selected = this.state.selected.filter((classObj) => {
							return classObj.name !== item.name;
						});
						this.setState({ update: true });
					}}
				/>
			</View>
		);
	};

	renderItemSelectedNonModal = ({ item }) => {
		return (
			<View style={styles.selectedRowNonModal}>
				<Text style={styles.itemTextNonModal} allowFontScaling={true} adjustsFontSizeToFit={true}>
					{item.department} {item.code}: {item.name}
				</Text>
				<Icon
					name="circle-with-cross"
					type="entypo"
					color="white"
					onPress={() => {
						this.state.selected = this.state.selected.filter((classObj) => {
							return classObj.name !== item.name;
						});
						this.setState({ update: true });
					}}
				/>
			</View>
		);
	};

	render() {
		const { dropdownTitle, modalHeaderText, doneFunc } = this.props;

		return (
			<View style={styles.multiContainer}>
				<View style={styles.multiTochableContainer}>
					<TouchableOpacity style={styles.multiSelectedTouchable} onPress={() => this.togglePicker()}>
						<Text style={styles.multiDropDownHeaderText}>{dropdownTitle}</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.selectedContainer}>
					<FlatList
						style={styles.selectedList}
						data={this.state.selected}
						renderItem={this.renderItemSelectedNonModal}
						keyExtractor={(item, index) => index.toString()}
					/>
				</View>
				<Modal
					style={styles.searchModalContainer}
					visible={this.state.pickerDisplayed}
					animationType={'slide'}
					transparent={true}
				>
					<View style={styles.searchModalView}>
						{this.state.selected.length > 0 ? (
							<View style={styles.selectedContainer}>
								<FlatList
									horizontal={true}
									style={styles.selectedList}
									data={this.state.selected}
									renderItem={this.renderItemSelected}
									keyExtractor={(item, index) => index.toString()}
								/>
							</View>
						) : null}
						<View style={styles.multiHeaderContainer}>
							<TextInput
								style={styles.multiSearchBar}
								placeholder="Search"
								onChangeText={(text) => this.searchFilterFunction(text)}
								value={this.state.searchVaule}
								autoFocus={true}
							/>
						</View>
						<View style={styles.multiOptionsContainer}>
							<SectionList
								style={styles.multiList}
								sections={this.state.data}
								renderItem={this.renderItem}
								renderSectionHeader={({ section: { title } }) => (
									<Text
										style={{
											fontWeight: 'bold',
											fontSize: 20,
											textAlign: 'center',
											color: primaryColor
										}}
									>
										{title}
									</Text>
								)}
								keyExtractor={(item, index) => item + index}
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
								<Text style={styles.multiDoneModalButtonText}>Done</Text>
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
	multiTochableContainer: {
		flex: 0.25,
		width: '100%',
		alignItems: 'center'
	},
	multiSelectedTouchable: {
		backgroundColor: secondaryColor,
		borderRadius: 15,
		width: '90%',
		height: '95%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	multiDropDownHeaderText: {
		color: primaryColor,
		fontSize: 20,
		fontWeight: 'bold'
	},
	selectedList: {
		flex: 0.25,
		width: '100%'
	},
	selectedRow: {
		borderRadius: 15,
		borderWidth: 1,
		backgroundColor: primaryColor,
		width: 120,
		alignItems: 'center',
		justifyContent: 'space-around',
		flexDirection: 'row'
	},
	selectedRowNonModal: {
		flex: 1,
		paddingVertical: 10,
		marginVertical: 5,
		borderRadius: 15,
		borderWidth: 1,
		backgroundColor: primaryColor,
		paddingHorizontal: '3%',
		width: '90%',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignSelf: 'center'
	},
	multiList: {
		flex: 15,
		width: '100%'
	},
	multiRow: {
		flex: 1,
		height: 35,
		paddingVertical: 8,
		marginVertical: 2,
		borderRadius: 15,
		borderWidth: 1,
		backgroundColor: primaryColor,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	multiCancelModalButtonContainer: {
		flex: 0.75,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	multiDoneModalButtonText: {
		fontSize: 20,
		color: primaryColor,
		alignSelf: 'center'
	},
	multiHeaderContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center'
	},
	selectedContainer: { flex: 1, marginVertical: '1%', width: '100%' },
	multiOptionsContainer: { flex: 4, width: '100%' },
	multiSearchBar: {
		width: '90%',
		height: 35,
		borderRadius: 15,
		borderWidth: 1,
		borderColor: 'black',
		paddingLeft: '2%'
	},
	itemTextNonModal: {
		color: secondaryColor,
		fontSize: 15,
		textAlign: 'left'
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
		color: secondaryColor,
		fontSize: 20,
		fontWeight: 'bold'
	},
	placeHolderText: {
		fontSize: 20,
		paddingHorizontal: 5,
		color: primaryColor
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
		backgroundColor: secondaryColor,
		borderRadius: 15,
		width: 200,
		height: '50%',
		justifyContent: 'center'
	},
	list: {
		flex: 15,
		width: '100%'
	},
	row: {
		flex: 1,
		height: 35,
		paddingHorizontal: '1%',
		marginVertical: '1%',
		borderRadius: 15,
		borderWidth: 1,
		backgroundColor: primaryColor,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	itemText: {
		color: secondaryColor,
		fontSize: 20,
		fontWeight: 'bold'
	},
	cancelModalButtonContainer: {
		flex: 0.15,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%'
	},
	cancelModalButton: {
		borderRadius: 15,
		borderWidth: 1,
		borderColor: primaryColor,
		height: '90%',
		width: '90%',
		justifyContent: 'center'
	},
	cancelModalButtonText: {
		fontSize: 20,
		color: primaryColor,
		alignSelf: 'center'
	},
	modalTitleText: {
		paddingTop: '50%',
		textAlign: 'center',
		fontSize: 35,
		color: primaryColor
	},
	searchBar: {
		width: '90%',
		height: 35,
		borderRadius: 15,
		borderWidth: 1,
		borderColor: 'black',
		paddingLeft: '2%'
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
