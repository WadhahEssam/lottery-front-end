import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';

class App extends Component {
  render() {

    // printing the version of the web3 that we created
    console.log('WEB 3 Version : ' + web3.version);
    web3.eth.getAccounts()
      .then( accounts => {  
        console.log('The Metamax Account : ' + accounts);
        web3.eth.getBalance(accounts[0])
        .then( balance => {
          console.log('Current Balance in the accounts in wei : ' + balance);
        });
      });
   

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
