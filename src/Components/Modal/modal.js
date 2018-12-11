import React from 'react';
import {
    Row,
    Col,
    Table,
    Modal,
    Button
  } from "react-materialize";
  
class ModalComponent extends React.Component{
componentWillReceiveProps(newProps){
    this.state.contentModal=newProps.contentModal;
}

    constructor(props){
        super(props)
        this.state={
            titleHeaderModal:this.props.titleHeaderModal?this.props.titleHeaderModal:null,
            titleButton:this.props.titleButton?this.props.titleButton:"button",
            contentModal:null,
        }
    }
    render(){
        return(
            <div>
                <Modal
  header={this.state.titleHeaderModal}
  fixedFooter
  trigger={<Button>{this.state.titleButton}</Button>}>
 {this.state.contentModal}</Modal>
            </div>
        )
    }
}
export default ModalComponent