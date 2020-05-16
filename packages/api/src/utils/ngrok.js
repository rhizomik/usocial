/**
 * Ngrok should solely be used on a development environment for hooks, as a replacement for
 * localhost:3001.
 * For this reason it's lazy loaded and its dependency is listed in devDependencies.
 */
const { sleep } = require('./timeout');

const PORT = process.env.API_PORT || process.env.PORT || 3001;

let instance;
async function host() {
  if (!instance) {
    const ngrok = require('ngrok');
    await ngrok.disconnect();
    instance = await ngrok.connect(PORT).catch(async error => {
      console.log(error);
    });
  }
  return instance;
}

module.exports = {
  host,
};
