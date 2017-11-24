// react
import React, { Component } from 'react';

// bootstrap
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

// additional imports
import './MainWindow.css';

// electron
const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

class MainWindow extends Component {
  constructor(props) {
    super(props)
    
    // set the initial component state
    this.state = {
      url: '',
      log: []
    }

    // listen for 'log' events from main process
    ipcRenderer.on('log', (event, entry) => {
      const newLog = this.state.log.slice(0);
      newLog.unshift(entry);
      this.setState(Object.assign({}, this.state, {
        log: newLog
      }))
    });

    ipcRenderer.on('server-address', (event, address) => {
      // Replace the existing state with a copy of one with something changed
      this.setState(Object.assign({} , this.state, {
        url: address
      }))
    }) 
  }

  render() {
    return (
    <div>
      <header className="mw-header">{this.state.log.length} requests on:<span className="mw-header-link" onClick={ (e) => this.openURL() }>{this.state.url}</span> </header>
      <div className="mw-table-container">
      <Table className="mw-log-table" responsive striped bordered hover>
        <thead>
          <tr>
            <th className="mw-time-col">Time</th>
            <th>Code</th>
            <th>Url</th>
          </tr>
        </thead>
        <tbody>
          { this.state.log.map((row, index) => 
            <tr key={index}>
              <td>{row.time}</td>
              <td>{row.status}</td>
              <td>{row.url}</td>
            </tr>
          )}
        </tbody>
      </Table>
      </div>
    </div>
    );
  }

  componentWillMount() {
    ipcRenderer.send('get-server-address')
  }

  openURL() {
    electron.shell.openExternal(this.state.url)
  }
}

export default MainWindow;
