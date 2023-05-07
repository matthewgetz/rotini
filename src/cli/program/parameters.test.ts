import { Parameters, createParameters, getParameters, } from './parameters';

describe('parameters', () => {
  describe('Parameters', () => {
    it('parameters are created and set as unparsed', () => {
      const original_parameters = [ 'get', 'projects', '12345', 'runner', ];
      const formatted_parameters = [ { id: 0, value: 'get', }, { id: 1, value: 'projects', }, { id: 2, value: '12345', }, { id: 3, value: 'runner', }, ];

      const params = createParameters(original_parameters);

      const parameters = new Parameters(params);

      expect(parameters.original_parameters).toStrictEqual(formatted_parameters);
      expect(parameters.working_parameters).toStrictEqual(formatted_parameters);
      expect(parameters.parsed_parameters).toStrictEqual([]);
      expect(parameters.unparsed_parameters).toStrictEqual([]);
      expect(parameters.adjustUnparsedParameters());
      expect(parameters.parsed_parameters).toStrictEqual([]);
      expect(parameters.unparsed_parameters).toStrictEqual(formatted_parameters);
    });

    it('parameters are created and set as parsed', () => {
      const original_parameters = [ 'get', 'projects', '12345', 'runner', ];
      const formatted_parameters = [ { id: 0, value: 'get', }, { id: 1, value: 'projects', }, { id: 2, value: '12345', }, { id: 3, value: 'runner', }, ];

      const params = createParameters(original_parameters);

      const parameters = new Parameters(params);

      expect(parameters.original_parameters).toStrictEqual(formatted_parameters);
      expect(parameters.working_parameters).toStrictEqual(formatted_parameters);
      expect(parameters.parsed_parameters).toStrictEqual([]);
      expect(parameters.unparsed_parameters).toStrictEqual([]);
      parameters.parsed_parameters = [ 'get', 'projects', '12345', ];
      expect(parameters.adjustUnparsedParameters());
      expect(parameters.parsed_parameters).toStrictEqual([ 'get', 'projects', '12345', ]);
      expect(parameters.unparsed_parameters).toStrictEqual([ { id: 3, value: 'runner', }, ]);
    });
  });

  describe('createParameters', () => {
    it('returns formatted parameters', () => {
      const original_parameters = [ 'get', 'projects', '12345', 'runner', ];
      const formatted_parameters = [ { id: 0, value: 'get', }, { id: 1, value: 'projects', }, { id: 2, value: '12345', }, { id: 3, value: 'runner', }, ];

      const results = createParameters(original_parameters);

      expect(results).toStrictEqual(formatted_parameters);
    });
  });

  describe('getParameters', () => {
    it('returns formatted parameters from passed parameters', () => {
      const original_parameters = [ 'get', 'projects', '12345', 'runner', ];
      const formatted_parameters = [ { id: 0, value: 'get', }, { id: 1, value: 'projects', }, { id: 2, value: '12345', }, { id: 3, value: 'runner', }, ];

      const results = getParameters(original_parameters);

      expect(results).toStrictEqual(formatted_parameters);
    });

    it('returns formatted parameters from passed from process.argv', () => {
      process.argv = [ 'node', 'file.js', 'get', 'projects', '12345', 'runner', ];
      const formatted_parameters = [ { id: 0, value: 'get', }, { id: 1, value: 'projects', }, { id: 2, value: '12345', }, { id: 3, value: 'runner', }, ];

      const results = getParameters();

      expect(results).toStrictEqual(formatted_parameters);
    });
  });
});
