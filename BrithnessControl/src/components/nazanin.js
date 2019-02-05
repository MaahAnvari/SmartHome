const fetch = async(device, result) => {
    let array = device;
    for (let index = 0; index < Object.values(device).length; index++) {
        array = await kuzzleFetch(array, index, result);
        console.log('async', array);
    } 
    return array;
};

const kuzzleFetch = (device, index, result) => new Promise((resolve, reject) => {
    const array = device;
        //const devarray = Object.values(device);
        //for (let index = 0; index < devarray.length; index++) {
            kuzzle.collection('active_nodes', 'devices')
              .fetchDocument(Object.keys(device)[index], (err, res) => {
                  if (!err) {
                    array[Object.keys(result.content.activeDevices)[index]] = res.content;
                    console.log('kezzle fetch', array, index);
                    resolve(array);
                  } else {
                      reject(err);
                  }
                }
            );
        //} 
        //resolve(array);
});
