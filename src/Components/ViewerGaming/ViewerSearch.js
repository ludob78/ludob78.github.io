import React from "react";
import update from "react-addons-update";
import "./ViewerGaming.css";
import environnement from "../../.env/env";
import { Input, Autocomplete } from "react-materialize";

class ViewerSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewersList: [] };
    this.SearchViewer=this.SearchViewer.bind(this);
  }
  componentWillReceiveProps(newProps) {
    this.state.viewersList = newProps.ViewerList;
  }
  SearchViewer = e => {
    // console.log("e.target.value from handleSearchPlayer:", e.target.value);
    // console.log("saise d'un mot");
    var updatedList = this.state.viewersList;
    //if not clicking autocomplete
    // if (typeof e.target.value !== "undefined") {
    if (e.target.value !== "" 
    // && updatedList!==undefined
  ) {
      updatedList = updatedList.filter(user => {
        return (
            user.TwitchName.toLowerCase().search(e.target.value.toLowerCase()) !== -1
        );
      });
      console.log("updatedList from searchplayer:",updatedList);
      // this.setState({ viewersList: updatedList });
      this.props.onSearchViewer(updatedList);
    }else this.props.onSearchViewer(updatedList)
  };
  render() {
    return (
      <Autocomplete
        // s={6}
        title="Search"
        data={this.state.viewersList}
        onChange={this.SearchViewer}
      />
    );
  }
}
export default ViewerSearch;
