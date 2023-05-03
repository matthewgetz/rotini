import { Timing, } from './timing';

describe('Timing', () => {
  it('sets start time, end time, and returns elapsed time', () => {
    const mockStartDate = new Date('2023-05-05T05:09:52.000Z');
    const mockEndDate = new Date('2023-05-05T05:10:04.000Z');

    vi.spyOn(global, 'Date')
      .mockImplementationOnce(() => (mockStartDate as unknown) as string)
      .mockImplementationOnce(() => (mockEndDate as unknown) as string);

    const timing = new Timing();

    timing.start();
    timing.end();

    const result = timing.elapsed();

    expect(result).toBe(12000);

    timing.reset();
  });
});
