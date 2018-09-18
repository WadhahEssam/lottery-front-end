import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  state = {
    managerAddress: null, 
    numberOfPlayers: null,
    players: [],
    wei: null,
    userAccount: null,
    userBalance: null,
    isManager: false, 
    value: '', 
    error: '',
    waiting: '',
    success: '', 
  }

  async componentDidMount() {
    const managerAddress = await lottery.methods.manager().call();
    const numberOfPlayers = await lottery.methods.getNumberOfPlayers().call();
    const players = await lottery.methods.getPlayers().call();
    const wei = await lottery.methods.getAvailableWei().call();
    const userAccount = await web3.eth.getAccounts();
    const userBalance = await web3.eth.getBalance(userAccount[0]);

    if (managerAddress.toString() === userAccount.toString()) {
      this.setState({ isManager: true }); 
    }

    this.setState({
      managerAddress,
      numberOfPlayers,
      players, 
      wei,
      userAccount,
      userBalance,
    });
  } 

  async enterPlayer() {
    const ether = parseFloat(this.state.value);
    if (isNaN(ether)) {
      this.setState({error: 'Enter valid amount of ether'});
    } else if ((ether * 1000000000000000000 ) > this.state.userBalance) {
      this.setState({error: 'You dont have this amount of ether'});
    } else {
      this.setState({ error: '', waiting: 'Waiting for your transaction to be submitted in the blockchain' });
      await lottery.methods.enter().send({ from: this.state.userAccount[0] , value: web3.utils.toWei(ether.toString(), 'ether') })
        .then( async transactionAddress => {
          this.setState({ waiting: '', success: 'You Entered The lottery thank you for participating.' });
          console.log(transactionAddress);
          const numberOfPlayers = await lottery.methods.getNumberOfPlayers().call();
          const players = await lottery.methods.getPlayers().call();
          const wei = await lottery.methods.getAvailableWei().call();
          this.setState({
            numberOfPlayers,
            players,
            wei,
          });
        })
        .catch( error => {
          this.setState({ error: 'somthing wrong happened' , waiting: ''})
          console.log(error);
        });
    }
  }

  pickWinner = async () => {
    this.setState({ waiting: 'Waiting for the smart contract to pick a winner...' });
    lottery.methods.pickWinner().send({ from: this.state.userAccount[0] })
      .then( async response => {
        console.log(response);
        this.setState({ waiting: '', success: 'The smart contract picked a winner..'});
        const numberOfPlayers = await lottery.methods.getNumberOfPlayers().call();
        const players = await lottery.methods.getPlayers().call();
        const wei = await lottery.methods.getAvailableWei().call();
        this.setState({
          numberOfPlayers,
          players,
          wei,
        });
      })
      .catch( error => {
        console.log(error);
      })
    
  }

  render() {

    const playersList = this.state.players.map( (player,index) => <div  key={index} ><span className="badge badge-info" >{player}</span><br/></div>);
   
    const error = <div className="alert alert-danger" role="alert" >{this.state.error}</div>;
    const waiting = <div className="alert alert-info" role="alert" >{this.state.waiting}</div>;
    const success = <div className="alert alert-success alert-dismissible fade show" role="alert" >{this.state.success}
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>;


    return (
      <div className="App">
        <nav className="navbar navbar-dark bg-dark">
          <a className="navbar-brand" href="#">
            Blockchain Lottery Application
          </a>
        </nav>

        <div className="container">


          <div className="row ">

            
            <div className="col-sm-1 col-md-2"/>
            <div className="col-sm-10 col-md-8">

              {/* padding */}
              <div style={{ marginTop: 20, }} />

              {(this.state.error !== '') ? error : '' }
              {(this.state.waiting !== '') ? waiting : '' }
              {(this.state.success !== '') ? success : '' }

              <div className="row " style={{ padding: 10 }}>
              
                  <div className="col-md-6 col-sm-12" style={{ padding: 5 }}>
                    <div className="card text-center" >
                      <div className="card-header">Pick Winner</div>
                      <div className="card-body" style={{ height: 120 }}>
                        <span className={"badge badge-" + ((this.state.isManager) ? 'success' : 'danger' ) } style={{ marginBottom: 10 }}>{(this.state.isManager) ? 'You can pick winner' : 'You are not the manager'}</span>
                        <br/>
                        <button disabled={(this.state.isManager) ? false: true} onClick={this.pickWinner} type="button" className="btn btn-primary">Pick Random Winner</button>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12" style={{ padding: 5 }}>
                    <div className="card text-center" >
                      <div className="card-header">Enter Lottery</div>
                        <div className="card-body" style={{ height: 120 }}>
                          <p style={{fontSize: 14, padding: 0, margin: 0 }}>Your Account :</p>
                          <p className="user-account-address">{this.state.userAccount}</p>
                          <div className="input-group mb-3">
                            <input
                              type="price"
                              className="form-control"
                              placeholder="Ether Amount"
                              onChange={ e => { this.setState({ value: e.target.value }) }}
                              value={this.state.value}
                            />
                            <div className="input-group-append">
                              <button
                                className="btn btn-outline-success"
                                type="button"
                                id="button-addon2"
                                onClick={this.enterPlayer.bind(this)}
                              >
                                Enter
                              </button>
                            </div>
                          </div>

                        </div>
                    </div>
                  </div>
              
              </div>


              <div className="card text-center" style={{ marginTop: 20, padding: 10, marginBottom: 30 }}>

                <div className="card text-center" >
                  <div className="card-header">
                  Lottery Manager
                  </div> 
                  
                  <div className="card-body">
                  {(!this.state.managerAddress) ? 'loading' : <div className="badge badge-success">{this.state.managerAddress}</div>}
                  </div>
                </div>

                <div className="card text-center" style={{ marginTop: 20 }}>
                  <div className="card-header">
                  Lottery Participants
                  </div> 

                  <div className="card-body">
                    <span className="badge badge-secondary">Number Of Players</span> : 
                    <span 
                      className="badge badge-light" 
                      style={{ marginLeft: 6 }}
                    >
                      { (!this.state.numberOfPlayers) ? 'Loading...' : this.state.numberOfPlayers }
                    </span>
                    
                    { (this.state.players.length) ? <hr/> : '' }
                    {playersList}

                  </div>
                </div>

                <div className="card text-center" style={{ marginTop: 20 }}>
                  <div className="card-header">
                  Total Amount Of Ethereum
                  </div> 
                  
                  <div className="card-body">
                  {(!this.state.managerAddress) ? 'loading' : <div className="badge badge-warning">{web3.utils.fromWei(this.state.wei, 'ether')} Ether</div>}
                  </div>
                </div>

              </div>

            </div>
            <div className="col-sm-1 col-md-2"/>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
