import React from "react";
import "./PlayerCollection.css";
import {
  Row,
  Col,
  Input,
  Table,
  Button,
  Autocomplete
} from "react-materialize";
const colorPlayerName={
  active:{color:"aqua"},inactive:{color:"grey"}
}

const windowHeight=window.screen.height;
class PlayerCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playersList: [],
      playersDisplay: []
    };
    this.activePlayer = this.activePlayer.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.changeTeam = this.changeTeam.bind(this);
    this.colorPlayerN={color:"grey"};
    console.log("windowHeight:",windowHeight)

  }

  componentWillReceiveProps(newProps) {
    console.log("PlayerCollections.js newProps:", newProps.fromDisplayList);
    this.setState({
      playersDisplay: newProps.fromDisplayList,
      playersList: newProps.fromPlayersList
    });
  }
  componentDidUpdate(previousProps, previousState) {
    console.log("PlayerList.js componentDidUpdate!");
    /*   if (previousState.playersDisplay !== this.state.playersDisplay) {
     } */
  }
  /* checkIdNumber(id) {
    if (isNaN(id)) {
      return 0;
    }
    return id;
  } */
  activePlayer(playerActivated) {
    var i = this.state.playersList.indexOf(playerActivated);
    console.log("PlayerCollections.js i in activePlayer:", i);
    // clone state
    let clone = this.state.playersList.slice();
    // edit clone
    clone[i].disabled = !this.state.playersList[i].disabled;
    // update state with clone
    this.setState({ playersList: clone });
    this.props.onActivePlayer(this.state.playersList);

    this.state.playersList[i].disabled===true?this.colorPlayerN=colorPlayerName.inactive:this.colorPlayerN=colorPlayerName.active;
  }
  changeTeam(playerChangingTeam, e) {
    var i = this.state.playersList.indexOf(playerChangingTeam);
    // clone state
    let clone = this.state.playersList.slice();
    // edit clone
    clone[i].team = e.target.value;
    // update state with clone
    this.setState({ playersList: clone });
    this.props.onChangeTeam(this.state.playersList);
  }
  handleDelete(playerDeleted) {
    // console.log("handleDelete")
    var i = this.state.playersList.indexOf(playerDeleted);
    // clone state
    var clone = this.state.playersList.slice();
    // delete index from clone array
    clone.splice(i, 1);
    // replace state
    this.setState({ playersList: clone });
    //send clone and not state because update
    this.props.onDeletePlayer(clone);
  }
  render() {
    /* console.log(
      "PlayerCollections.js this.props.onDisplayList:",
      this.props.fromDisplayList
    ); */
    const listDisplay = this.props.fromDisplayList
    .sort((a,b)=>{
      return b.name-a.name
    })
    .map((player, index) => (
     <tr key={player.name}>
        <td className="center-content">
          <Input
            // issue to assign index 0 to id of input
            id={player.name}
            name={player.name + "_team"}
            type="checkbox"
            //checked error on active player on search, catch state directly in playerlist with disabled status
            checked={!this.state.playersList[index].disabled}
            label="Active"
            className="filled-in"
            onChange={() => this.activePlayer(player)}
          />
        </td>
        {
          !this.state.playersList[index].disabled
          ?(<td style={colorPlayerName.active}>{player.name}</td>)
          :(<td style={colorPlayerName.inactive}>{player.name}</td>)
          }
        
        <td
          className="center-content"
          // style={contentTableStyle}
        >
          <Input
            id={player.name}
            disabled={player.disabled}
            type="select"
            label="Team Select"
            defaultValue={this.state.playersList[index].team}
            // onChange={this.changeTeam}
            onChange={e => this.changeTeam(player, e)}
          >
            <option value="0">Unknown</option>
            <option value="1">Team 1</option>
            <option value="2">Team 2</option>
            <option value="3">Team 3</option>
            <option value="4">Team 4</option>
            <option value="5">Team 5</option>
            <option value="6">Team 6</option>
            <option value="7">Team 7</option>
            <option value="8">Team 8</option>
            <option value="9">Team 9</option>
            <option value="10">Team 10</option>
          </Input>
        </td>

        <td>
          <Button
            // style={{position:"relative",right:"0",bottom: '0', right: '24px',paddingTop:"0"}} 
            disabled={!player.disabled}
            icon='delete'
            fab="horizontal"
            large
            floating
            id={index}
            fabClickOnly
            //don't use icon because issue on click icon tag( with handle delete)
            // icon="delete"
            
            className="red"
          >
            <Button type="submit" floating icon='done' className='green' onClick={() => this.handleDelete(player)}/>
           
          </Button>
        </td>
      </tr>
    ));
    return <tbody>{listDisplay}</tbody>;
  }
}
export default PlayerCollection;
