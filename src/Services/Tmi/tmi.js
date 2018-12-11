import React from "react";
import Tmi from "react-tmi";
import "./tmi.css";
import environnement from "../../.env/env";
import { Col, Table } from "react-materialize";
class TMI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // viewer: [],
      // isTimerPaused: true
      // isTimerRunning:false,
      voters: this.props.VotersList ? this.props.VotersList : [],
      MasterkillTab: [],
      RightkillTab: []
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

    console.log("Tmi constructor");
    // this.client.connect();
  }
  componentWillMount() {
    this.client.connect();
    /* Array.prototype.lastEltOfArr = function() {
      return this.filter(function(value, index, self) {
        return self.pop();
        // return self.indexOf(value) === index;
      });
    }; */
  }
  listenChat() {
    var that = this;
    this.client.on("chat", function(channel, user, message, self) {
      //  console.log(user["username"] + ":", message);

      var newVote = [];
      const viewer = {
        username: user["username"],
        message: message
      };
      var isCorrectVote = that.handleVoteCommand(viewer);
      if (isCorrectVote) {
        newVote.push(isCorrectVote);
        var newVoteArray = that.state.voters.concat(newVote);
        that.setState({ voters: newVoteArray });
        // that.fillMasterkillTab(newVoteArray)
      } else that.notifVote(user["username"], isCorrectVote);
    });
  }
  fillMasterkillTab(voteMasterkill) {
    console.log("voteMasterkill:", voteMasterkill);
/*     {
      from: "Masterkill",
      username: viewer.username,
      vote: viewer.message
        .trim()
        .substring(viewer.message.trim().indexOf(" ") + 1)
    }; */
    var MasterkillVote = [
      // { joueur1: [{ vote: x }, { voter: [] }] },
      // { joueur2: [{ vote: x }, { voter: [] }] },

    ];
    var clone=this.state.MasterkillTab.slice();
    clone.indexOf(voteMasterkill.vote)===-1?clone.push(voteMasterkill):null;

    this.setState({MasterkillTab:clone})
  }
  notifVote(username, voteObj) {
    if (!voteObj) {
      this.client.whisper(
        username,
        "Your vote command is incorrect, let's try again"
      );
    } else
      this.client.whisper(
        voteObj.username,
        "We correctly recorded your vote for " +
          voteObj.from +
          " with vote:" +
          voteObj.vote
      );
  }
  handleVoteCommand(viewer) {
    if (viewer.message.trim().substring(0, 1) === "!") {
      switch (
        viewer.message.trim().substring(1, viewer.message.trim().indexOf(" ")).toLowerCase()
      ) {
        case "masterkill":
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
        case "rightkill":
          var increment = {
            from: "rightkill",
            username: viewer.username,
            vote: viewer.message
              .trim()
              .substring(viewer.message.trim().indexOf(" ") + 1)
          };
          // this.notifVote(increment);
          return increment;
          // return 'welcome in Rightkill'
          break;
        default:
          return false;
      }
    } else return "Commande inconnue from if";
    // console.log("voteViewer:",voteViewer)
  }
  componentDidMount() {
    this.listenChat();
  }
  componentWillUnmount() {
    this.props.onUpdateVoterList(this.state.voters);
    this.client.disconnect();
  }
  componentWillReceiveProps(newProps) {
    // this.setState({ isTimerPaused: newProps.isTimerPaused });
  }
  /*   shouldComponentUpdate(nextProps,nextState){
    if(nextState.isTimerPaused===true){
      return false;
    }else return true;
  } */

  componentWillUpdate() {}

  componentDidUpdate() {}

  render() {
    const listVoterMasterkill = this.state.voters
      .filter((elt, index) => {
        console.log("elt:", elt);
        return elt.from === "masterkill";
      }).sort((a,b)=>{
        //sort by descending with table index
        return this.state.voters.indexOf(b)-this.state.voters.indexOf(a);
      })
      .map((viewer, index) => (
        <tr key={index}>
          <td>{viewer.username}</td>
          <td>{viewer.vote}</td>
        </tr>
      ))
    /*    this.state.voters.map((viewer, index) => (
      <tr key={index}>
        <td>{viewer.username}</td>
        <td>{viewer.vote}</td>
      </tr>
    )); */

    return <tbody>{listVoterMasterkill}</tbody>;
  }
}
export default TMI;
