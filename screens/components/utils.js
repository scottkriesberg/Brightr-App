import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import LoadingStyle from '../../styles/loading';

class Loading extends Component {
    static props = {
        style: PropTypes.any,
        size: PropTypes.any,
        color: PropTypes.any,
    };

    render() {
        return (
            <View style={this.props.style || LoadingStyle.loadingIcon}>
                <ActivityIndicator
                    size={this.props.size || 'large'}
                    color={this.props.color || '#0000ff'}
                />
            </View>
        );
    }
}
export default Loading;
// export function codeGen() {
// 	const num1 = Math.floor(Math.random() * 10);
// 	const num2 = Math.floor(Math.random() * 10);
// 	const num3 = Math.floor(Math.random() * 10);
// 	const num4 = Math.floor(Math.random() * 10);
// 	return num1.toString() + num2.toString() + num3.toString() + num4.toString();
// }
