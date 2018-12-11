import React from "react";
import Tmi from "react-tmi";
import "./tmi.css";
import environnement from "../../.env/env";
import { Table } from "react-materialize";

class TMIJoinLeftChannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewer: [] };
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
  }
  componentWillMount() {
    this.client.connect();
    this.listenChat();
    this.listenJoinerLeft();
  }
  componentWillUnmount() {
    this.client.disconnect();
  }
  handleCommand(viewer) {
    if (viewer.message.trim().substring(0, 1) === "!") {
      switch (
        viewer.message
          .trim()
          .substring(1, viewer.message.trim().indexOf(" "))
          .toLowerCase()
      ) {
        case "fortnite":
          var increment = {
            from: "masterkill",
            username: viewer.username,
            vote: viewer.message
              .trim()
              .substring(viewer.message.trim().indexOf(" ") + 1)
          };
          this.fillMasterkillTab(increment);
          // this.notifVote(increment);
          return increment;
          // return 'welcome in Masterkill'
          break;
        default:
          return false;
      }
    } else return "Commande inconnue from if";
  }
  listenChat() {
    this.client.on("chat", (channel, userstate, message, self) => {
      const viewer = {
        username: userstate.username,
        message: message
      };
      this.handleCommand(viewer);
    });
  }
  listenJoinerLeft() {
    var that = this;
    this.client.on("join", (channel, username, self) => {
      console.log("join:", channel + " " + username);
      var new_viewer = {};
      var value_property = {
        nameIngame: null,
        isSub: false,
        isAvailable: false,
        countGame: 0
      };
      Object.defineProperty(new_viewer, username, {
        writable: true,
        value: value_property
      });

      //   console.log("new_viewer:", new_viewer);
      var ViewersTab = that.state.viewer.slice();
      ViewersTab.indexOf(new_viewer) === -1
        ? ViewersTab.push(new_viewer)
        : null;
      this.setState({ viewer: ViewersTab });
    });
    this.client.on("part", (channel, username, self) => {
      console.log("part:", channel + " " + username);
    });
  }
  render() {
    const listViewers = this.state.viewer.map((elt, index) => {
      <Table>
        <thead>
          <th>Status Twitch</th>
          <th>Pseudo Twitch</th>
          <th>Pseudo IG</th>
          <th>Disponibilité</th>
          <th>Compteur Game</th>
        </thead>
        <tbody>
          <tr>
            <td>{elt.isSub}</td>
            <td>{elt.value}</td>
            <td>{elt.nameIngame}</td>
            <td>{elt.isAvailable}</td>
            <td>{elt.countGame}</td>
          </tr>
        </tbody>
      </Table>;
    });
    return(
 <div>{listViewers}</div>
    )
  }
}
// export default TMIJoinLeftChannel;
