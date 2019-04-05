import { Toolbox } from 'gluegun/build/types/domain/toolbox';
import { build } from 'gluegun';

/**
 * Create the cli and kick it off
 */
async function run(argv: string[]): Promise<Toolbox> {
  // create a CLI runtime
  const cli = build()
    .brand('og')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'og-*', hidden: true })
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .create();

  // and run it
  const toolbox = (await cli.run(argv)) as Toolbox;

  // send it back (for testing, mostly)
  return toolbox;
}

module.exports = { run };
