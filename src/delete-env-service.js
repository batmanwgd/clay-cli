var path                      = require('path')
 ,  chalk                     = require('chalk')
 ,  rp                        = require('request-promise-native')
 ,  print                     = console.log
 ,  UPDATING_SERVICE_MSG      = chalk.white(`Deleting Environment Variable...\n`)
 ,  SERVICE_UPDATED_MSG       = chalk.white(`Service Updated.`)
 ,  SERVICE_UPDATE_FAILED_MSG = chalk.white(`Service failed to update. Please contact support@clay.run`);

module.exports = function(key) {

  const currentProjectConfig = require(path.resolve(process.cwd(), 'clay-config.json'))
  const USER_NOT_AUTHORIZED_ERR = chalk.white(`Current user is not authorized to create or update services. You are signed as: `)+chalk.red(`${this.credentials.username}\n`)

  console.log(chalk.white(UPDATING_SERVICE_MSG));
  if(!key) {
    console.log(chalk.white(SERVICE_UPDATE_FAILED_MSG));
    process.exit();
  }


  var username = currentProjectConfig.username || this.credentials.username
  var serviceName = `${username}-${currentProjectConfig.serviceName}`
  var listOptions = {
    uri: this.apis.privateVarApi+`/${serviceName}`,
    method: 'GET',
    qs: {
      apiToken: this.credentials.token
    },
    timeout: 0,
    json: true
  }

  rp(listOptions)
  .then((response) => {
    var envVars = response.envVars || {};
    delete envVars[key]
    var requestOptions = {
      uri: this.apis.deployApi,
      method: 'POST',
      body: {
        serviceName: serviceName,
        envVars: envVars,
        apiToken: this.credentials.token
      },
      timeout: 0,
      json: true
    }
    return rp(requestOptions);
  })
  .then((response) => {
    if(response.result == true) {
      var time = new Date();
      print(SERVICE_UPDATED_MSG, time.toLocaleDateString(), time.toLocaleTimeString())
    }
  })
  .catch((err) => {
    if(process.env.CLAY_DEV) console.log(err);
    if(err.statusCode == 401) print(USER_NOT_AUTHORIZED_ERR)
      else print(SERVICE_UPDATE_FAILED_MSG)
  })

}



