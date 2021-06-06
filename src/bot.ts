/**
 * @author TimH96
 * @filename bot.ts
 */

import TwitchApi from 'node-twitch'
import { Channel, ChannelTable } from './types/channel'
import { AntiBurnerBotConfig, Identity } from './types/config'
const tmi = require('tmi.js')

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

    /** build bot object from config */
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
            run_locally: config.run_locally,
        }
        for (const c of config.channels) {
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

    /** called for every message, main logic */
    private _onMessageHandler (
        channel: string,
        userstate: Record<string, unknown> | any,
        message: string,
        self: boolean
    ): void {
        // do nothing if posted by self or if user is already allowed
        if (self) {return}
        const ch_name: string = channel.slice(1)
        const usr_name: string = userstate.username
        const this_channel: Channel = this.env.channels[ch_name]
        try {
            if (this_channel.allowed_users.includes(usr_name)) {
                return
            }
        } catch (e) {
            return this._onError(e)
        }
        // call twitch API to check for user age
        this.twitch_api.getUsers(usr_name)
            .then((value) => {
                const data = <any>value.data[0]
                const dif: number = Math.trunc(Date.now() / 1000) - Math.trunc(Date.parse(data.created_at) / 1000)
                if (dif < this_channel.min_age) {
                    // user account not old enough, ban user using inherited method
                    super.ban(ch_name, usr_name, this_channel.ban_reason === undefined ? '' : this_channel.ban_reason)
                    console.log(`>> bot banned user ${usr_name}`)
                } else {
                    // user account is old enough, save it to cache
                    this_channel.allowed_users.push(usr_name)
                }
            })
            .catch((reason) => {
                this._onError(reason)
            })
    }

    /** handle system messages posted in host channel of bot */
    private _onSystemMessageHandler (
        channel: string,
        userstate: Record<string, unknown>,
        message: string,
        self: boolean
    ): void {
        // do on msg in own chat
    }

    /** post status on connection */
    private _onConnectedHandler (address: string, port: number): void {
        console.log(`>> bot connected to IRC server at ${address}:${port}`)
    }

    /** log disconnect reason */
    private _onDisconnectionHandler (reason: string): void {
        console.log('>> bot disconnected from IRC server')
        this._onError(reason)
    }

    /** local error handler */
    private _onError (error: any): void {
       console.log(`>> there was an error: ${error}`)
    }

    /** run bot */
    run (): void {
        this.connect()
    }

    /** stop bot */
    stop (): void {
        this.disconnect()
    }
}
