/**
 * @author TimH96
 * bot.ts
 */

import TwitchApi from 'node-twitch'
import { Channel } from './types/channels'
import { AntiBurnerBotConfig, Identity } from './types/configs'
const tmi = require('tmi.js')

/** Hashtable for all channels */
interface ChannelTable<Channel> {
    [key: string]: Channel
}

/** Runtime environment fields for bot, extracted into interface to not collide with tmi.client fields */
interface BotEnvironemnt {
    identity: Identity
    channels: ChannelTable<Channel>
    run_locally: boolean
}

/** AntiBurnerBot */
export default class AntiBurnerBot extends tmi.client {
    env: BotEnvironemnt
    twitch_api: TwitchApi

    constructor (config: AntiBurnerBotConfig) {
        // create base tmi.client
        super({
            identity: {
                username: config.identity.username,
                password: config.identity.oauth_token
            },
            channels: config.channels.map(({name}) => name)
        })
        // bot env
        this.env = {
            identity: config.identity,
            channels: {},
            run_locally: config.run_locally
        }
        for (let c of config.channels) {
            this.env.channels[c.name] = c
        }
        this.twitch_api = new TwitchApi({
            client_id: config.identity.client_id,
            client_secret: config.identity.client_secret
        })
        // connect event callbacks
        this.on('chat', this._onMessageHandler)
        this.on('connected', this._onConnectedHandler)
        this.on('disconnected', this._onDisconnectionHandler)
        if (!this.run_locally) {
            this.on('chat', this._onSystemMessageHandler)
        }
    }

    private _onMessageHandler (
        channel: string,
        userstate: Object | any,
        message: string,
        self: Boolean
    ): void {
        // do nothing if posted by self or if user is already allowed
        if (self) {return}
        let ch_name: string = channel.slice(1)
        let usr_name: string = userstate.username
        try {
            if (this.env.channels[ch_name].allowed_users.includes(usr_name)) {
                return
            }
        } catch (e) {
            return this._onError(e)
        }
        // call twitch API to check for user age
        this.twitch_api.getUsers(usr_name)
            .then((value) => {
                let data = <any>value.data[0]
                let dif: number = Math.trunc(Date.now() / 1000) - Math.trunc(Date.parse(data.created_at) / 1000)
                if (dif < this.env.channels[ch_name].min_age) {
                    // user account not old enough, ban user using inherited method
                    super.ban(ch_name, usr_name, 'reason: empty for now')
                } else {
                    // user account is old enough, save it to cache
                    this.env.channels[ch_name].allowed_users.push(usr_name)
                }
            })
            .catch((reason) => {
                this._onError(reason)
            })
    }

    private _onSystemMessageHandler (
        channel: string,
        userstate: Object,
        message: string,
        self: Boolean
    ): void {
        // do on msg in own chat
    }

    private _onConnectedHandler (address: string, port: number): void {
        // do on connection
    }

    private _onDisconnectionHandler (reason: string): void {
        // do on disconnection
    }

    private _onError (error: any): void {
       // log error 
       throw error
    }

    run (): void {
        this.connect()
    }
}
