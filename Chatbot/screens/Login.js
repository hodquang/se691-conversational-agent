import React, { useState, useEffect } from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';


export default function Login({ navigation }) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState([]);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    })

    function onAuthStateChanged(user) {
        setUser(user);
        if (user) setLoggedIn(true);
    }
    GoogleSignin.configure({
        webClientId: '11544258142-5fogdf3n26l54e0ljt37l5eku9l3574l.apps.googleusercontent.com'
    })

    const signInWithGoogleAsync = async () => {
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const user_sign_in = auth().signInWithCredential(googleCredential);
        user_sign_in.then((user)=>{
            //console.log(user);
        })
        .catch((error)=>{
            console.log(error);
        })
    }

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
                            <Text>Welcome {user.displayName}</Text>
                        <Button title="Go to Selection Screen"
                            onPress={() => navigation.navigate('SelectionScreen', {
                                name: user.displayName,
                                id: user.uid
                            })}
                            />
                            <Button onPress={signOut} title="Logout" color="red" />
                        </View>
                    )
                        :
                        (
                            <View>
                                <Text>Please Sign in To Use The Chatbot</Text>
                                <GoogleSigninButton style={{ width: 192, height: 48 }}
                                    size={GoogleSigninButton.Size.Wide}
                                    color={GoogleSigninButton.Color.Dark}
                                    onPress={signInWithGoogleAsync}
                                />
                            </View>
                        )}
                </View>
            </SafeAreaView>

    );
}