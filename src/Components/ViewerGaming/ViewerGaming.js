import React, { Children } from "react";
import update from "react-addons-update";
import Tmi from "react-tmi";
import "./ViewerGaming.css";
import environnement from "../../.env/env";
import { Input, Row, Col, Table, Button, Icon } from "react-materialize";
import ViewerSearch from "./ViewerSearch";
import ViewerCollection from "./ViewerCollection";
import PlayerCollection from "./PlayerCollection";
import firebase from "../../Services/Firebase/firebase";
class ViewerGaming extends React.Component {
  constructor(props) {
    super(props);
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
  componentWillMount() {
    this.client.connect();
    this.listenChat();
    this.listenJoinerLeft();
    this.onWhisper();
  }
  componentDidMount() {
    this.firebaseCallback = this.firebaseRef.once("value", snap => {
      var insertViewerDB=[]
      snap.forEach(child=>{
       /*  console.log("child:",child)
        console.log("childkey:",child.key)
        console.log("childval:",child.val()) */
        insertViewerDB.push(child.val())

      })
      
      console.log("snap.val():", snap.val());
      this.setState({ displayViewer: insertViewerDB,viewer:insertViewerDB });
    });
  }
  componentWillUnmount() {
    this.client.disconnect();
    this.firebaseRef.off("value", this.firebaseCallback);
  }
  componentWillUpdate() {
    console.log("ViewerGaming.js componentWillUpdate");
  }
  componentDidUpdate(prevProps, prevState) {
     console.log("ViewerGaming.js componentDidUpdate");
  }
  onWhisper() {
    this.client.on("whisper", (from, userstate, message, self) => {
      if (message.trim().indexOf("<") > -1) {
        var CloneViewersTab = this.state.viewer.slice();
        var Viewer = CloneViewersTab.find(elt => {
          return elt.userid === userstate["user-id"];
        });
        if (Viewer !== undefined) {
          this.updateKeyElt(
            {
              userid: userstate["user-id"],
              message: message.substring(
                message.trim().indexOf("<") + 1,
                message.trim().indexOf(">")
              )
            },
            "nameIngame"
          );
        }
      }
    });
  }
  whisper(user, message) {
    this.client.whisper(user, message);
  }
  handleCommand(viewer, message) {
    // if (message.trim().substring(0, 1) === "!") {
    switch (
      message
        .trim()
        .substring(1, message.length)
        .toLowerCase()
    ) {
      case "ready":
        var CloneViewersTab = this.state.viewer.slice();
        CloneViewersTab = CloneViewersTab.map(elt => {
          var rObj = {
            userid: elt.userid,
            TwitchName: elt.TwitchName,
            available: elt.available,
            isSub: elt.isSub,
            isReady: elt.isReady,
            countGame: elt.countGame,
            nameIngame: elt.nameIngame
          };
          if (elt.userid === viewer.userid) {
            rObj.isReady = true;
            // check if we already have name in game
            if (elt.nameIngame === undefined) {
              this.whisper(
                
                viewer.TwitchName,
                "Prêt pour une partie? Quel est ton pseudo de jeu? (format de réponse: <pseudo>)"
              );
            } else {
              this.whisper(
                viewer.TwitchName,
                "Prêt pour une partie? Ton pseudo de jeu actuel est <" +
                  elt.nameIngame +
                  ">. Si ce n'est pas le cas, quel est ton pseudo de jeu? (format de réponse: <pseudo>)"
              );
            }
          }
          return rObj;
        });

        this.setState({
          viewer: CloneViewersTab,
          displayViewer: CloneViewersTab
        });

        break;
      case "notready":
        var CloneViewersTab = this.state.viewer.slice();
        CloneViewersTab = CloneViewersTab.map(elt => {
          var rObj = {
            userid: elt.userid,
            TwitchName: elt.TwitchName,
            available: elt.available,
            isSub: elt.isSub,
            isReady: elt.isReady,
            countGame: elt.countGame,
            nameIngame: elt.nameIngame
          };
          if (elt.TwitchName === viewer.TwitchName) {
            rObj.isReady = false;
            // rObj.available=true;
            this.whisper(
              viewer.TwitchName,
              "Merci, à bientôt pour une prochaine partie!"
            );
          }

          return rObj;
        });
        this.setState({
          viewer: CloneViewersTab,
          displayViewer: CloneViewersTab
        });

        break;
      default:
        return "message non reconnu";
    }
    // }
  }

  updateKeyElt(source, key) {
    // https://reactjs.org/docs/update.html
    var collection = this.state.viewer;
    var mergeObject = {};
    var mergeKey = {};
    /* 
    //deal with source=userstate
    if (indexIdViewer !== undefined) {
      mergeKey = { $merge: { TwitchName: source["display-name"] } };
    }
    //deal with source=other value
    else {
      mergeKey = { $merge: { nameIngame: source } };
    }
     */
    switch (key) {
      case "TwitchName":
        var indexViewer = collection.findIndex(elt => {
          return elt.userid === source["user-id"];
        });
        // mergeKey = { $merge: { TwitchName: "Ludo" } };
        mergeKey = { $merge: { TwitchName: source["display-name"] } };
        
        break;
      case "nameIngame":
        var indexViewer = collection.findIndex(elt => {
          return elt.userid === source.userid;
        });
        mergeKey = { $merge: { nameIngame: source.message } };
        //update DB
        this.firebaseRef.child(source.userid+"/nameIngame").set(source.message)
      default:
        console.log("Bad key object");
    }
    mergeObject[indexViewer] = mergeKey;
    var newStateElt = update(collection, mergeObject);
    this.setState({ viewer: newStateElt, displayViewer: newStateElt });
  }
  listenChat() {
    this.client.on("chat", (channel, userstate, message, self) => {
      console.log("console firebase",this.firebaseRef.child(userstate["user-id"]).key)

      const viewer = {
        userid: userstate["user-id"],
        TwitchName: userstate["display-name"],
        available: false,
        isSub: userstate.subscriber,
        isReady: false,
        countGame: "",
        nameIngame: null
      };
      var ViewersTab = this.state.viewer.slice();
      var isUserExist = ViewersTab.find(elt => {
        return elt.userid === viewer.userid;
      });
      console.log(userstate);
      //insert twitchuser in my state
      if (
        isUserExist === undefined
        // || (userstate["display-name"]!=="Nightbot")
      ) {
        ViewersTab.push(viewer);
        //insert viewer BD
        this.firebaseRef.child(userstate["user-id"]).set({
          userid: userstate["user-id"],
          TwitchName: userstate["display-name"],
          available: false,
          isSub: userstate.subscriber,
          isReady: false,
          countGame: 0,
          nameIngame: null
        })
        
        //Insert viewer in state
        var ViewersTab = ViewersTab.filter(elt => {
               return elt.userid !== "19264788"||elt.userid !== "207587272";
        });
        this.setState({ viewer: ViewersTab, displayViewer: ViewersTab });
      } else {
        //correct Twitchname if viewer changed his name
        if (isUserExist.TwitchName !== userstate["display-name"]) {
          // if ("ludo" !== userstate["display-name"]) {
          this.updateKeyElt(userstate, "TwitchName");
          
        }
      }
   /*    console.log(
        this.firebaseRef.child(userstate["user-id"]).set({
          userid: userstate["user-id"],
          TwitchName: userstate["display-name"],
          isSub: userstate.subscriber
        })
      ); */
      if (message.trim().substring(0, 1) === "!") {
        this.handleCommand(viewer, message);
      }
    });
  }
  listenJoinerLeft() {
    var that = this;
    /*    this.client.on("join", (channel, username, self) => {
      console.log("join:", channel + " " + username);
      var new_viewer = {};
      var new_viewer = {
        TwitchName: username,
        nameIngame: null,
        isSub: null,
        isAvailable: false,
        countGame: 0
      };
      //   console.log("new_viewer:", new_viewer);
      var ViewersTab = that.state.viewer.slice();

      ViewersTab.indexOf(new_viewer) === -1
        ? ViewersTab.push(new_viewer)
        : null;
      this.setState({ viewer: ViewersTab });
    }); */
    this.client.on("part", (channel, username, self) => {
      console.log("part:", channel + " " + username);
      var ViewersTab = that.state.viewer.slice();
      ViewersTab = ViewersTab.map((elt, index) => {
        var rObj = {
          userid: elt.userid,
          TwitchName: elt.TwitchName,
          available: elt.available,
          isSub: elt.isSub,
          isReady: elt.isReady,
          countGame: elt.countGame,
          nameIngame: elt.nameIngame
        };
        if (elt.TwitchName === username) {
          rObj.isReady = false;
        }
        return rObj;
      });
      //   setTimeout(null,2000)
      this.setState({ viewer: ViewersTab, displayViewer: ViewersTab });
    });
  }

  handleSearchViewer(searchResult) {
    console.log(searchResult);
    this.setState({ displayViewer: searchResult });
  }
  /*   handleSearchPlayer(searchResult) {
    console.log(searchResult);
    this.setState({ displayPlayer: searchResult });
  } */
  handleActivePlayer = playerActivate => {
    console.log("playerActivate:", playerActivate);
    this.setState({ displayPlayer: playerActivate });
  };
  /*   filterByCol(){

  } */
  render() {
    console.log("ViewerGaming.js render");
    return (
      <Row>
        <Col s={6}>
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
        <Col s={6}>
          <h3>Viewers ({this.state.viewer.length})</h3>
          <Table>
            <thead>
              <tr>
                <th>
                  <ViewerSearch
                    ViewerList={this.state.viewer}
                    onSearchViewer={this.handleSearchViewer}
                  />
                </th>
                <th onClick={this.handleSort}>
                  Twitch Name<Icon>keyboard_arrow_down</Icon>
                  {/* <Input id="filterbytwitchname" label="search" onChange={(e)=>this.filterByCol()}></Input> */}
                </th>
                <th>
                  Ready?<Icon>keyboard_arrow_down</Icon>
                </th>
                <th>
                  Status Twitch<Icon>keyboard_arrow_down</Icon>
                </th>
                <th>
                  Game Counting<Icon>keyboard_arrow_down</Icon>
                </th>
                <th>
                  Name in Game<Icon>keyboard_arrow_down</Icon>
                </th>
              </tr>
            </thead>
            <ViewerCollection
              onActivePlayer={this.handleActivePlayer}
              viewerToDisplay={this.state.displayViewer}
              viewerList={this.state.viewer}
            />
          </Table>
        </Col>
      </Row>
    );
  }
}
export default ViewerGaming;
