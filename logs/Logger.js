const fsPromises = require('fs/promises');
const fs = require('fs');
const { serializeError } = require('serialize-error');

class Logger {
  constructor(logFileName) {
    this.logFilePath = `${process.cwd()}/logs/${logFileName}.txt`;

    this.createLogFile();
  }

  createLogFile() {
    if (!fs.existsSync(this.logFilePath)) {
      fs.writeFileSync(this.logFilePath, `Logging started at ${new Date().toLocaleString()}`);
    }
  }

  getLogDateTime() {
    return new Date().toLocaleString();
  }

  errorLog(err) {
    const logContent = `Message: ${err.message} \n Stack: ${err.stack}`
    this.log(logContent);
  }

  async resultLog(dataCallback) {
    const logContent = await dataCallback();
    this.log(logContent);
  }

  async log() {
    const log = `\n \n \nLog from: ${this.getLogDateTime()} \n ${logContent}`;

    try {
      await fsPromises.appendFile(this.logFilePath, log);
    } catch (err) {
      console.warn(err);
    }
  }
}

module.exports = Logger;


