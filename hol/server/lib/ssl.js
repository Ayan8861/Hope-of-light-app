// TLS options for hosted MySQL (Aiven, TiDB Cloud, etc.). Local MySQL needs none.
//   DB_SSL=true                      turn TLS on
//   DB_SSL_CA_FILE=certs/ca.pem      optional CA certificate (Aiven needs it), path relative to /server
const fs = require('fs');
const path = require('path');

module.exports = function sslOptions() {
  if (process.env.DB_SSL !== 'true') return undefined;
  const opts = { minVersion: 'TLSv1.2' };
  if (process.env.DB_SSL_CA_FILE) {
    opts.ca = fs.readFileSync(path.resolve(__dirname, '..', process.env.DB_SSL_CA_FILE), 'utf8');
  }
  return opts;
};
