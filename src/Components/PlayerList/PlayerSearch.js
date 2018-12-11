import React from "react";
import {
  Input,
  Autocomplete
} from "react-materialize";
class PlayerSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        autoCompleteList:{},
        playersList:[],
        playersDisplay:[]

}
    this.SearchPlayer = this.SearchPlayer.bind(this);
    // this.Autocomplete = this.Autocomplete.bind(this);
  }
  componentWillReceiveProps(newProps){
    this.state.playersList=newProps.fromPlayerList;
  }
  componentDidUpdate(previousProps, previousState){
    // console.log("PlayerSearch.js componentDidUpdate!");
  }
/*   updateAutoCompletePlayerList(source) {
    console.log("updateAutoCompletePlayerList from " + source);
    this.newList = {};
    this.state.playersList.map(player => (this.newList[player.name] = null));
    this.setState({ autoCompleteList: this.newList });
  } */
  SearchPlayer = e => {
    // console.log("e.target.value from handleSearchPlayer:", e.target.value);
    // console.log("saise d'un mot");
    var updatedList = this.state.playersList;
    //if not clicking autocomplete
    // if (typeof e.target.value !== "undefined") {
    if (e.target.value !== "") {
      updatedList = updatedList.filter(player => {
        return (
          player.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1
        );
      });
      // console.log("updatedList from searchplayer:",updatedList);
      this.setState({ playersDisplay: updatedList });
      this.props.onSearchPlayer(updatedList);
    }else this.props.onSearchPlayer(updatedList)
  };
/*   Autocomplete = value => {
    console.log("value from handleAutocomplete:", value);
    var updatedList = this.state.playersList;
    var updatedList = updatedList.filter(player => {
      return player.name.toLowerCase() === value.toLowerCase();
    });
    this.setState({ playersDisplay: updatedList });
    // this.props.onSearchPlayer(this.state.playersDisplay);
  }; */
  render(){
    return(
        <Autocomplete
              s={6}
              title="Search Player"
              data={this.state.autoCompleteList}
              onChange={this.SearchPlayer}
              // onAutocomplete={this.Autocomplete}
            />
    )

    
  }
}
export default PlayerSearch;