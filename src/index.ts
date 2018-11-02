import { exec } from 'child_process';
import { existsSync } from 'fs';
import { platform } from 'os';
import { promisify } from 'util';

interface IFindGitRepositoriesOptions {
  shallow?: boolean;
  ignore?: string[];
}

const findGitRepositories = async (
  directory: string,
  options: IFindGitRepositoriesOptions = {}
): Promise<string[]> => {
  const { shallow = true, ignore = ['*/node_modules/*'] } = options;

  if (!existsSync(directory)) {
    throw new Error(`Provided directory does not exist: ${directory}.`);
  }

  // Use platform-specific manners if possible for increased performance.
  if (platform() === 'darwin') {
    const { stdout, stderr } = await promisify(exec)(
      `find ${directory} ${ignore
        .map(ig => `-not \\( -path "${ig}" -prune \\)`)
        .join(' ')} -name .git ${shallow ? '-prune' : ''}`
    );

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout.trimRight().split('\n');
  }

  const repoContainingFolders = [];

  return repoContainingFolders;
};

findGitRepositories('/Users/zachary/Develop').then(repos => {
  console.log(repos, repos.length);
});
