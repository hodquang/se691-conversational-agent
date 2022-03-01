import React, { useState, useEffect } from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/auth';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';

export default function Login({ navigation }) {

    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState([]);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    })



    async function onAppleButtonPress() {
        // 1). start a apple sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        // 2). if the request was successful, extract the token and nonce
        const { identityToken, nonce } = appleAuthRequestResponse;
        // can be null in some scenarios
        if (identityToken) {
            // 3). create a Firebase `AppleAuthProvider` credential
            const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);

            // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
            //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
            //     to link the account to an existing user
            const userCredential = await firebase.auth().signInWithCredential(appleCredential);

            // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger

        } else {
            // handle this - retry?
        }
    }

    function onAuthStateChanged(user) {
        setUser(user);
        if (user) setLoggedIn(true);
    }
    // GoogleSignin.configure({
    //     webClientId: '11544258142-5fogdf3n26l54e0ljt37l5eku9l3574l.apps.googleusercontent.com'
    // })

    // const signInWithGoogleAsync = async () => {
    //     const { idToken } = await GoogleSignin.signIn();
    //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    //     const user_sign_in = auth().signInWithCredential(googleCredential);
    //     user_sign_in.then((user) => {
    //         //console.log(user);
    //     })
    //         .catch((error) => {
    //             console.log(error);
    //         })
    // }

    signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            auth().signOut().then(() => alert('You are signed out.'));
            setLoggedIn(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView>
            <View style={{ justifyContent: 'center', alignItems: 'center', height: 500 }}>
                {user ? (
                    <View style={{ alignItems: 'center' }}>
                        <Text>Welcome {user.email}</Text>
                        <Button title="Go to Selection Screen" onPress={() => navigation.navigate('SelectionScreen', {
                            name: user.email,
                            id: user.uid
                        })}
                        />
                        <Button onPress={signOut} title="Logout" color="red" />
                    </View>
                )
                    :
                    (
                        <View style={{ alignItems: 'center' }}>
                            <Text>Please Sign in To Use The Chatbot</Text>
                            <Text></Text>
                            <AppleButton
                                buttonStyle={AppleButton.Style.WHITE}
                                buttonType={AppleButton.Type.SIGN_IN}
                                style={{
                                    width: 192, // You must specify a width
                                    height: 48, // You must specify a height
                                }}
                                onPress={() => onAppleButtonPress()}
                            />
                            {/* <GoogleSigninButton style={{ width: 192, height: 48 }}
                                size={GoogleSigninButton.Size.Wide}
                                color={GoogleSigninButton.Color.Dark}
                                onPress={signInWithGoogleAsync} /> */}
                        </View>
                    )}
            </View>
        </SafeAreaView>

    );
}