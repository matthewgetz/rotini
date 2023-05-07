import * as all_exports from './index';

describe('exports', () => {
  it('has all expected exports', () => {
    const exports = Object.keys(all_exports);

    expect(exports.length).toBe(19);
    expect(exports).toStrictEqual([
      'rotini',
      'Argument',
      'Command',
      'Configuration',
      'ConfigurationFile',
      'Definition',
      'Example',
      'GlobalFlag',
      'LocalFlag',
      'PositionalFlag',
      'Operation',
      'ConfigFile',
      'GetContent',
      'SetContent',
      'ParseObject',
      'ConfigurationError',
      'OperationError',
      'OperationTimeoutError',
      'ParseError',
    ]);
  });
});
