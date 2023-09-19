/**
 * This Function Check For Both Null And Empty String in A Json Propertie The Delete The Key Value
 * @param {object} json
 * @returns {object} Reurn a clean version of the object
 */
exports.removeNullOrEmptyValueJson = (json) => {
  for (let key in json) {
    if (json[key] === null || json[key] === '') {
      delete json[key];
    }
  }
  return json;
};

/**
 *
 * @param {Number} length Number of char Required
 * @returns {String} Random String Char
 */
exports.generateOTP = (length) => {
  const digits = '0123456789';
  let otp = '';
  const run = () => {
    for (let i = 1; i <= length; i++) {
      const index = Math.floor(Math.random() * digits.length);
      otp = otp + digits[index];
    }
  };
  run();

  if (otp.length == 0) {
    generateOTP(6);
  }

  return otp;
};

/**
 *
 * @param {Number} length Number of char Required
 * @returns {String} Random String Char
 */
exports.generateRandAplha = (length) => {
  const digits =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let otp = '';
  const run = () => {
    for (let i = 1; i <= length; i++) {
      const index = Math.floor(Math.random() * digits.length);
      otp = otp + digits[index];
    }
  };
  run();

  if (otp.length == 0) {
    generateOTP(6);
  }

  return otp;
};

const admin = require('firebase-admin');
/**
 * 
 * @param {string} token 
 * @param {string} title 
 * @param {string} message 
 * @returns object
 */
exports.sendSingleNotification = async (token, title, message) => {
  const deviceToken = token;
  const payload = {
    notification: {
      title: title,
      body: message
    }
  };
  const value = await admin.messaging().sendToDevice(deviceToken, payload);
  return value;
};

