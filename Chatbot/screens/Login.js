import React, { useState, useEffect } from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';


export default function Login({ navigation }) {

    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState([]);

    useEffect(() => {
        GoogleSignin.configure({
            scopes: ['email'],
            webClientId: '11544258142-fgvefcmtnliibvntpdq1t79cgjj53s92.apps.googleusercontent.com',
            offlineAcces: true
        })
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    })

    function onAuthStateChanged(user) {
        setUser(user);
        if (user) setLoggedIn(true);
    }

    _signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { accessToken, idToken } = await GoogleSignin.signIn();
            setLoggedIn(true);
            const credential = auth.GoogleAuthProvider.credential(idToken, accessToken);
            await auth().signInWithCredential(credential);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                alert('Cancel');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                alert('Sigin in Progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                alert('Play Services Not Available');
            } else {

            }

        }
    };

    signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            auth().signOut().then(() => alert('You are signed out.'));
            setLoggedIn(false);
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <>
            <SafeAreaView>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: 500 }}>
                    {user ? (
                        <View style={{ alignItems: 'center' }}>
                            <Text>Welcome {user.displayName}</Text>
                            <Button title="Go to Selection Screen" onPress={() => navigation.navigate('SelectionScreen', {
                                name: user.displayName,
                                id: user.uid
                            })}
                            />
                            <Button onPress={this.signOut} title="Logout" color="red" />
                        </View>
                    )
                        :
                        (
                            <View>
                                <Text>Please Sign in To Use The Chatbot</Text>
                                <GoogleSigninButton style={{ width: 192, height: 48 }}
                                    size={GoogleSigninButton.Size.Wide}
                                    color={GoogleSigninButton.Color.Dark}
                                    onPress={this._signIn} />
                            </View>
                        )}
                </View>
            </SafeAreaView>
        </>
    );
}