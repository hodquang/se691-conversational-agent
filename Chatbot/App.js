import React, { Component } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';

import { dialogflowConfig } from './env';

const botAvatar = require('./assets/images/obama.jpeg');
const BOT = {
  _id: 2,
  name: 'Mr.Bot',
  avatar: botAvatar
};

class App extends Component{
  state = {
    messages: [
      { _id: 2, text: 'My name is Obama', createdAt: new Date(), user: BOT },
      { _id: 1, text: 'Hi', createdAt: new Date(), user: BOT }
    ],
    id: 1,
    name: '',
  }

  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let message = messages[0].text;

    Dialogflow_V2.requestQuery(
        message,
        (result) => this.handleGoogleResponse(result),
        (error) => console.log(error),
    );
  }
  
  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  }

  sendBotResponse(text) {
      let msg = {
        _id: this.state.messages.length + 1,
        text,
        createdAt: new Date(),
        user: BOT,
      };

    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  render() {
    return (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
        <GiftedChat
            messages={this.state.messages}
            onSend={(message) => this.onSend(message)}
            user={{ _id: 1 }}
          />
        </View>
    );
  }
}

export default App;