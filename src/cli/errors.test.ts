import { ConfigurationError, OperationError, OperationTimeoutError, ParseError, } from './errors';

describe('errors', () => {
  describe('ConfigurationError', () => {
    it('returns configuration error', () => {
      const error = new ConfigurationError('some error');
      expect(error).toBeInstanceOf(ConfigurationError);
    });
  });

  describe('OperationError', () => {
    it('returns operation error', () => {
      const error = new OperationError('some error');
      expect(error).toBeInstanceOf(OperationError);
    });
  });

  describe('OperationTimeoutError', () => {
    it('returns operation timeout error', () => {
      const error = new OperationTimeoutError('some error');
      expect(error).toBeInstanceOf(OperationTimeoutError);
    });
  });

  describe('ParserError', () => {
    it('returns parser error', () => {
      const error = new ParseError('some error');
      expect(error).toBeInstanceOf(ParseError);
    });

    it('returns parser error with help', () => {
      const error = new ParseError('some error', 'help');
      expect(error).toBeInstanceOf(ParseError);
    });
  });
});
