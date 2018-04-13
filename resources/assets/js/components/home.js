import React, { Component } from 'react';

import SocketService from '../services/socket_service';

import Message from './message';

export default class Home extends Component {

  socket = null;

  onMessage = (msg) => {
    this.setState({
      messages: [...this.state.messages, ...msg.data]
    });
  };

  socketEvents = [
    { eventName: SocketService.events.GET_NOTIFICATION, callback: this.onMessage }
  ];

  constructor (props) {
    super(props);

    this.socket = SocketService.getConnection();

    this.subscribeToSoketEvents();
    // SocketService.subscribe(SocketService.events.GET_NOTIFICATION, this.onMessage);

    this.state = {
      writeMessage: '',
      messages: [],
    }
  }

  subscribeToSoketEvents = () => {
    this.socketEvents.map(event => SocketService.subscribe(event));
  };

  unsubscribeFromSoketEvents = () => {
    this.socketEvents.map(event => SocketService.unsubscribe(event));
  };

  componentWillUnmount () {
    this.unsubscribeFromSoketEvents();
    // SocketService.unsubscribe(SocketService.events.GET_NOTIFICATION, this.onMessage);
  }

  sendMessage = (e) => {
    e.preventDefault();

    this.socket.send(JSON.stringify({
      eventType: SocketService.events.SEND_NOTIFICATION,
      data: {
        message: this.state.writeMessage
      }
    }));

    this.setState({ writeMessage: '' });
  };

  onMessageChange = ( { target: { value } }) => {
    this.setState({ writeMessage: value });
  };

  render () {
    return (
      <div>
        <div className='row'>
          <div className='col-12 col-md-8 offset-md-2'>
            SendMessage
            <form onSubmit={ this.sendMessage }>
              <input type='text' onChange={ this.onMessageChange }/>
            </form>
          </div>
        </div>
        <div className='row'>
          <div className='col-12 col-md-8 offset-md-2'>
            {
              this.state.messages.map((message, number) => <Message key={ `Message_id_${number}` } message={ message }/>)
            }
          </div>
        </div>
      </div>
    )
  }
}
