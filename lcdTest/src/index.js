const i2c = require('i2c-bus');
const display = require('oled-rpi-i2c-bus');
const font = require('oled-font-pack');

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const networks = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!networks[name]) {
                networks[name] = [];
            }
            networks[name].push(net.address);
        }
    }
}

const HEIGHT = 64;
const WIDTH = 128;

var opts = {
    width: WIDTH,
    height: HEIGHT,
    address: 0x3C,
    bus: 1,
    driver: 'SH1106'
};

try {
    const i2cBus = i2c.openSync(opts.bus);
    var oled = new display(i2cBus, opts);
    oled.clearDisplay(true);

    
    // oled.drawLine(0,0,WIDTH-1,0,1,false);
    // oled.drawLine(0,HEIGHT-1,WIDTH-1,HEIGHT-1,1,false);
    // oled.drawLine(0,0,0,HEIGHT-1,1,false);
    // oled.drawLine(WIDTH-1,0,WIDTH-1,HEIGHT-1,1,false);
    
    setInterval(updateScreen, 1000);
}
catch (err) {
    // Print an error message and terminate the application
    console.log(err);
    process.exit(1);
}


function updateScreen() {
    const timeString = getTimeString();

  oled.setCursor(0, 0);
  oled.writeString(font.oled_5x7, 1, timeString, 1, true);
  oled.setCursor(0, 10);
  oled.writeString(font.oled_5x7, 1, networks.wlan0[0], 1, true);
}

function getTimeString() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
  
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return hour + ":" + min + ":" + sec;
}