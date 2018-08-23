const net = require("net");
const request = require("request");

const maxAttempts = 2000;
const msBetweenAttempts = 500;

const numberOfSeleniumNodes = 16;

const service = (host, port) => {
  let attempts = 0;

  const promise = new Promise((resolve, reject) => {
    const tryToConnect = () => {
      const client = net.connect(port, host, () => {
        console.log(`${host}:${port} : is up`);
        resolve();
      });

      client.on("data", () => {
        // don"t care about any data
      });

      client.on("error", () => {
        console.log(`${host}:${port} : failed to connect`);

        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryToConnect, msBetweenAttempts);
        } else {
          reject();
        }
      });
    };

    tryToConnect();
  });

  return promise;
};

// Wait for selenium nodes to have registered with the selenium hub.
// Use a selenium hub api that can provide the number of registered nodes.
// Keep making requests to the api until all of the expected nodes are
// registered (or until we give up).
const seleniumNodesAreRegistered = (host, port, numberOfNodes) => {
  let attempts = 0;

  const promise = new Promise((resolve, reject) => {
    const tryQueryHub = () => {
      const req = request.get(`http://${host}:${port}/grid/api/hub`);

      req.on("response", (response) => {
        response.on("data", (body) => {
          const jsonBody = JSON.parse(body);

          process.stdout.write(`selenium nodes : ${jsonBody.slotCounts.total} of at least ${numberOfNodes} up\n`);

          if (jsonBody.slotCounts.total >= numberOfNodes) {
            resolve();
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(tryQueryHub, msBetweenAttempts);
          } else {
            reject();
          }
        });
      });

      req.on("error", () => {
        process.stdout.write(".");

        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryQueryHub, msBetweenAttempts);
          tryQueryHub();
        } else {
          reject();
        }
      });
    };

    tryQueryHub();
  });

  return promise;
};

let servicesToWaitFor = [
  service("selenium-hub", process.env.PORT_SELENIUM_HUB)
];

// Which Selenium nodes to wait for is decided based on the number of specified browsers
// and the total number of available nodes (based on the number of cpu cores).
"chrome,firefox".split(",").map((browser, _, browsers) => {
  for (let i = 1; i <= numberOfSeleniumNodes / browsers.length; i++) {
    servicesToWaitFor.push(service(`selenium-${browser}-${i}`, process.env.PORT_SELENIUM_NODE));
  }
});

// Wait for all dependent services to be up, to the point where
// a TCP connection can be established.
Promise.all(servicesToWaitFor)
  .then(() => {
    seleniumNodesAreRegistered("selenium-hub", process.env.PORT_SELENIUM_HUB,
      numberOfSeleniumNodes)
      .then(() => {
        console.log("All services are up and ready.");
        process.exit(0);
      });
  })
  .catch(() => {
    // Gave up waiting for at least one service.
    console.log("One or more services failed to become ready.");
    process.exit(1);
  })
;
