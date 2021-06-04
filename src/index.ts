/**
 * @author TimH96
 * @filename index.ts
 * 
 * entrypoint script to run bot on local machine, supposed to be used with own account and channel only
 */

import { sys } from 'typescript'
import AntiBurnerBot from './bot'
import { AntiBurnerBotConfig } from './types/config'

function startLaunchTerminal(): void {
    console.log('Available commands: run conf show')
}

try {
    try {    
        const config: AntiBurnerBotConfig = JSON.parse(require('./config.json'))
    } catch (error) {
        const config: AntiBurnerBotConfig = JSON.parse(require(sys.args[0]))
    }
        console.log('Found config.json')
        startLaunchTerminal()
} catch (error) {
    console.log('Did not find or could not parse config.json file.')
    console.log('You will be prompted to configure the bot now, please refer to the README.md for specifics on the required information.')
    throw error
}

const config: AntiBurnerBotConfig = {
    identity: {
        username: 'oddbod',
        client_id: '5igx8b5i7o9al841l8e6w7a1nsfa23',
        client_secret: 'goxl8rlv16m72l1hl1ncvx1l5gmf1s',
        oauth_token: 'qopu26wx99okg3iehdigpb2ahmetky'
    },
	channels: [
        {
            name: 'oddbod',
            min_age: 160000,
            allowed_users: []
        }
    ],
	run_locally: true
}

new AntiBurnerBot(config).run()
