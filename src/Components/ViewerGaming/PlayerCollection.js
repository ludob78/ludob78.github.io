import React from "react";
import "./PlayerCollection.css";
import {connect} from 'react-redux';
import firebase from "../../Services/Firebase/firebase";
import update from "react-addons-update";
import environnement from "../../.env/env";
import { Input, Row, Col, Table, Button } from "react-materialize";

class PlayerCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { player: [] };
    this.firebaseRef = firebase
    .database()
    .ref("subscriber")
    .child("tontonbarjo/viewers");
    this.handleAddRemoveCount = this.handleAddRemoveCount.bind(this);
  }
  componentWillReceiveProps(newProps) {
    this.setState({ player: newProps.PlayerList });
  }
  handleAddRemoveCount(element, choice) {
    var ClonePlayersTab = this.state.player.slice();
    ClonePlayersTab.map((elt, i) => {
      if (element === elt) {
        choice === "add"
          ? (elt.countGame = elt.countGame + 1)
          : (elt.countGame = elt.countGame - 1);
          //load countgame firebase DB
          this.firebaseRef.child(element.userid+"/countGame").set(elt.countGame)
      }
    });
    //sort ascending of amount game with viewer
    /*    ClonePlayersTab.sort((a, b) => {
      console.log("a:", a);
      return a.countGame - b.countGame;
    }); */
    this.setState({ player: ClonePlayersTab });
  }
  render() {
    const playerList = this.state.player
      .filter(elt => {
        return elt.available === true;
      })
      .map((elt, index) => (
        <tr key={index}>
          {/* <td /> */}
          <td>{elt.TwitchName}</td>
          {elt.isSub === true ? (
            <td style={{ color: "#ba68c8" }}>SUBSCRIBER</td>
          ) : (
            <td style={{ color: "#13b9e2" }}>VIEWER</td>
          )}
          <td>{elt.nameIngame}</td>
          {/* <td>{elt.countGame}</td> */}
          <td>
            <div className="fixed-action-btn horizontal">
              <a className="btn-floating btn-large blue"  onClick={() => this.handleAddRemoveCount(elt, "add")}>
              {elt.countGame}
              </a>
              <ul>
             {/*    <li>
                  <a class="btn-floating blue">
                    <i class="material-icons">add</i>
                  </a>
                </li> */}
                <li>
                  <a className="btn-floating red" onClick={() => this.handleAddRemoveCount(elt, "remove")}>
                    <i className="material-icons">remove</i>
                  </a>
                </li>
               
              </ul>
            </div>
            {/*     <Button
            // style={{position:"relative",right:"0",bottom: '0', right: '24px',paddingTop:"0"}} 
            // disabled={player.available}
            s={2}
            fab="horizontal"
            large
            floating
            id={index}
            // fabClickOnly
            //don't use icon because issue on click icon tag( with handle delete)
            // icon="delete"
             className="grey"
          >
         
            <Button type="submit" floating icon='remove' className='blue' onClick={() => this.handleAddRemoveCount(elt, "add")}/>
            <Button type="submit" floating icon='remove' className='red' onClick={() => this.handleAddRemoveCount(elt, "remove")}/>
           
          </Button> */}
            {/* <Button
              floating
              large
              waves="light"
              className="blue z-depth-5"
              // icon="add"
              onClick={() => this.handleAddRemoveCount(elt, "add")}
            >{elt.countGame}</Button> */}
          </td>
          {/*  <td>
            <Button
              floating
              large
              waves="light"
              className="red z-depth-5"
              icon="remove"
              onClick={() => this.handleAddRemoveCount(elt, "remove")}
            />
          </td> */}
        </tr>
      ));

    return <tbody>{playerList}</tbody>;
  }
}
export default PlayerCollection;
