import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import firestore from '@react-native-firebase/firestore';
import { michaelJordan, barackObama, michaelJackson, martinLutherKingJr, abrahamLincoln } from './env';

export default class ChatScreen extends Component {
  BOT = {
    _id: 2,
    name: this.props.route.params.botName,
    avatar: this.props.route.params.avatar
  };

  state = {
    messages: [],
    id: 1,
    name: '',
  }

  componentDidMount = () => {
    const { botName, avatar, name, id } = this.props.route.params;
    var dialogflowConfig = {
      'Barack Obama': barackObama,
      'Michael Jordan': michaelJordan,
      'Michael Jackson': michaelJackson,
      'Martin Luther King Jr.': martinLutherKingJr,
      'Abraham Lincoln': abrahamLincoln,
    };

    Dialogflow_V2.setConfiguration(
      dialogflowConfig[botName].client_email,
      dialogflowConfig[botName].private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig[botName].project_id,
    );

    firestore()
      .collection(botName)
      .doc(name)
      .collection('MESSAGES')
      .orderBy('created', 'desc')
      .limit(100)
      .get()
      .then((snapshot) => {
        let messages = snapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: doc.text,
            created: new Date().toISOString().slice(0, 19).replace('T', ' '),
            ...firebaseData,
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.name,
            };
          }
          return data;
        });

        if (messages.length > 0) {
          this.setState({ name, id, messages });
        } else {
          this.sendBotResponse('Hi, my name is ' + botName + '.')
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let text = messages[0].text;
    const { botName, avatar, name, id } = this.props.route.params;

    firestore()
      .collection(botName)
      .doc(name)
      .collection('MESSAGES')
      .add({
        text,
        created: new Date().toISOString().slice(0, 19).replace('T', ' '),
        message_from: name,
        message_to: botName,
        role_model: botName,
        user: {
          _id: 1,
          name: name,
        },
      });

    Dialogflow_V2.requestQuery(
      text,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log(error),
    );
  }

  handleGoogleResponse(result) {
    var text
    if (result.queryResult.fulfillmentMessages) {
      console.log("query result = ", result.queryResult.fulfillmentMessages[0].text.text[0]);
      text = result.queryResult.fulfillmentMessages[0].text.text[0];
    } else if (result.queryResult.knowledgeAnswers) {
      console.log("knowledge answers = ", result.queryResult.knowledgeAnswers.answers[0].answer);
      text = result.queryResult.knowledgeAnswers.answers[0].answer;
    } else if (result.alternativeQueryResults) {
      console.log("alternative result = ", result.alternativeQueryResults.fulfilmentText);
      text = result.alternativeQueryResults.fulfilmentText;
    }
    this.sendBotResponse(text);
  }

  sendBotResponse(text) {
    const { botName, avatar, name, id } = this.props.route.params;
    let msg = {
      text,
      created: new Date().toISOString().slice(0, 19).replace('T', ' '),
      messageFrom: botName,
      messageTo: name,
      role_model: botName,
      user: this.BOT,
    };

    firestore()
      .collection(botName)
      .doc(name)
      .collection('MESSAGES')
      .add(msg);

    msg._id = this.state.messages.length + 1;

    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(message) => this.onSend(message)}
          user={{ _id: 1 }}
        />
      </View>
    );
  }
}