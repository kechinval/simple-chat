import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

import '../../App.css';

export default class Chat extends Component {
  
  constructor(props){
    super(props)

    this.state = {
      online: [],
      message: '',
      messages: [],
    }

    this.socket = io('localhost:5000');

    this.socket.on('online', function(clients){
      addOnline(clients)
    })

    const addOnline = clients =>{
      this.setState({online: clients});
    }

    this.socket.on('RECEIVE_MESSAGE', function(data){
      addMessage(data);
    });

    const addMessage = data => {
      this.setState({messages: [...this.state.messages, data]});
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
      ReactDOM.findDOMNode(this.refs.online).scrollTop = ReactDOM.findDOMNode(this.refs.online).scrollHeight;
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="chatroom col-sm-10">
                      <ul className="chats" ref="chats">
                        {this.state.messages.map(message => {
                          return (
                            <li className={`chat ${this.socket.id === message.author ? "right" : "left"}`}>
                                {message.message}
                            </li>
                          )
                        })}
                      </ul>            
                    </div> 
                    <div className="test col-sm-2 online-list">
                      <p className="text-muted text-center">Online: {this.state.online.length}</p>
                      <ul className="list-group list-group-flush" ref="online">
                        {this.state.online.map(client => {
                          return (
                            <li className="list-group-item small">
                                {client}
                            </li>
                          )
                        })}
                      </ul>
                    </div> 
                  </div>
              </div>
              <div className="card-footer">
                <div className="input-group">
                  <input 
                    id = "text-field"
                    type="text" 
                    className="form-control" 
                    placeholder="Message..." 
                    aria-describedby="basic-addon2"
                    value={this.state.message} 
                    onChange={ev => this.setState({message: ev.target.value})} 
                  />
                  <div className="input-group-append">
                    <button className="btn btn-link" type="button" onClick={this.state.message.length > 0 ? this.sendMessage : null}>
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
