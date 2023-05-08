#!/usr/bin/env node
const { rotini, } = require('rotini');
const { definition, configuration, } = require('./cli');

(async () => {
  const { results, } = await rotini({ definition, configuration, });
  results?.handler_result && console.info(results?.handler_result);
})();
