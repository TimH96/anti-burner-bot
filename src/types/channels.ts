/** IRC channel with bot metadata specific to that channel */
export interface Channel{
    api_id?: string
    name: string
    min_age: number
    allowed_users: Array<string>
}