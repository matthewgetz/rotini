#!/usr/bin/env node
import { rotini, } from 'rotini';
import { definition, configuration, } from './cli';

void (async (): Promise<void> => {
  const { results, } = await rotini({ definition, configuration, });
  results?.handler_result && console.info(results?.handler_result);
})();
