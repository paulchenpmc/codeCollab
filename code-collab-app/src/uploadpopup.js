import React from 'react';  
import './App.css';
import { Button } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

class Popup extends React.Component {
  constructor(props){
    super(props);
    
    this.file_reader = new FileReader();
  }

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  };

  handleFileRead = (e) => {
    let divider = "--------------------------------------------------------------";
    let file_content = this.file_reader.result.split(divider);
    let data = [];
    let regex = /cell[0-9]* /gm;
    for(let i = 0; i < file_content.length; i++) {
      let content = file_content[i].split(regex)[1].replace(/(\r\n|\n|\r)/gm, "");
      data.push(content);
    }
    // this.props.peer.upload_document(data);

    // Create a new session with the filename
    // this.props.peer.create_new_session('New Session');
    // this.props.history.push({pathname: '/editor'});
    // window.location.href = '/editor';
  };

  onClickHandler = () => {
    this.file_reader.onloadend = this.handleFileRead;
    this.file_reader.readAsText(this.state.selectedFile);
  };

  render() {  
    return (  
      <div className='popup'>  
        <div className='popup_inner'>  
          <h1>Upload Document</h1>  
          <input type="file" name="file" onChange={this.onChangeHandler}/>
          <Button onClick={this.onClickHandler} variant='dark'>Upload</Button>
          <Button onClick={this.props.closePopup} variant="dark">Close</Button>
        </div>
      </div>  
    );  
  }  
}  

export default inject('peer_data')(observer(Popup));