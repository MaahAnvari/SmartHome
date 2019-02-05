import Kuzzle from 'kuzzle-sdk/dist/kuzzle';
import { Actions } from 'react-native-router-flux';

const subscribe = ({ token, house, username }) => {
  const kuzzle = new Kuzzle('192.168.1.121', {});
  // const kuzzle = new Kuzzle('172.20.10.5', {}); 
  const str = 'activeHouse.';
  const filters = { exists: str.concat(house) };
  kuzzle.setJwtToken(token.jwt);
  kuzzle
    .collection('devices', 'brightness')
    .subscribe(filters, (error, notification) => {
        console.log('new subsctibe');
        if (error) {
            console.log('new subscribe error', error);
          throw error;
        }
        if (Actions.currentScene === 'deviceList') {
            // console.log(notification);
            Actions.deviceList({ type: 'reset', house });
          }
      })
      .onDone((error, room) => {
        if (error) {
          console.log(room);
          throw error;
        }
    });
};

export default subscribe;
