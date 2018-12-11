import React, { Component } from 'react';
// import logo from './logo.svg';
import Tabs from './Components/Tabs/Tabs';
import './App.css';


class App extends Component {
  
  render() {
    
    return (
      <div className="App" >
        <div className="App-header myparallax">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1 className="App-title">Welcome On TwitchBot admin</h1>
        </div>
      <Tabs className="main-page"/>
      {/* <Masterkill></Masterkill> */}
      </div>
    );
  }
}

export default App;
