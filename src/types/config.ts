/**
 * @author TimH96
 * @filename types/config.ts
 * 
 * types for config of bot
 */

import { Channel } from './channel'

/** User identity of bot */
export interface Identity{
    username: string;
    client_id: string;
    client_secret: string;
    oauth_token: string;
}

/** Config type for bot used at constructor */
export interface AntiBurnerBotConfig{
	identity: Identity;
	channels: Array<Channel>;
	run_locally: boolean;
}