import Utils from '../../utils';

export type Parameter = {
  id: number
  value: string
}

export class Parameters {
  original_parameters: readonly Parameter[];
  working_parameters: Parameter[];
  parsed_parameters: (string | number | boolean)[] = [];
  unparsed_parameters: Parameter[] = [];

  constructor (parameters: Parameter[]) {
    this.original_parameters = Object.freeze(parameters);
    this.working_parameters = [ ...parameters, ];
  }

  nextWorkingParameter = (): Parameter | undefined => this.working_parameters.shift();

  hasWorkingParameters = (): boolean => this.working_parameters.length > 0;

  adjustUnparsedParameters = (): void => {
    if (this.parsed_parameters.length + this.unparsed_parameters.length !== this.original_parameters.length) {
      this.unparsed_parameters = this.original_parameters.slice(this.parsed_parameters.length + this.unparsed_parameters.length);
    }
  };
}

export const createParameters = (parameters: string[]): Parameter[] => parameters.map((value, id) => ({ id, value, }));

export const getParameters = (parameters?: string[]): Parameter[] => {
  return (Utils.isDefined(parameters) && Utils.isArrayOfStrings(parameters))
    ? createParameters(parameters!)
    : createParameters(process.argv.splice(2));
};
