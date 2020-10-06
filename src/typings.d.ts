import {Client, Message, Collection} from 'discord.js'

//DEFINE GLOBAL INTERFACES
export interface Command {
	name: string,
    description: string,
    usage: string,
	execute: (msg: Message, args: string[], client: Client) => void
}

export interface CommandClient extends Client{
    commands?: Collection<string, Command>
}