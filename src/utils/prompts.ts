import * as readline from 'readline';

export const prompt = async (message: string): Promise<string> => {
  return new Promise(resolve => {
    const rlInterface = readline.createInterface({ input: process.stdin, output: process.stdout, });

    rlInterface.setPrompt(message);
    rlInterface.prompt();

    rlInterface.on('line', res => {
      resolve(res);
      rlInterface.close();
    });
  });
};

export const promptForYesOrNo = async (message: string): Promise<boolean> => {
  const response = await prompt(`${message} (y/N) `);

  if (response && (response.toUpperCase() === 'Y' || response.toUpperCase() === 'YES')) {
    return true;
  }

  if (response && (response.toUpperCase() === 'N' || response.toUpperCase() === 'NO')) {
    return false;
  }

  return promptForYesOrNo(message);
};
