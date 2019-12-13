import React, { Component } from 'react';
import { connect } from 'react-redux'
import superagent from 'superagent'

class App extends Component {
  state = {
    text: ''
  }
  stream = new EventSource('http://localhost:4000/stream')
  componentDidMount() {
    this.stream.onmessage = event => {
      console.log('event test', event.data)
      const parsed = JSON.parse(event.data)
      this.props.dispatch(parsed)
    }
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  onClick = () => {
    this.setState({ text: '' })
  }
  onSubmit = e => {
    e.preventDefault()
    const url = 'http://localhost:4000/message'
    superagent.post(url)
      .send(this.state)
      .then(response => console.log(response))
    this.onClick()
  }
  render() {
    console.log('messages test:', this.props.messages)
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input type="text" name="text" onChange={this.onChange} value={this.state.text} />
          <button>Submit</button>
        </form>
        <button onClick={this.onClick}>Reset</button>
        {this.props.messages.map(message => <p key={message.id}>{message.text}</p>)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state
  }
}

export default connect(mapStateToProps)(App);