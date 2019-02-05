import React from 'react';
import Kuzzle from 'kuzzle-sdk';
import '../style/Subscribe.css';
var counter = 0;

class Subscribe extends React.Component {

  state ={};
  componentWillMount() {
    this.subscribe();
  }

  subscribe() {
    const kuzzle = new Kuzzle('192.168.1.110', {});
    console.log('new subsctibe'); 
    kuzzle
      .collection('devices', 'brightness')
      .subscribe({equals: { id: this.props.device }}, (error, notification) => {
          console.log('new subsctibe2');
          if (error) {
              console.log('new subscribe error', error);
            throw error;
          } 
          console.log('NOTIFICATION:  ', notification);
          
          this.setState({ [counter++]: notification.document.content });
          console.log(this.state);
        })
        .onDone((error, room) => {
          if (error) {
            console.log(room);
            throw error;
          }
      });
  }

  columns () {
    return [
    	{key: 'name', label: 'Name'}
    ];
  }

  render() {
    // console.log('dev', device);
    console.log(this.state);
    return (
      <div className= 'subscribe'>
      <table  className='table'>
        <thead>
          <tr className= 'headerS'>
            <th >Device Updater</th>
            <th>channle1 status </th>
            <th>channle2 status </th>
            <th>channle3 status </th>
            <th>Update at</th>
          </tr>
        </thead>
        <tbody className='body'>{Object.values(this.state).map((item, key) => {
              
                return (
                    <tr key = {key}>
                        <td>{item['_kuzzle_info'].updater}</td>
                        <td>{(item.deviceStatus.c1) ?  'ON': 'OFF'}</td>
                        <td>{(item.deviceStatus.c2) ?  'ON': 'OFF'}</td>
                        <td>{(item.deviceStatus.c3) ?  'ON': 'OFF'}</td>
                        <td>{new Date(item['_kuzzle_info'].updatedAt).toString()}</td>

                    </tr>
                  )
              
              })}
          </tbody>
       </table>
      </div>
    );
  }


}

export default Subscribe;
