// npm install @react-navigation/native
// npm install react-native-screens react-native-safe-area-context
// npm install @react-navigation/stack
// npm install react-native-gesture-handler
// npm install react-native-elements
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native';
import { List, ListItem } from 'react-native-elements';

export default class SelectionScreen extends React.Component {
    render() {
        
        return (
            <View style={styles.outsideContainer}>
                <FlatList
                    data={[
                        { id: 1, name: 'Barrack Obama', avatar: '../assets/images/obama.jpeg' },
                        { id: 2, name: 'Michael Jordan', avatar: '../assets/images/jordan.jpeg' },
                        { id: 3, name: 'Michael Jackson', avatar: '../assets/images/jackson.jpeg' },
                        { id: 4, name: 'Martin Luther King', avatar: '../assets/images/MLK.jpeg' },
                        { id: 5, name: 'Abraham Lincoln', avatar: '../assets/images/lincoln.jpeg' },
                    ]}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() =>
                            this.props.navigation.navigate('ChatScreen',{name: item.name})}>
                            <View style={styles.profile}>
                                <View style={styles.leftContainer}>
                                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                                    <View style={styles.midContainer}>
                                        <Text style={styles.agentName}>{item.name}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outsideContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        padding: 10,
        width: "100%",
        justifyContent: 'space-between',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    profile: {
        padding: 10,
        margin: 5
    },
    leftContainer: {
        flexDirection: 'row',
    },
    midContainer: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // paddingVertical: 5,
        justifyContent: 'space-around',
    },
    agentName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginRight: 15,
      },
  });

