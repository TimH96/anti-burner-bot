/**
 * @author TimH96
 * @filename types/channel.ts
 * 
 * types for channels and related metadata for bot
 */

/** IRC channel with bot metadata specific to that channel */
export interface Channel{
    api_id?: string
    name: string
    min_age: number
    allowed_users: Array<string>
}

/** Hashtable for all channels */
export interface ChannelTable<Channel> {
    [key: string]: Channel
}