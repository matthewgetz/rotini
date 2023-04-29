import * as Utils from './prompts';

vi.mock('readline', () => {
  return {
    createInterface: (): { setPrompt: Function, prompt: Function, on: Function, close: Function } => {
      return {
        setPrompt: vi.fn(),
        prompt: vi.fn(),
        close: vi.fn(),
        on: (event: string, callback: Function): void => {
          callback(event);
        },
      };
    },
  };
});

describe('prompts', () => {
  describe('prompt', () => {
    it('prompts for input', async () => {
      const result = await Utils.prompt('');
      expect(result).toBe('line');
    });
  });

//   describe('promptForYesOrNo', () => {
//     it('prompts for yes/no', async () => {
//       const result = await Utils.promptForYesOrNo('');
//       expect(result).toBe(true);
//     });
//   });
});
