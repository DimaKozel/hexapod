var i2c = require('i2c-bus');
var oled = require('oled-rpi-i2c-bus');

var opts = {
  width: 128,
  height: 64,
  address: 0x3C,
  bus: 1,
  driver:"SH1106"
};

var i2cBus = i2c.openSync(opts.bus)
var oled = new oled(i2cBus, opts);

oled.clearDisplay();

// let odEven = 0;
// setInterval(() => {
//   if (odEven === 0) {
//     oled.drawLine(1, 0, 128-1, 0, 255);
//     odEven = 1;
//   } else {
//     oled.clearDisplay();
//     odEven = 0;
//   }
// }, 1000);