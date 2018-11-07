import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import '../../App.css';

export default class Chat extends Component {

  constructor(props){
    super(props);

    this.state = {
      message: '',
      messages: [],
    }

    this.socket = io('localhost:5000');

    let feedback = document.getElementById('feedback');

    this.socket.on('RECEIVE_MESSAGE', function(data){
      addMessage(data);
    });

    this.socket.on('typing', function(author){
      feedback.innerText = author + 'is typing...'
    });

    const addMessage = data => {
      console.log(data);
      this.setState({messages: [...this.state.messages, data]});
      console.log(this.state.messages);
    };

    this.sendMessage = ev => {
      ev.preventDefault();
      this.socket.emit('SEND_MESSAGE', {
        author: this.socket.id,
        message: this.state.message
      })
      this.setState({message: ''});
    }

  }

  componentDidMount() {
    this.scrollToBot();
  }

  componentDidUpdate() {
      this.scrollToBot();
  }

  scrollToBot() {
      ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className="chatroom">
                  <ul className="chats" ref="chats">
                    {this.state.messages.map(message => {
                      return (
                        <li className={`chat ${this.socket.id === message.author ? "right" : "left"}`}>
                            {message.message}
                        </li>
                      )
                    })}
                  </ul>
                  <div id="feedback"></div>               
                </div> 
              </div>
              <div className="card-footer">
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Message..." 
                    aria-describedby="basic-addon2" 
                    value={this.state.message} 
                    onChange={ev => this.setState({message: ev.target.value})} 
                  />
                  <div className="input-group-append">
                    <button className="btn btn-link" type="button" onClick={this.state.message > 0 ? this.sendMessage : ''}>
                        <i className="fab fa-telegram-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>             
      </div>
    )
  }
}
