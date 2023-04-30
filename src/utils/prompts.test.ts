import * as readline from 'readline';
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
      const mockCreateInterface = vi.spyOn(readline, 'createInterface').mockImplementationOnce((): any => {
        return {
          setPrompt: vi.fn(),
          prompt: vi.fn(),
          close: vi.fn(),
          on: vi.fn((event: string, callback: Function): void => {
            callback(event);
          }),
        };
      });

      const event = await Utils.prompt('this is the prompt message');

      expect(mockCreateInterface).toHaveBeenCalledTimes(1);
      const { setPrompt, prompt, close, on, } = mockCreateInterface.mock.results[0].value;
      expect(setPrompt).toHaveBeenCalledTimes(1);
      expect(setPrompt).toHaveBeenCalledWith('this is the prompt message');
      expect(prompt).toHaveBeenCalledTimes(1);
      expect(on).toHaveBeenCalledTimes(1);
      expect(close).toHaveBeenCalledTimes(1);
      expect(event).toBe('line');
    });
  });

  describe('promptForYesOrNo', () => {
    const testPromptForYesOrNo = async (firstInput: string, secondInput?: string): Promise<void> => {
      const mockCreateInterface = vi.spyOn(readline, 'createInterface')
        .mockImplementationOnce((): any => {
          return {
            setPrompt: vi.fn(),
            prompt: vi.fn(),
            close: vi.fn(),
            on: vi.fn((_, callback: Function): void => {
              callback(firstInput);
            }),
          };
        })
        .mockImplementationOnce((): any => {
          return {
            setPrompt: vi.fn(),
            prompt: vi.fn(),
            close: vi.fn(),
            on: vi.fn((_, callback: Function): void => {
              callback(secondInput);
            }),
          };
        });

      await Utils.promptForYesOrNo('Are you sure you want to continue?');

      const expectedCalls = secondInput ? 2 : 1;
      expect(mockCreateInterface).toHaveBeenCalledTimes(expectedCalls);

      const { setPrompt, prompt, close, on, } = mockCreateInterface.mock.results[0].value;
      expect(setPrompt).toHaveBeenCalledTimes(1);
      expect(setPrompt).toHaveBeenCalledWith('Are you sure you want to continue? (y/N) ');
      expect(prompt).toHaveBeenCalledTimes(1);
      expect(on).toHaveBeenCalledTimes(1);
      expect(close).toHaveBeenCalledTimes(1);
    };

    it('returns Y', async () => {
      await testPromptForYesOrNo('Y');
    });

    it('returns yes', async () => {
      await testPromptForYesOrNo('yes');
    });

    it('returns YES', async () => {
      await testPromptForYesOrNo('YES');
    });

    it('returns N', async () => {
      await testPromptForYesOrNo('n');
    });

    it('returns no', async () => {
      await testPromptForYesOrNo('no');
    });

    it('returns NO', async () => {
      await testPromptForYesOrNo('NO');
    });

    it('returns prompt again, then resolves', async () => {
      await testPromptForYesOrNo('not yes or no value', 'y');
    });
  });
});
