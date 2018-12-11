import React from "react";
import Tmi from "react-tmi";
import environnement from "../../.env/env";
import firebase from "../../Services/Firebase/firebase";
import ViewerSearch from "../ViewerGaming/ViewerSearch";
import ViewerCollection from "../ViewerGaming/ViewerCollection";
import PlayerCollection from "../ViewerGaming/PlayerCollection";
import {
  Row,
  Col,
  Input,
  Table,
  Collapsible,
  CollapsibleItem,
  Tabs,
  Tab,
  Icon
} from "react-materialize";
import Modal from "../Modal/modal";
import { HorizontalBar } from "react-chartjs-2";

class ScoreToDonate extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            viewer: [],
            displayViewer: [],
            displayPlayer: []
          };
          this.client = new Tmi.client({
            options: {
              debug: true
            },
            connection: {
              cluster: "aws",
              reconnect: true
            },
            identity: {
              username: environnement.Twitch.Username_Twitch,
              password: environnement.Twitch.Password_Twitch
            },
            channels: [environnement.Twitch.Username_Twitch]
          });
          /*     this.firebaseRef = firebase
          .database()
          .ref().set() */
      
          this.firebaseRef = firebase
            .database()
            .ref("subscriber")
            .child("tontonbarjo/viewers");
          this.handleSearchViewer = this.handleSearchViewer.bind(this);
          // this.handleSearchPlayer = this.handleSearchPlayer.bind(this);
    }
    handleSearchViewer(searchResult) {
        console.log(searchResult);
        this.setState({ displayViewer: searchResult });
      }
    render(){
        const data = {
            // labels: ["Team1","Team2"],
            labels: this.state.LabelChar,
            datasets: [
              {
                label: "Vote",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: [65, 59]
              },
             ]
          };
          
        return(
            <Row>
        <Col s={12}>
          <h3>
            Players ({
              this.state.displayPlayer.filter(elt => {
                return elt.available === true;
              }).length
            })
          </h3>
          <Table>
            <thead>
              <tr>
                {/*   <th>
                <ViewerSearch
                  ViewerList={this.state.displayViewer.filter(elt =>{
                    return elt.available === false;
                  })}
                  onSearchViewer={this.handleSearchPlayer}
                />
              </th> */}
                <th>Twitch Name</th>
                <th>Status Twitch</th>
                <th>Name in Game</th>
                <th>Game Counting</th>
                <th />
                <th />
              </tr>
            </thead>
            <PlayerCollection PlayerList={this.state.displayPlayer} />
          </Table>
        </Col>
       
      </Row>
        )
    }
}
export default ScoreToDonate;