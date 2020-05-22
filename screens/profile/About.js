import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class About extends Component {
    render() {
        return (
            <View style={aboutStyles.aboutContainer}>
                <Text style={aboutStyles.aboutText}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris sit amet auctor dolor. Proin ac elit tempus,
                    venenatis erat non, ultrices libero. Duis maximus ex gravida
                    ipsum imperdiet, ut varius ligula efficitur. Nulla eu
                    pellentesque eros. Etiam a velit et lectus interdum dapibus
                    ut in nunc. Morbi ac eros dapibus, accumsan arcu ac,
                    eleifend tellus. Vivamus blandit, purus in consectetur
                    sagittis, erat enim facilisis augue, quis iaculis lacus mi
                    ut nibh. Duis mauris arcu, suscipit quis blandit at, euismod
                    vel eros. {`\n\n`}
                    Orci varius natoque penatibus et magnis dis parturient
                    montes, nascetur ridiculus mus. Phasellus euismod quis augue
                    nec molestie. Vestibulum ante ipsum primis in faucibus orci
                    luctus et ultrices posuere cubilia curae; Integer ipsum ex,
                    tincidunt sit amet viverra eget, bibendum a felis. In
                    ultricies ac dui nec ullamcorper. Suspendisse augue leo,
                    fringilla tempus tempus sed, luctus in tellus. Quisque
                    feugiat ipsum at urna sagittis, sit amet accumsan justo
                    imperdiet. Vestibulum rutrum gravida orci. Nam iaculis
                    tristique ligula, et viverra lacus tincidunt vitae. Maecenas
                    ultrices eleifend est sit amet efficitur. Curabitur viverra
                    quam quis sem sagittis vulputate. Cras vestibulum neque
                    enim, fermentum sagittis nulla finibus in. Aliquam eget
                    tortor tempus eros cursus feugiat.
                </Text>
            </View>
        );
    }
}

const aboutStyles = StyleSheet.create({
    aboutContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 30,
        marginTop: 10,
    },
    aboutText: {
        fontSize: 14,
        margin: 15,
    },
    xStyle: {
        position: 'absolute',
        left: 15,
        top: 15,
    },
});
