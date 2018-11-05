import { exec } from 'child_process';
import { existsSync } from 'fs';
import { platform } from 'os';
import { promisify } from 'util';

export interface IFindGitRepositoriesOptions {
  shallow?: boolean;
  ignore?: string[];
}

export const findGitRepositories = async (
  directory: string,
  options: IFindGitRepositoriesOptions = {}
): Promise<string[]> => {
  const { shallow = true, ignore = ['*/node_modules/*'] } = options;

  if (!existsSync(directory)) {
    throw new Error(`Provided directory does not exist: ${directory}.`);
  }

  // Use platform-specific manners if possible for increased performance.
  if (platform() === 'darwin') {
    // TODO Could squeeze performance out by turning this into a stream and
    // emitting each `\n`-delimited chunk written to stdout.
    const { stdout, stderr } = await promisify(exec)(
      `find ${directory} ${ignore
        .map(ig => `-not \\( -path "${ig}" -prune \\)`)
        .join(' ')} -name .git ${shallow ? '-prune' : ''}`
    );

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout
      .replace(/\/\.git/g, '')
      .trimRight()
      .split('\n');
  }

  const repoContainingFolders = [];

  return repoContainingFolders;
};
