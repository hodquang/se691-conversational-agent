import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View , Text} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';

import { dialogflowConfig } from '../env';


export default class ChatScreen extends Component {
  
  obama= '../assets/images/obama.jpeg'
  

  BOT = {
    _id: 2,
    name: 'Mr.Bot',
    avatar: require('../assets/images/bot.jpeg')
  };

  state = {
    messages: [
      { _id: 2, text: 'My name is ' + this.props.route.params.name + '.', createdAt: new Date(), user: this.BOT },
      { _id: 1, text: 'Hi', createdAt: new Date(), user: this.BOT }
    ],
    id: 1,
    name: '',
  }

  componentDidMount = () => {
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
        (result) => {console.log(result); this.handleGoogleResponse(result) },
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
          _id: this.state.messages.length + 1,
          text,
          createdAt: new Date(),
          user: this.BOT,
        };
      
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
