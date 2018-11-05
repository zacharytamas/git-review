import simplegit from 'simple-git/promise';
import { findGitRepositories } from './findGitRepositories';

findGitRepositories('/Users/zachary/Develop').then(async repos => {
  repos.forEach(async path => {
    const repo = simplegit(path);
    const { files } = await repo.diffSummary();

    if (files.length > 0) {
      console.log(`${path} is dirty.`);
    }
  });
});
