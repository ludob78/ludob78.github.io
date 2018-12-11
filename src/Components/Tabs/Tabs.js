import React from 'react';
import './Tabs.css';
// import environnement from "../../.env/env";
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import Masterkill from '../Masterkill/Masterkill';
import ScoreToDonate from '../Score2donate/ScoreToDonate';
import Rightkill from '../Rightkill/Rightkill';
// import Offending from '../Offending/Offending';
import PlayerList from '../PlayerList/PlayerList';
import firebase from '../../Services/Firebase/firebase';
import ViewerGaming from '../ViewerGaming/ViewerGaming';
import Donation from '../Donation/Donation';
// import fortnite_api from "fortnite-api";

function TabContainer({ children, dir }) {

  return (
    <Typography component="div" dir={dir}
      style={{
        padding: 8 * 3,
        backgroundColor: "#222",
      //  height:"100%",
        fontFamily: 'Burbank',
        textAlign: "left",
        color: "yellow",
        fontSize: "large",
      }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};
// const initialStyle: React.CSSProperties = { fontWeight: 'initial' };
const styles = theme => ({
  root: {
    // flexGrow: 1,
    // marginTop: theme.spacing.unit * 3,
    // backgroundColor: theme.palette.background.paper,
    // fontFamily:'Burbank',
    // backgroundColor: theme.palette.background.black,
    // width: 600,
    height:"85%"
  }
});
/* const fortnite = new fortnite_api([
  environnement.API_FN.Username_FN,
  environnement.API_FN.Password_FN,
  environnement.API_FN.ClientLauncherToken,
  environnement.API_FN.FNClientToken
],
  {
    debug: true
  }) */
class FullWidthTabs extends React.Component {
  state = {
    value: 0,
    ref: {},
    ref_fn: {},
    isSignedIn: false,
    userProfile: null,
    playersList:[],
    
    someData:{},
  };
  componentDidMount() {
    console.log("Tabs.js componentDidMount!");
    // Updating the `someData` local state attribute when the Firebase Realtime Database data
    // under the '/someData' path changes.
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      console.log("firebase auth:",user)
      this.setState({ isSignedIn: !!user, userProfile: user });
    });
    this.firebaseRef = firebase.database().ref('/subscriber');
    this.firebaseCallback = this.firebaseRef.on('value', (snap) => {
      this.setState({ someData: snap.val() });
      console.log(snap)
    });
    /**
     * Connexion API fortnite
     */
/*     fortnite.login().then(() => {
      fortnite.getStatsBR("TontonBarjoTV", "pc")
        .then(stats => {
          console.log("stats:" + stats)
          this.fortnite
            .killSession()
            .then(() => {
              return true;
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    }).catch(err => {
      console.log(err);
    }) */
    /**
     *  Fin Connexion API fortnite
     */
  }
  
  componentWillUpdate(nextProps,nextState){
    console.log("Tabs.js componentWillUpdate!")
    // console.log("Tabs.js componentWillUpdate nextState.players:",nextState.players);
// console.log("Tabs.js componentWillUpdate this.state.players:",this.state.players);
// console.log("nextProps from tabs:",nextProps);
// console.log("this.props from tabs:",this.props);

}
  componentDidUpdate(prevProps,previousState){
    console.log("Tabs.js componentDidUpdate!")
        // console.log("Tabs.js componentDidUpdate previousState.players:",previousState.players);
    // console.log("Tabs.js componentDidUpdate this.state.players:",this.state.players);
    // console.log("prevProps from tabs:",prevProps);
    // console.log("this.props from tabs:",this.props);
  
  }
  componentWillUnmount() {
    // Un-register the listener on '/someData'.
    this.unregisterAuthObserver();
    this.firebaseRef.off('value', this.firebaseCallback);
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };
  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  handlePlayerList=PlayersList =>{
    console.log("PlayerList in tabs",PlayersList)
    this.setState({playersList:PlayersList})
  }
  render() {
    const { classes, theme } = this.props;
    console.log("Tabs.js render!")
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs value={this.state.value} onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
            // style={{height:"100%"}}
            centered>
            <Tab style={{ fontFamily: 'Burbank' }} label="Vierwer Game" />
            {/* <Tab style={{ fontFamily: 'Burbank' }} label="Masterkill" /> */}
            <Tab style={{ fontFamily: 'Burbank' }} label="Score2Donate" />
            {/* <Tab style={{ fontFamily: 'Burbank' }} label="Offending" /> */}
            <Tab style={{ fontFamily: 'Burbank' }} label="Rightkill" />
            <Tab style={{ fontFamily: 'Burbank', backgroundColor: "pink" }} label="Donation" />
            <Tab style={{ fontFamily: 'Burbank', backgroundColor: "pink" }} label="My PlayerList" />
            <Tab style={{ fontFamily: 'Burbank', backgroundColor: "pink" }} label="My Stats" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          style={{height:"100%"}}
        >
          <TabContainer dir={theme.direction} style={{height:"100%"}}><ViewerGaming /></TabContainer>
          {/* <TabContainer dir={theme.direction} style={{height:"100%"}}><Masterkill onLoadingPlayersList={this.state.playersList}></Masterkill></TabContainer> */}
          <TabContainer dir={theme.direction}><ScoreToDonate></ScoreToDonate>
          </TabContainer>
          {/* <TabContainer dir={theme.direction}><Offending></Offending></TabContainer> */}
          <TabContainer dir={theme.direction}><Rightkill onLoadingPlayersList={this.state.playersList}></Rightkill></TabContainer>
          <TabContainer dir={theme.direction}><Donation/></TabContainer>
          <TabContainer dir={theme.direction}><PlayerList onUpdatePlayersList={this.handlePlayerList}/></TabContainer>
          <TabContainer dir={theme.direction}>My Stats</TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}
FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);
