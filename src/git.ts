import {exec} from '@actions/exec'
import * as core from '@actions/core'

export async function getChangesIntroducedByTag(tag: string) : Promise<string> {
	const previousVersionTag = await getPreviousVersionTag(tag)
	return previousVersionTag ? getCommitMessagesBetween(previousVersionTag, tag) : getCommitMessagesFrom(tag)
}

export async function getPreviousVersionTag(tag: string) : Promise<string | null> {
	let previousVersionTag = ''
	const options = {
		listeners: {
		stdout: (data: Buffer) => {
			previousVersionTag += data.toString();
		}
		}
		};
		const exitCode=await exec('git', ['describe', '--match', 'v[0-9]*', '--abbrev=0', '--first-parent', `${tag}^`], options);
		core.debug(`The previous version tag is ${previousVersionTag}`);
		return exitCode === 0 ? previousVersionTag.trim() : null
}

export async function getCommitMessagesBetween(firstTag: string, secondTag: string) : Promise<string> {
	let commitMessagesBetween = ''
	const options = {
		listeners: {
		stdout: (data: Buffer) => {
			commitMessagesBetween += data.toString();
		}
		}
		};
		const exitCode=await exec('git', ['log', '--format=%s', `${firstTag}..${secondTag} `], options);
		core.debug(`The commit messages between version ${firstTag} and ${secondTag} are \n${commitMessagesBetween}`);
		return commitMessagesBetween.trim()
}

export async function getCommitMessagesFrom(tag: string) : Promise<string> {
	let commitMessagesFrom = ''
	const options = {
		listeners: {
		stdout: (data: Buffer) => {
			commitMessagesFrom += data.toString();
		}
		}
		};
		const exitCode=await exec('git', ['log', '--format=%s', tag], options);
		core.debug(`The commit messages between version from ${tag} are \n${commitMessagesFrom}`);
		return commitMessagesFrom.trim()
}