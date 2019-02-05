const devices = [];

const pTimeout = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        devices['key'] = 'value1';
        resolve(devices);
    }, 0);    
});


const main = async () => {
    const ret = await pTimeout();
    console.log(devices === ret);
    devices['key'] = 'value2';
    console.log(devices);
    return [1, 2, 3];
};


main().then((arr) => console.log(arr));

