import React from "react";
import ReactCountdownClock from "react-countdown-clock";
import { Row, Col, Input } from "react-materialize";
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.initialSeconds = 1;
    this.state = {
      SecondsSet: null,
      Seconds:
        this.props.seconds !== null ? this.props.seconds : this.initialSeconds,
      isTimerRunning: false,
      isTimerPaused: true
    };
    this.startTimer = this.startTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.completeCounter = this.completeCounter.bind(this);
    // this.onClickTimer=this.onClickTimer.bind(this)
    this.handleSecondsFilled = this.handleSecondsFilled.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.seconds !== this.state.Seconds && newProps.seconds !== null) {
      this.setState({ Seconds: newProps.seconds });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //update props timer paused
    if (prevState.isTimerPaused !== this.state.isTimerPaused) {
      this.props.onTimerPaused(this.state.isTimerPaused);
    }
    /*if(prevState.SecondsSet!== this.state.SecondsSet){
      this.props.onResetTimer(this.state.SecondsSet);
    } */
  }

  startTimer() {
    this.setState(prevState => ({
      isTimerPaused: !prevState.isTimerPaused,
      isTimerRunning: true
      // Seconds:this.state.Seconds
    }));
  }
  resetTimer() {
    // if(this.state.Seconds!==0){
    this.setState({ Seconds: 0, isTimerRunning: true, isTimerPaused: true });
    // }
    this.props.onResetTimer(this.state.SecondsSet);
  }
  /*   getNewSeconds(){
       //Note: This library only restart timer when we supply different seconds
       if(this.props.seconds !== this.state.seconds) {
        return this.props.seconds;
      }else {
        return this.props.seconds + 0.0000001;
      }
  } */
  completeCounter() {
    // console.log("fin timer");
    this.setState({
      Seconds: 0,
      isTimerPaused: true,
      isTimerRunning: false
    });
  }
  handleSecondsFilled(event) {
    console.log("handleSecondsFilled from timer:", event.target.value);
    // this.initialSeconds=event.target.value
    this.setState({
      Seconds: parseInt(event.target.value),
      SecondsSet: parseInt(event.target.value),
      isTimerRunning: true,
      isTimerPaused: true
    });
    // this.props.onResetTimer(event.target.value)
  }
  handleInputTimer(event) {
    event.preventDefault();
  }
  render() {
    return (
      <div>
        <Row>
          {/* <Timer /> */}
          <Col s={12}>
            <form onSubmit={this.handleInputTimer}>
              <Col s={6}>
                <Input
                  // pattern="[0-9]"
                  type="text"
                  label="Secondes"
                  onChange={this.handleSecondsFilled}
                />
              </Col>
              <Col s={3}>
                <button
                  type="submit"
                  disabled={this.state.Seconds === 0 ? true : false}
                  onClick={this.startTimer}
                  className={this.state.isTimerPaused ? "green" : "orange"}
                >
                  {" "}
                  {this.state.isTimerPaused ? "Start" : "Pause"}
                </button>
              </Col>
              <Col s={3}>
                <button
                  disabled={this.state.isTimerPaused ? false : true}
                  onClick={this.resetTimer}
                  className={this.state.isTimerPaused ? "purple" : null}
                >
                  {" "}
                  Reset
                </button>
              </Col>
              <Col s={12}>
                <ReactCountdownClock
                  seconds={this.state.Seconds}
                  paused={this.state.isTimerPaused}
                  showMilliseconds={true}
                  color={
                    this.state.isTimerPaused && this.state.isTimerRunning
                      ? "orange"
                      : "yellow"
                  }
                  alpha={0.9}
                  size={300}
                  onComplete={this.completeCounter}
                  onClick={this.onClickTimer}
                  pausedText={
                    this.state.isTimerRunning ? "Vote suspendu" : null
                  }
                  fontSize={
                    this.state.isTimerPaused && this.state.isTimerRunning
                      ? "20px"
                      : "70px"
                  }
                />
              </Col>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Timer;
