/**
 * @author TimH96
 * @filename local.ts
 * 
 * entrypoint script to run bot on local machine, supposed to be used with own account and channel only
 */

import AntiBurnerBot from './bot'
import { AntiBurnerBotConfig } from './types/config'

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
