import React, {Component} from 'react';
import SocketService from "../services/socket.service";

import Message from './Message';

const GET_NOTIFICATION = 'GET_NOTIFICATION';

class Home extends Component {

    socket = null;

    constructor(props) {
        super(props);

        this.socket = SocketService.getConnection();

        SocketService.subscribe(SocketService.events.GET_NOTIFICATION, this.onMessage);

        this.state = {
            writeMessage: '',
            messages: [],
        }
    }

    componentWillUnmount(){
        SocketService.unsubscribe(SocketService.events.GET_NOTIFICATION, this.onMessage);
    }

    onMessage = (msg) => {
        console.log(msg);
        console.log(this.state.messages);
        console.log([...this.state.messages, ...msg.data]);
        this.setState({messages: [...this.state.messages, ...msg.data]});
    };

    sendMessage = (e) => {
        e.preventDefault();

        this.socket.send(JSON.stringify({
            "eventType": SocketService.events.SEND_NOTIFICATION,
            "data": {
                "message": this.state.writeMessage
            }
        }));

        this.setState({writeMessage: ''});
    };

    onMessageChange =  ({target: {value}}) => {
        this.setState({writeMessage: value});
    };

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-12 col-md-8 offset-md-2">
                        SendMessage
                        <form onSubmit={this.sendMessage}>
                            <input type="text" onChange={this.onMessageChange}/>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-8 offset-md-2">
                        {
                            this.state.messages.map( (message, number) => <Message key={"Message_id_"+number} message={message}/> )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;
