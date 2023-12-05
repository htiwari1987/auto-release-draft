import * as core from '@actions/core'
//import { wait } from './wait'
import * as event from './event'
import * as version from './version'
import * as git from './git'
import * as github from './github'
//import { release } from 'os'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    let releaseUrl = ''
    const token = core.getInput('repo-token')
    const tag = event.getCreatedTag()

    if(tag && version.isSemVer(tag)) {
      const changeLog = await git.getChangesIntroducedByTag(tag)
      releaseUrl = await github.createReleaseDraft(tag, token, changeLog)
    }

   

    

    //const ms: string = core.getInput('milliseconds')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    //core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    //core.debug(new Date().toTimeString())
    //await wait(parseInt(ms, 10))
    //core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('release-url', releaseUrl)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
