import rotini from '../rotini';
// import { version, } from '../../package.publish.json';
import { I_ProgramConfiguration, I_ProgramDefinition, } from '../build';
import generate from './generate';

const definition: I_ProgramDefinition = {
  name: 'rotini',
  description: 'a framework for building node.js cli programs',
  configuration: {
    directory: '.rotini',
    file: 'config.json',
  },
  version: '1.0.0',
  commands: [ generate, ],
};

const configuration: I_ProgramConfiguration = {
  strict_commands: true,
  strict_flags: true,
  show_deprecation_warnings: true,
  check_for_new_npm_version: true,
};

export default async (): Promise<void> => {
  const isCommonJs = typeof module !== 'undefined';

  if ((isCommonJs && require.main === module) || !isCommonJs && import.meta && import.meta.url === `file://${process.argv[1]}`) {
    const program = rotini({ definition, configuration, });
    const result = await program.run().catch(program.error);
    result && console.info(result);
  }
};
