#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { rotini, I_ProgramDefinition, I_ProgramConfiguration, } from 'rotini';
const build_1 = require("../../build");
const definition = {
    name: 'tortellini',
    description: 'tortellini cli',
    version: '1.0.0',
    commands: [
        {
            name: 'order',
            description: 'order from the menu',
            arguments: [
                {
                    name: 'amount',
                    description: 'the number of items',
                    type: 'number',
                    variant: 'value',
                },
                {
                    name: 'size',
                    description: 'the size of the item',
                    type: 'string',
                    variant: 'value',
                    values: ['small', 'medium', 'large',],
                },
            ],
            commands: [
                {
                    name: 'pizza',
                    aliases: ['pizzas',],
                    description: 'order pizza',
                    operation: ({ commands, }) => {
                        console.log(JSON.stringify(commands, null, 2));
                    },
                    arguments: [
                        {
                            name: 'type',
                            description: 'the type of pizza',
                            type: 'string',
                            variant: 'value',
                            values: ['cheese', 'pepperoni', 'supreme',],
                        },
                    ],
                    flags: [
                        {
                            name: 'sauce',
                            description: 'the amount of sauce on the pizza',
                            long_key: 'sauce',
                            type: 'string',
                            variant: 'value',
                            values: ['light', 'regular', 'heavy',],
                        },
                        {
                            name: 'well_done',
                            description: 'well done',
                            long_key: 'well-done',
                            type: 'boolean',
                            variant: 'boolean',
                            default: false,
                        },
                    ],
                },
                {
                    name: 'pasta',
                    aliases: ['pastas',],
                    description: 'order pasta',
                    operation: ({ commands, }) => {
                        console.log(JSON.stringify(commands, null, 2));
                    },
                },
                {
                    name: 'salad',
                    aliases: ['salads',],
                    description: 'order salad',
                    operation: ({ commands, }) => {
                        console.log(JSON.stringify(commands, null, 2));
                    },
                },
            ],
        },
    ],
    flags: [
        {
            name: 'output',
            description: 'specify the output format for command operation results',
            short_key: 'o',
            long_key: 'output',
            variant: 'value',
            type: 'string',
            values: ['json', 'text',],
            default: 'text',
        },
    ],
};
const configuration = {
    strict_commands: true,
    strict_flags: true,
    show_deprecation_warnings: true,
    check_for_new_npm_version: false,
};
void (async () => {
    try {
        const program = (0, build_1.rotini)({ definition, configuration, });
        const result = await program.run().catch(program.error);
        result && console.info(result);
    }
    catch (e) {
        const error = e;
        console.error(`${error.name}: ${error.message}`);
    }
})();
