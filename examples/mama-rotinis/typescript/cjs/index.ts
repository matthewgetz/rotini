#!/usr/bin/env node

import { rotini, Definition, Configuration } from '../../../../build';

const definition: Definition = {
  name: 'rfe',
  description: "Mama Rotini's Pizzeria",
  version: '1.0.0',
  commands: [
    {
      name: 'order',
      description: 'order items',
      arguments: [
        {
          name: 'amount',
          description: 'the amount of items to order',
          type: 'number',
          variant: 'value',
          validator: (value: number) => {
            if (value > 10) {
              throw new Error("Mama Rotini's can only place orders of 10 items at a time.");
            }
          }
        },
        {
          name: 'size',
          description: 'the size of the items to order',
          type: 'string',
          variant: 'value',
          values: ['small', 'medium', 'large']
        }
      ],
      commands: [
        {
          name: 'pizza',
          aliases: ['pizzas'],
          description: 'order pizzas'
        },
        {
          name: 'hoagie',
          aliases: ['hoagies'],
          description: 'order hoagies'
        },
        {
          name: 'wings',
          description: 'order wings'
        },
      ],
    },
  ],
  global_flags: [
    {
      name: 'output',
      description: 'specify the output format for command operation results',
      short_key: 'o',
      long_key: 'output',
      variant: 'value',
      type: 'string',
      values: ['json', 'text'],
      default: 'text'
    }
  ]
};

const configuration: Configuration = {
  strict_commands: true,
  strict_flags: true,
  strict_usage: false,
  strict_mode: false,
};

void (async (): Promise<void> => {
  const { results } = await rotini({ definition, configuration }).run();
  results?.handler_result && console.info(results.handler_result);
})();
