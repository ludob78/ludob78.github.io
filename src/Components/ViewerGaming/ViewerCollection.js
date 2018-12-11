import React from "react";
// import update from "react-addons-update";
// import environnement from "../../.env/env";
import { connect } from "react-redux";
import firebase from "../../Services/Firebase/firebase";
import { Input, Row, Col, Table, Button } from "react-materialize";
class ViewerCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewerDisplay: /* this.props.viewerList
        ? this.props.viewerList
        :  */ [
        /* {
              userid: 1,
              TwitchName: "test1",
              isSub: false,
              isReady: false,
              countGame: 0,
              nameIngame: null
            },
            {
              userid: 2,
              TwitchName: "test2",
              isSub: true,
              isReady: true,
              countGame: 0,
              nameIngame: null
            },
            {
              userid: 3,
              TwitchName: "test3",
              isSub: false,
              isReady: true,
              countGame: 0,
              nameIngame: null
            } */
      ]
    };
    this.firebaseRef = firebase
      .database()
      .ref("subscriber")
      .child("tontonbarjo/viewers");
  }
  componentWillReceiveProps(newProps) {
    this.setState({ viewerDisplay: newProps.viewerToDisplay });
  }
  componentDidUpdate(prevProps, prevState) {
    /*     if(prevState.viewer!==this.state.viewer){
      this.props.update
    } */
  }
  activePlayer(playerActivated) {
    var i = this.state.viewerDisplay.indexOf(playerActivated);
    console.log("PlayerCollections.js i in activePlayer:", i);
    // clone state
    let clone = this.state.viewerDisplay.slice();
    // edit clone
    clone[i].available = !this.state.viewerDisplay[i].available;
    // update state with clone
    this.setState({ viewer: clone });
    this.props.onActivePlayer(this.state.viewerDisplay);

    // this.state.viewerDisplay[i].available===true?this.colorPlayerN=colorPlayerName.inactive:this.colorPlayerN=colorPlayerName.active;
  }

  render() {
    const listViewers = this.props.viewerToDisplay
      .sort((a, b) => {
        return (
          b["isReady"] - a["isReady"] ||
          b["isSub"] - a["isSub"] ||
          a["countGame"] - b["countGame"] ||
          a["TwitchName"] - b["TwitchName"]
        );
      })
      .filter(elt => {
        //ne pas afficher Nightbot et TontonBarjo
        return elt.userid !== "207587272" && elt.userid !== "19264788";
      })
      .map((elt, index) => (
        <tr key={elt.TwitchName}>
          {console.log(elt)}
          <td>
            <Input
              // issue to assign index 0 to id of input
              id={elt.TwitchName}
              name={elt.TwitchName}
              type="checkbox"
              //checked error on active player on search, catch state directly in playerlist with available status
              checked={elt.available}
              label="Active"
              className="filled-in"
              onChange={() => this.activePlayer(elt)}
            />
          </td>
          <td>{elt.TwitchName}</td>
          {elt.isReady === true ? (
            <td style={{ color: "green" }}>Ready</td>
          ) : (
            <td style={{ color: "red" }}>Not Ready</td>
          )}
          {elt.isSub === true ? (
            <td style={{ color: "#ba68c8" }}>SUBSCRIBER</td>
          ) : (
            <td style={{ color: "#13b9e2" }}>VIEWER</td>
          )}
          <td>{elt.countGame}</td>
          <td>{elt.nameIngame}</td>
        </tr>
      ));
    return <tbody>{listViewers}</tbody>;
  }
}
const mapStateToProps = state => {
  return {
    viewerDisplay: state.viewerDisplay
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onActivePlayer: () => dispatch({ type: "ToggleActivate" })
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewerCollection);
// export default ViewerCollection;
