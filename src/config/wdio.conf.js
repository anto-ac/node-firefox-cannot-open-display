let config = {
  maxInstances: 16,
  specs: [
    "./src/specs/*.js"
  ],
  capabilities: [{
    maxInstances: 8,
    browserName: 'chrome'
  },
  {
    maxInstances: 8,
    browserName: 'firefox',

  }],
  sync: true,
  coloredLogs: true,
  logLevel: "verbose",
  waitforTimeout: 10000,
  connectionRetryTimeout: 75000,
  connectionRetryCount: 3,
  framework: "mocha",
  mochaOpts: {
    ui: "bdd",
    timeout: 150000 // 2.5 mins
  },
  reporters: ["spec", "dot"],
  reporterOptions: {
    writeStandardOutput: true
  },
  before (capabilities, specs) {
    let chai = require("chai");

    global.expect = chai.expect;
    chai.Should();
  }
};

exports.config = config;
