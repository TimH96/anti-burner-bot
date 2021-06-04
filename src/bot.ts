import TwitchApi from "node-twitch";
import { Channel } from "./types/channels";
import { AntiBurnerBotConfig, Identity } from './types/configs';
let tmi = require('tmi.js');

/** AntiBurnerBot */
export default class AntiBurnerBot extends tmi.client {
    identity: Identity;
    twitch_api: TwitchApi;
	channels: Array<Channel>;

    constructor(config: AntiBurnerBotConfig) {
        // create base tmi.client
        super({
            identity: {
                username: config.identity.username,
                password: config.identity.oauth_token
            },
            channels: config.channels
        })
        // bot fields
        this.identity = config.identity;
        this.channels = config.channels;
        this.twitch_api = new TwitchApi({
            client_id: config.identity.client_id,
	        client_secret: config.identity.client_secret
        })

    }
}