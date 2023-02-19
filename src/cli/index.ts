import rotini from '../rotini';
import { version, } from '../../package.publish.json';
import { I_Program as I_ProgramDefinition, } from '../build';
import generate from './generate';

const definition: I_ProgramDefinition = {
  name: 'rotini',
  description: 'a framework for building node.js cli programs',
  version,
  commands: [ generate, ],
};

export default async (): Promise<void> => {
  if (require.main === module) {
    const program = rotini({ definition, });
    const result = await program.run().catch(program.error);
    result && console.info(result);
  }
};
