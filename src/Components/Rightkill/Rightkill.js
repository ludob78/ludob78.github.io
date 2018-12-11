import React from "react";
import ReactCountdownClock from "../../Services/Timer/timer.js";
import Tmi from "../../Services/Tmi/tmi";
import {
  Row,
  Col,
  Input,
  Table,
  Collapsible,
  CollapsibleItem,
  Tabs,
  Tab
} from "react-materialize";
import Modal from "../Modal/modal";
import { HorizontalBar } from "react-chartjs-2";

class ScoreToDonate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      LabelChar: [],
      isTimerPaused: true,
      secondsTimer: null,
      votersList: []
    };
    this.handleTimerPaused = this.handleTimerPaused.bind(this);
    this.handleResetTimer = this.handleResetTimer.bind(this);
    this.handleVoterList = this.handleVoterList.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    console.log("Masterkill.js componentWillReceiveProps!");
    /*   console.log(
          "Masterkill.js componentWillReceiveProps nextProps.players:",
          nextProps.onLoadingPlayersList
        ); */
    /*    console.log(
          "Masterkill.js componentWillReceiveProps this.props.players:",
          this.props.onLoadingPlayersList
        ); */
    if (nextProps.onLoadingPlayersList !== this.state.players) {
      // if (nextProps.onLoadingPlayersList !== this.props.onLoadingPlayersList) {
      this.setState({ players: nextProps.onLoadingPlayersList });
      this.defineCharLabel(nextProps.onLoadingPlayersList);
    }
  }
  defineCharLabel(playersList) {
    // console.log("playersList from loadPlayerTabForChar :", playersList);
    const LabelChar = [];
    playersList
      .filter((player, index) => {
        return player.disabled === false;
      })
      .map((player, index) => {
        LabelChar.push(player.name);
      });
    this.setState({ LabelChar: LabelChar });
  }
  handleTimerPaused(pauseStatut) {
    // console.log("handleTimerPaused from masterkill:",event)
    this.setState({ isTimerPaused: pauseStatut });
  }
  handleResetTimer(newTimer) {
    // console.log("handleResetTimer from masterkill:",event)
    this.setState({
      votersList: [],
      secondsTimer: newTimer
    });
  }
  handleVoterList(voterList) {
    
    console.log("handleVoterList from masterkill.js:", voterList);
    var voteListSort = voterList.sort((a, b) => {
      return voterList.indexOf(b) - voterList.indexOf(a);
    });
    console.log("handleVoterList 2 from masterkill.js:", voterList);
    console.log("voteListSort from masterkill.js:", voteListSort);
    this.setState({
      votersList: voteListSort.sort((a, b) => {
        return voterList.indexOf(b) - voterList.indexOf(a);
      })
    });
  }
  render() {
    const data = {
      // labels: ["Team1","Team2"],
      labels: this.state.LabelChar,
      datasets: [
        {
          label: "Vote",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: [65, 59]
        }
        /* {
                label: "Player2",
                backgroundColor: "rgba(255,25,132,0.2)",
                borderColor: "rgba(255,25,132,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,25,132,0.4)",
                hoverBorderColor: "rgba(255,25,132,1)",
                data: [65]
              } */
      ]
    };
    const listVoters = this.state.votersList
      .sort((a, b) => {
        return (
          this.state.votersList.indexOf(b) - this.state.votersList.indexOf(a)
        );
      })
      .map((voter, index) => (
        <tr key={index}>
          <td>{voter.username}</td>
          <td>{voter.vote}</td>
        </tr>
      ));
    const listPlayers = this.state.players.map(
      (player, index) =>
        player.disabled === false ? (
          <tr key={index}>
            <td>{player.team}</td>
            <td>{player.name}</td>
            <td>
              <Input
                placeholder="0"
                defaultValue="0"
                s={12}
                // label="Kills number"
              />
            </td>
          </tr>
        ) : (
          <tr key={index}>
            <td />
            <td />
            {/* <td /> */}
            <td />
          </tr>
        )
    );
    return (
      <div className="h">
        <Row>
          <Col s={3}>
            <h3>Rules</h3>
            <Tabs className="z-depth-1">
              {/* <Tab title="#" active /> */}
              <Tab title="Rules" active>
                <ol>
                  <li>
                    Nobody pay with top#1 and if rightkill has not been guessed
                  </li>
                  <li>Any player in team</li>
                  <li>
                    Viewers vote for the right kill's number for one or each
                    player of the team
                  </li>
                  <li>
                    Viewer with correct vote is selected randomly and win
                    sub+kill's number of the player
                  </li>
                  <li>
                    Each resuscitation reduce by 1 your kill to pay (not your
                    kill to guess)
                  </li>
                </ol>
              </Tab>
        {/*       <Tab title="Règles">
                <ol>
                  <li>Les joueurs ne payent pas en cas de top#1</li>
                  <li>4 joueurs en section</li>
                  <li>2 équipes de 2 joueurs</li>
                  <li>
                    Les viewers votent pour le joueur qu'il pense ne pas voir
                    assurer
                  </li>
                  <li>Tirage aléatoire d'un viewer ayant la bonne réponse</li>
                  <li>
                    Le joueur avec le moins de kill paye au viewer gagnant le
                    montant en euros équivalent à la somme de tous les kill de
                    la section pour un sub, si le viewer n'est pas sub, il lui
                    paye juste le sub de sa chaîne.
                  </li>
                  <li>
                    Le vote est lancé uniquement avec un minimum de 5 kills sur
                    l'ensemble de la section
                  </li>
                </ol>
              </Tab> */}
            </Tabs>
            {/* <Collapsible accordion defaultActiveKey={1}>
                  <CollapsibleItem header="Rules">
                    <ol>
                      <li>No player pay with top#1</li>
                      <li>4 players in section</li>
                      <li>2 teams of 2</li>
                      <li>Viewers vote for the worst killer</li>
                      <li>Viewer with correct vote is selected randomly</li>
                      <li>
                        Worst player with less kills pay to the viewer amount equal
                        to sum of his section's kills or a sub if viewer not sub
                      </li>
                      <li>Payment only for 5 kills realized by the team</li>
                    </ol>
                  </CollapsibleItem>
                  <CollapsibleItem header="Règles">
                    <ol>
                      <li>Les joueurs ne payent pas en cas de top#1</li>
                      <li>4 joueurs en section</li>
                      <li>2 équipes de 2 joueurs</li>
                      <li>Les viewers votent pour le joueur qu'il pense ne pas voir assurer</li>
                      <li>Tirage aléatoire d'un viewer ayant la bonne réponse</li>
                      <li>
                        Le joueur avec le moins de kill paye au viewer gagnant le montant en euros équivalent à la somme de tous les kill de la section pour un sub, si le viewer n'est pas sub, il lui paye juste le sub de sa chaîne.
                                       </li>
                      <li>Le vote est lancé uniquement avec un minimum de 5 kills sur l'ensemble de la section</li>
                    </ol>
                  </CollapsibleItem>
                </Collapsible> */}
          </Col>
          <Col s={3}>
            <h3>Chrono</h3>
            <ReactCountdownClock
              seconds={this.state.secondsTimer}
              onResetTimer={this.handleResetTimer}
              onTimerPaused={this.handleTimerPaused}
            />
          </Col>
          <Col s={3}>
            <h3>Vote</h3>
            <Table className="fixHeight">
              <thead>
                <tr>
                  <th>Viewer</th>
                  <th>Vote</th>
                </tr>
              </thead>
              {!this.state.isTimerPaused ? (
                <Tmi
                  //case reload voter list on mount
                  VotersList={this.state.votersList}
                  //case save voterlist from component before unmount
                  onUpdateVoterList={this.handleVoterList}
                />
              ) : (
                <tbody>{listVoters}</tbody>
              )}
            </Table>
          </Col>

          <Col s={3}>
            <h3>Score</h3>
            <HorizontalBar
              data={data}
              options={{
                maintainAspectRatio: true,
                scales: {
                  xAxes: [
                    {
                      gridLines: {
                        offsetGridLines: true
                      },
                      stacked: true
                    }
                  ],
                  yAxes: [
                    {
                      stacked: true
                    }
                  ]
                }
              }}
            />
            <Table>
              <thead>
                <tr>
                  <th>Team</th>
                  <th>Player</th>
                  {/* <th>Vote</th> */}
                  <th>Kill</th>
                </tr>
              </thead>
              <tbody>{listPlayers}</tbody>
              <tfoot>
                <tr>
                  <td colSpan="2">Total</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              </tfoot>
            </Table>
            {/* <button className="black">Winner?</button> */}
            <Modal
              titleHeaderModal="Winner selection"
              titleButton="Winner?"
              contentModal={listVoters}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
export default ScoreToDonate;
