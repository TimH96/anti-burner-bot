/**
 * @author TimH96
 * @filename index.ts
 * 
 * entrypoint script to run bot on local machine, supposed to be used with own account and channel only
 */

import { sys } from 'typescript'
import AntiBurnerBot from './bot'
import { AntiBurnerBotConfig } from './types/config'
import { writeFileSync, readFileSync } from 'fs'
const prompt = require('prompt')

/** terminal prompt for bot commands */
function startLaunchTerminal(): void {
    console.log('Available commands:')
    console.log('  run  conf  show  close')
    console.log()
    prompt.get('command', (error: Error, result: Record<string, any>) => {
        switch (result.command) {
            case 'run': 
                startBot(config)
                break
            case 'conf':
                startConfigTerminal()
                break
            case 'show':
                showConfig()
                break
            case 'close':
                sys.exit()
                break
            default:
                console.log(`Unknown command ${result.command}`)
                console.log('')
                startLaunchTerminal()
        }
    })
}

/** terminal prompt for configuration */
function startConfigTerminal(): void {
    console.log('You will be prompted to configure the bot now, please refer to the USAGE.md for specifics on the required information.')
    prompt.start();
    prompt.get(
        ['username', 'client_id', 'client_secret', 'oauth', 'minimum_age'],
        (error: Error, result: Record<string, any>) => {
            if (error) {
                console.log('There was an error with your input.')
                sys.exit()
            } else {
                if (!(
                    typeof result.username == 'string' && result.username.length > 0 &&
                    typeof result.client_id == 'string' && result.client_id.length > 0 &&
                    typeof result.client_secret == 'string' && result.client_secret.length > 0 &&
                    typeof result.oauth == 'string' && result.oauth.length > 0 &&
                    parseInt(result.minimum_age)
                )) {
                    console.log('One or more values of your input were invalid.')
                    sys.exit()
                }
                config = {
                    identity: {
                        username: result.username,
                        client_id: result.client_id,
                        client_secret: result.client_secret,
                        oauth_token: result.oauth
                    },
                    channels: [
                        {
                            name: result.username,
                            min_age: result.minimum_age,
                            allowed_users: []
                        }
                    ],
                    run_locally: true
                }
                writeFileSync('./config.json', JSON.stringify(config, null, 4))
                startLaunchTerminal()
            }
        }
    )
}

/** terminal prompt for showing config */
function showConfig(): void {
    console.log('Loaded config:')
    console.dir(config)
    console.log()
    startLaunchTerminal()
}

/** run bot on given config */
function startBot(config: AntiBurnerBotConfig): void {
    console.log()
    console.log('>> starting bot')
    prompt.stop()
    new AntiBurnerBot(config).run()
}

let config: AntiBurnerBotConfig
prompt.start()
try {
    try {    
        config = JSON.parse(readFileSync('./config.json', 'utf8'))
    } catch (error) {
        config = JSON.parse(readFileSync(sys.args[0], 'utf8'))
    }
        console.log('Found config.json')
        startLaunchTerminal()
} catch (error) {
    console.log('Did not find or could not parse config.json file.')
    startConfigTerminal()
}
