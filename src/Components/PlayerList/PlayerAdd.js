import React from "react";
import { Row, Col, Input, Button, Toast } from "react-materialize";
const messageLogOnInput = {
  add: {
    message: "Player added", style: {
      padding: "0 0.75rem 0 0.75rem",
      color: "green",
    }
  },
  alreadyexist: {
    message: "Player already existing", style: {
      padding: "0 0.75rem 0 0.75rem",
      color: "red",
    }
  }
};
class formPlayerList extends React.Component {
  constructor(props) {
    super(props);
    // console.log("formPlayerList.js constructor!")
    this.state = {
      newPlayer: {
      },
      isInputNotFilled: true,
      hidAlreadyUserExist: true,
      playerListFromParent: [],

    };
    this.messageLogInput = null;
    this.styleLogInput = null;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // console.log("formPlayerList.js componentWillMount!")
  }
  componentDidMount() {
    // console.log("formPlayerList.js componentDidMount!")
    // this.updateAutoCompletePlayerList();
  }
  componentWillUpdate() {
    // console.log("PlayerAdd.js componentWillUpdate!")

  }
  componentWillReceiveProps(newProps) {
    this.state.playerListFromParent = newProps.fromPlayerList
    // this.setState({playerList:newProps.fromPlayerList})
  }
  componentDidUpdate() {
    // console.log("PlayerAdd.js componentDidUpdate!")


  }
  componentDidCatch() {
    // console.log("formPlayerList.js componentDidCatch!")

  }

  handleChange(event) {
    this.setState({ newPlayer: {disabled: true,  team: "0", name: event.target.value } });
    // check input empty
    if ((event.target.value !== "")) {
      this.setState({ isInputNotFilled: false })
      if (this.state.playerListFromParent.length > 0) {
        // console.log("this.isUserExist(event.target.value):", this.isUserExist(event.target.value))
        typeof this.isUserExist(event.target.value) === "undefined" ? this.setState({ hidAlreadyUserExist: true, isInputNotFilled: false }) : this.setState({ hidAlreadyUserExist: false, isInputNotFilled: true });
        this.messageLogInput = messageLogOnInput.alreadyexist.message;
        this.styleLogInput = messageLogOnInput.alreadyexist.style;
      }
    }
    // submit only input filled
    else this.setState({ isInputNotFilled: true, hidAlreadyUserExist: true });



  }
  isUserExist(inputUser) {
    var playerFound = this.state.playerListFromParent.find((player) => {
      /*       console.log("player.name.toLowerCase():", player.name.toLowerCase())
            console.log("inputUser.toLowerCase():", inputUser.toLowerCase()) */
      // return object or undefined
      return player.name.toLowerCase() === inputUser.toLowerCase();
    })
    return playerFound;
    // console.log("userFound:", playerFound)
  }
  handleSubmit(event) {
    this.props.onAddPlayer(this.state.newPlayer)
    //
    this.setState({ hidAlreadyUserExist: false, isInputNotFilled: true })
    this.messageLogInput = messageLogOnInput.add.message;
    this.styleLogInput = messageLogOnInput.add.style;
    event.preventDefault();
  }
  render() {

    // console.log("formPlayerList.js render!")
    return (
      <div>
        <Col s={6}>
          <Row>
            <div style={this.styleLogInput} hidden={this.state.hidAlreadyUserExist}>{this.messageLogInput}</div>
          </Row>
          <Row>
            <form onSubmit={this.handleSubmit}>
              <Input
                // offset="s2"
                value={this.state.value}
                onChange={this.handleChange}
                type="text"
                placeholder="Player Name"
                label="Add"
              />
              <Button disabled={this.state.isInputNotFilled} type="submit" className="blue">Add</Button>
            </form>
          </Row>

        </Col>
      </div>
    );
  }
}
export default formPlayerList;
