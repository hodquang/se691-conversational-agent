import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import firestore from '@react-native-firebase/firestore';
import { obama, kobe } from './env';


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
    var dialogflowConfig = {
      'Barack Obama': obama,
      'Michael Jordan': kobe,
    };

    Dialogflow_V2.setConfiguration(
      dialogflowConfig[this.props.route.params.botName].client_email,
      dialogflowConfig[this.props.route.params.botName].private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig[this.props.route.params.botName].project_id,
    );
    const { botName, avatar, name, id } = this.props.route.params;
    firestore()
      .collection(this.props.route.params.botName)
      .doc(id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()
      .then((snapshot) => {
        let messages = snapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: doc.text,
            createdAt: new Date().getTime(),
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
          this.setState({
            name,
            id,
            messages: [
              { _id: 2, text: 'My name is ' + this.props.route.params.botName + '.', createdAt: new Date().getTime(), user: this.BOT },
              { _id: 1, text: 'Hi', createdAt: new Date().getTime(), user: this.BOT }
            ],
          });
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
      .collection(this.props.route.params.botName)
      .doc(id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
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
    // Dialogflow returns answers of three kinds:
    //    queryResult, alternativeQueryResults, and knowledgeAnswers
    // We need to process all three to determine a useful response for the client.

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
    let msg = {
      text,
      createdAt: new Date().getTime(),
      user: this.BOT,
    };

    const { botName, avatar, name, id } = this.props.route.params;

    firestore()
      .collection(this.props.route.params.botName)
      .doc(id)
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
