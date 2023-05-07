import * as all_exports from './index';

describe('exports', () => {
  it('has all expected exports', () => {
    const exports = Object.keys(all_exports);

    expect(exports.length).toBe(19);
    expect(exports).toStrictEqual([
      'rotini',
      'ConfigurationError',
      'OperationError',
      'OperationTimeoutError',
      'ParseError',
      'I_Argument',
      'I_Command',
      'I_Configuration',
      'I_ConfigurationFile',
      'I_Definition',
      'I_Example',
      'I_GlobalFlag',
      'I_LocalFlag',
      'I_PositionalFlag',
      'I_Operation',
      'ConfigFile',
      'GetContent',
      'SetContent',
      'ParseObject',
    ]);
  });
});
