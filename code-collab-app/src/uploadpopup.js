import React from 'react';  
import './App.css';
import { Button, ButtonGroup } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

class Popup extends React.Component {
  constructor(props){
    super(props);
    
    this.file_reader = new FileReader();
    this.file_name = "Choose a file..."
  }

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
    this.file_name = event.target.files[0].name;
  };

  handleFileRead = (e) => {
    let divider = "\n--------------------------------------------------------------\n";
    let file_content = this.file_reader.result.split(divider);
    let data = [];
    for(let i = 0; i < file_content.length; i++) {
      data.push(file_content[i]);
    }

    // Create a new session with the filename
    this.props.peer.create_new_session(this.state.selectedFile.name.split('.')[0], data);
    this.props.history.push({pathname: '/editor'});
  };

  onClickHandler = () => {
    this.file_reader.onloadend = this.handleFileRead;
    this.file_reader.readAsText(this.state.selectedFile);
  };

  render() {  
    return (  
      <div className='popup'>  
        <div className='popup_inner'>  
          <h3>Upload Document</h3>
          <div className="input-div">
           <input type="file" name="file" id="file" onChange={this.onChangeHandler}/>
          </div>
          <Button onClick={this.onClickHandler} variant='dark'>Upload</Button>{'  '}
          <Button onClick={this.props.closePopup} variant="dark">Close</Button>
        </div>  
      </div>
    );  
  }  
}  

export default inject('peer_data')(observer(Popup));