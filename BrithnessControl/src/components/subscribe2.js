import Kuzzle from 'kuzzle-sdk/dist/kuzzle';

const subscribe2 = ({ token, house }) => {
  console.log('subscribe', house);
  const kuzzle = new Kuzzle('192.168.1.121', {});
  // const kuzzle = new Kuzzle('172.20.10.5', {}); 
  const filters = { geoDistance: {
                      location: {
                        lat: house.location.lat,
                        lon: house.location.lon
                      },
                      distance: '500m'
                    }
                  };
  kuzzle.setJwtToken(token.jwt);
  kuzzle
    .collection('users', 'brightness')
    .subscribe(filters, { scope: 'in' }, (error, notification) => {
        console.log('geolocation subscribe');
        console.log(Object.keys(house.activeDevices));
        if (error) {
            console.log('geolocation subscribe error', error);
          throw error;
        } else if (notification) {
          kuzzle.collection('devices', 'brightness')
            .mUpdateDocument(Object.keys(house.activeDevices), { deviceStatus: { c1: true, c2: true, c3: true } }, 
              (err, res) => {
                if (err) {
                  console.log('can not update document');
                } else {
                  console.log('update all document successfully');
                  console.log(res);
                }
              });
        }
      })
      .onDone((error, room) => {
        if (error) {
          console.log('on done geolocatoin room');
          throw error;
        }
    });
};

export default subscribe2;
