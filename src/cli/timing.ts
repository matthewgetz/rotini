export class Timing {
  #start_time!: Date | undefined;
  #end_time!: Date | undefined;

  constructor () {}

  start = (): void => {
    this.#start_time = new Date();
  };

  end = (): void => {
    this.#end_time = new Date();
  };

  elapsed = (): number => {
    return this.#end_time!.valueOf() - this.#start_time!.valueOf();
  };

  reset = (): void => {
    this.#start_time = undefined;
    this.#end_time = undefined;
  };
}
