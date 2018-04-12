import React, {Component} from 'react';

export default class Message extends Component {

    render() {
        return (
            <div className={'row'}>
                <div className="col-2 col-md-2"> {this.props.message.id} </div>
                <div className="col-6 col-md-6"> {this.props.message.message} </div>
                <div className="col-4 col-md-4"> {this.props.message.created_at} </div>
            </div>
        )
    }
}