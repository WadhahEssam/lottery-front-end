import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  state = {
    managerAddress: null, 
  }

  componentDidMount() {
    lottery.methods.manager().call()
      .then((manager) => {
        this.setState({ managerAddress: manager });
      });
  }

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
      <div class="App">
        <nav class="navbar navbar-dark bg-dark">
          <a class="navbar-brand" href="#">
            Lottery
          </a>
        </nav>


        <div class="container">
          <div class="row">
            <div class="col-2"/>
            <div class="col-8">
            
              <div class="card text-center" style={{ marginTop: 30 }}>
                <div class="card-header">
                 Lottery Manager
                </div> 
                
                <div class="card-body">
                 {(!this.state.managerAddress) ? 'loading' : this.state.managerAddress}
                </div>
              </div>
            
            </div>
            <div class="col-2"/>
          </div>
        </div>




      </div>
    );
  }
}

export default App;
