var getRules = require('./rules');
var getValues = require('./values');
var util = require('./util');
var config = require('../../../lib/config');
var rulesUtil = require('../../../lib/rules/util');
var properties = rulesUtil.properties;
var proxy = require('../lib/proxy');

var getUploadFiles = rulesUtil.values.getUploadFiles;
var logger = proxy.logger;
var pluginMgr = proxy.pluginMgr;

module.exports = function(req, res) {
  var lastLog = proxy.getLogs(0, 1)[0];
  var lastSvrLog = logger.getLogs(0, 1)[0];

  res.json({
    version: config.version,
    lastLogId: lastLog && lastLog.id,
    lastSvrLogId: lastSvrLog && lastSvrLog.id,
    lastDataId: proxy.getLastDataId(),
    clientId: util.getClientId(),
    clientIp: util.getClientIp(req),
    mrulesClientId: config.mrulesClientId,
    mrulesTime: config.mrulesTime,
    mvaluesClientId: config.mvaluesClientId,
    mvaluesTime: config.mvaluesTime,
    latestVersion: properties.get('latestVersion'),
    server: util.getServerInfo(req),
    uploadFiles: getUploadFiles(),
    rules: getRules(),
    values: getValues(),
    interceptHttpsConnects: !config.multiEnv && properties.get('interceptHttpsConnects'),
    enableHttp2: properties.get('enableHttp2') !== false,
    plugins: pluginMgr.getPlugins(),
    disabledAllRules: properties.get('disabledAllRules'),
    disabledPlugins: properties.get('disabledPlugins') || {},
    disabledPluginsRules: properties.get('disabledPluginsRules') || {},
    disabledAllPlugins: properties.get('disabledAllPlugins'),
    localUIHost: config.localUIHost
  });
};
