var createAccount   = require('./create-account.js')
 ,  listServices    = require('./list-services.js')
 ,  downloadService = require('./download-service.js')
 ,  whoami          = require('./whoami.js')
 ,  loginAccount    = require('./login-account.js');

function Account(config) {
  this.apis           = config.apis;
  this.credentialsDir = config.credentialsDir;
  this.credentials    = config.credentials;
}

Account.prototype.signup   = createAccount;
Account.prototype.login    = loginAccount;
Account.prototype.list     = listServices;
Account.prototype.download = downloadService;
Account.prototype.whoami   = whoami;

module.exports = Account;
