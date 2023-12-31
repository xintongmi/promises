/*
 * Write a function WITH NO CALLBACKS that,
 * (1) reads a GitHub username from a `readFilePath`
 *     (the username will be the first line of the file)
 * (2) then, sends a request to the GitHub API for the user's profile
 * (3) then, writes the JSON response of the API to `writeFilePath`
 *
 * HINT: We exported some similar promise-returning functions in previous exercises
 */

const fs = require('fs');
const Promise = require('bluebird');
const readline = require('readline');
let getGitHubProfileAsync =
  require('./promisification.js').getGitHubProfileAsync;

const fetchProfileAndWriteToFile = function (readFilePath, writeFilePath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(readFilePath);
    readStream
      .on('error', (err) => {
        reject(err);
      })
      .on('ready', () => {
        let lineReader = readline.createInterface({
          input: readStream,
        });
        lineReader.on('line', (username) => {
          lineReader.close();
          lineReader.removeAllListeners();
          resolve(username);
        });
      });
  })
    .then(getGitHubProfileAsync)
    .then((profile) =>
      Promise.promisify(fs.writeFile)(writeFilePath, JSON.stringify(profile))
    )
    .catch((err) => console.error(err));
};

// Export these functions so we can test them
module.exports = {
  fetchProfileAndWriteToFile: fetchProfileAndWriteToFile,
};
