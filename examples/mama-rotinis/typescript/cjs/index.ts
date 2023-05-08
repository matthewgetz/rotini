#!/usr/bin/env node

import { rotini, Definition, Configuration } from 'rotini';

type Orders = {
  orders: [
    {
      id: number,
      item: 'pizzas' | 'hoagies' | 'wings',
      amount: number
      size: 'small' | 'medium' | 'large'
      type: string
    }
  ]
}

const definition: Definition = {
  name: 'mama-rotinis',
  description: "Mama Rotini's Pizzeria",
  version: '1.0.0',
  configuration_files: [
    {
      id: 'orders',
      directory: './configs',
      file: 'orders.json'
    }
  ],
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
          validator: ({ coerced_value }) => {
            const value = coerced_value as number;
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
          description: 'order pizzas',
          flags: [
            {
              name: 'type',
              description: 'the type of pizza to order',
              variant: 'value',
              type: 'string',
              short_key: 't',
              long_key: 'type',
              required: true,
              default: 'pepperoni',
              values: ['pepperoni', 'veggie']
            }
          ],
          operation: {
            handler: ({ parsed, getConfigurationFile }) => {
              const { getContent, setContent } = getConfigurationFile('orders');
              const current_orders = getContent<Orders>().data?.orders || [];
              const ids = <number[]>current_orders.map(order => order.id);
              const largest_id = ids.length > 0 ? Math.max(...ids) : 0;
              const id = largest_id + 1;
              const [order, pizza] = parsed.commands;
              const { amount, size } = order.arguments;
              const { type } = pizza.flags;
              const new_order = { id, item: 'pizzas', amount, size, type };
              const combined_orders = [...current_orders, new_order];
              setContent({ orders: combined_orders })
              return '🍕'
            }
          }
        },
        {
          name: 'hoagie',
          aliases: ['hoagies'],
          description: 'order hoagies',
          flags: [
            {
              name: 'type',
              description: 'the type of hoagie to order',
              variant: 'value',
              type: 'string',
              short_key: 't',
              long_key: 'type',
              required: true,
              default: 'italian',
              values: ['italian', 'veggie']
            }
          ],
          operation: {
            handler: ({ parsed, getConfigurationFile }) => {
              const { getContent, setContent } = getConfigurationFile('orders');
              const current_orders = getContent<Orders>().data?.orders || [];
              const total_orders = current_orders.length;
              const id = total_orders + 1;
              const [order, hoagie] = parsed.commands;
              const { amount, size } = order.arguments;
              const { type } = hoagie.flags;
              const new_order = { id, item: 'hoagies', amount, size, type };
              const combined_orders = [...current_orders, new_order];
              setContent({ orders: combined_orders })
              return '🥪'
            }
          }
        },
        {
          name: 'wings',
          description: 'order wings',
          flags: [
            {
              name: 'type',
              description: 'the type of wings to order',
              variant: 'value',
              type: 'string',
              short_key: 't',
              long_key: 'type',
              required: true,
              default: 'traditional',
              values: ['traditional', 'boneless']
            }
          ],
          operation: {
            handler: ({ parsed, getConfigurationFile }) => {
              const { getContent, setContent } = getConfigurationFile('orders');
              const current_orders = getContent<Orders>().data?.orders || [];
              const total_orders = current_orders.length;
              const id = total_orders + 1;
              const [order, wings] = parsed.commands;
              const { amount, size } = order.arguments;
              const { type } = wings.flags;
              const new_order = { id, item: 'wings', amount, size, type };
              const combined_orders = [...current_orders, new_order];
              setContent({ orders: combined_orders })
              return '🍗'
            }
          }
        },
      ],
    },
    {
      name: 'list',
      description: 'view all orders or a single order',
      aliases: ['view'],
      deprecated: true,
      commands: [
        {
          name: 'order',
          description: 'the order to view',
          arguments: [
            {
              name: 'id',
              description: 'the id of the order',
              variant: 'value',
              type: 'number'
            }
          ],
          operation: {
            handler: ({ parsed, getConfigurationFile }) => {
              const { getContent } = getConfigurationFile('orders');
              const current_orders = getContent<Orders>().data?.orders || [];
              const [, order] = parsed.commands;
              const { id } = order.arguments;
              const order_data = current_orders.find(order => order.id === id);
              const result = order_data ? JSON.stringify(order_data, null, 2) : `Order #${id} does not exist!`;
              return result;
            }
          }
        },
        {
          name: 'orders',
          description: 'view all orders',
          operation: {
            handler: ({ parsed, getConfigurationFile }) => {
              const { getContent } = getConfigurationFile('orders');
              const current_orders = getContent<Orders>().data?.orders || [];
              return JSON.stringify(current_orders, null, 2);
            }
          }
        }
      ]
    },
    {
      name: 'delete',
      description: 'delete orders',
      commands: [
        {
          name: 'order',
          description: 'the order to delete',
          arguments: [
            {
              name: 'id',
              description: 'the id of the order',
              variant: 'value',
              type: 'number'
            }
          ],
          operation: {
            handler: ({ parsed, getConfigurationFile }) => {
              const { getContent, setContent } = getConfigurationFile('orders');
              const current_orders = getContent<Orders>().data?.orders || [];
              const [, order] = parsed.commands;
              const { id } = order.arguments;
              const other_orders = current_orders.filter(order => order.id !== id);
              setContent({ orders: other_orders });
              return '🚫🍕';
            }
          }
        },
        {
          name: 'orders',
          description: 'delete all orders',
          operation: {
            handler: ({ parsed, getConfigurationFile }) => {
              const {  setContent } = getConfigurationFile('orders');
              setContent({ orders: [] })
              return '🚫🍕';
            }
          }
        },
      ]
    }
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
  strict_help: false,
  strict_mode: true,
};

void (async (): Promise<void> => {
  const { results } = await rotini({ definition, configuration });
  results?.handler_result && console.info(results.handler_result);
})();
