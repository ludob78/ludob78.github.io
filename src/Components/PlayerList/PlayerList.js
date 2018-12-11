import React from "react";
import {connect} from 'react-redux';
import "./PlayerList.css";
import {
  Row,
  Col,
  Input,
  Table,
  Button,
  Autocomplete
} from "react-materialize";
import PlayerAdd from "./PlayerAdd";
import PlayerCollection from "./PlayerCollection";
import PlayerSearch from "./PlayerSearch";
// import { stringLength } from "@firebase/util";
class PlayerList extends React.Component {
  constructor(props) {
    super(props);
    console.log("PlayerList.js constructor!");
    this.state = {
      playersList: [],
      playersDisplay: []
    };

    this.handleActivePlayer = this.handleActivePlayer.bind(this);
    this.handleDeletePlayer = this.handleDeletePlayer.bind(this);
    this.handleChangeTeam = this.handleChangeTeam.bind(this);
    this.handleSearchPlayer = this.handleSearchPlayer.bind(this);
  }
  componentWillMount() {
    console.log("PlayerList.js componentWillMount!");
    this.setState({ playersDisplay: this.state.playersList });
  }
  componentDidMount() {
    console.log("PlayerList.js componentDidMount!");
    var source = "componentDidMount";
    this.props.onUpdatePlayersList(this.state.playersList);

    // this.updateAutoCompletePlayerList(source);
  }
  componentWillUpdate(nextProps, nextState) {
    console.log("PlayerList.js componentWillUpdate!");
    //  this.updateAutoCompletePlayerList();
    /*  if(this.state.playersDisplay!==nextState.playersDisplay){
      this.setState({playersDisplay:this.state.playersList})
    } */
  }
  componentDidUpdate(previousProps, previousState) {
    console.log("PlayerList.js componentDidUpdate!");
    if (previousState.playersList !== this.state.playersList) {
      // var source = "componentDidUpdate";
      //Update autocompleteList after state.players update
      // this.updateAutoCompletePlayerList(source);
      // update players list for parent component
      this.props.onUpdatePlayersList(this.state.playersList);
      this.setState({ playersDisplay: this.state.playersList });
    }
  }
  /* componentDidCatch(){
  // console.log("PlayerList.js componentDidCatch!")
} */
  handleAddPlayer = playerAdded => {
    // console.log(playerAdded);
    var NewPlayersList = this.state.playersList.concat(playerAdded).sort();
    this.setState({ playersList: NewPlayersList });
  };
  handleActivePlayer = playerActivate => {
    this.setState({ playersList: playerActivate });
  };
  handleDeletePlayer = playerListAfterRemoved => {
    console.log("PlayersList.js handleDeletePlayer:", playerListAfterRemoved);
    this.setState({
      playersList: playerListAfterRemoved,
      playersDisplay: playerListAfterRemoved
    });
  };
  handleChangeTeam(playerListTeamChanged) {
    // console.log("PlayersList.js handleChangeTeam:", e);
    this.setState({ playersList: playerListTeamChanged });
  }
  handleSearchPlayer(displayListFromSearch) {
    // console.log(displayListFromSearch)
    this.setState({ playersDisplay: displayListFromSearch });
  }
  //correct issue with index 0 of id on first record
  checkIdNumber(id) {
    // console.log("id from checkIdNumber:", id);
    if (isNaN(id)) {
      // if (id.substr(0,4)==="input") {
      return 0;
    }
    return id;
  }
  render() {
    console.log("PlayerList.js render!");
    const headerTableStyle = { color: "red"};
    return (
      <div>
        <Row>
          <Col s={5}>
            <PlayerSearch
              fromPlayerList={this.state.playersList}
              onSearchPlayer={this.handleSearchPlayer}
            />
            <PlayerAdd
              fromPlayerList={this.state.playersList}
              onAddPlayer={this.handleAddPlayer}
            />
          </Col>
          <Col s={7}>
            <Table centered className="table">
              <thead>
                <tr>
                  <th className="center-content" style={headerTableStyle}>Status</th>
                  <th className="center-content" style={headerTableStyle}>Name</th>
                  <th className="center-content" style={headerTableStyle}>Team</th>
                  <th className="center-content" />
                </tr>
              </thead>
              <PlayerCollection
                onDeletePlayer={this.handleDeletePlayer}
                onChangeTeam={this.handleChangeTeam}
                onActivePlayer={this.handleActivePlayer}
                fromDisplayList={this.state.playersDisplay}
                fromPlayersList={this.state.playersList}
              />
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}
/* const mapStateToProps=state=>{
  return {
    playerList:state.playersList
  };
}
export default connect(mapStateToProps)(PlayerList); */
export default PlayerList;
