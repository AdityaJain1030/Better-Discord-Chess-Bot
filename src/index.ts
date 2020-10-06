import {Client, Collection} from 'discord.js'
import fs from 'fs'

import {token, version, botName, prefix} from './data/config.json'
import {blacklisted, chessChannels} from './data/chessBasic.json'
import {Command, CommandClient} from './typings'
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

//CREATE CLIENT
const client: CommandClient = new Client()
client.commands = new Collection<string, Command>()

//COMMAND INITIALISER
for (const file of commandFiles) {
    import(`./commands/${file}`).then((command:Command):void=> {
        client.commands?.set(command.name, command)
        console.log(`Loaded command: ${command.name}`)
    })
}

//READY STATE HANDLER
client.on('ready',  ()=>{
    console.log(`Logged in as ${client.user?.tag}!`)
    console.log(`Succesfully loaded ${commandFiles.length} commands`)
    console.log(`${botName} Version: V${version}`)
})

//COMMAND HANDLER
client.on('message', (message)=>{
    if (!message.content.startsWith(prefix) || message.author.bot || blacklisted.includes(message.author.id) || !chessChannels.includes(message.channel.id))
        return
    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift()?.toLowerCase() || ''
    client.commands?.get(command)?.execute(message, args, client)
})

//USER JOIN HANDLER
client.on('guildMemberAdd', () => {

})

//USER LEAVE HANDLER
client.on('guildMemberRemove', () => {

})

//GUILD JOIN HANDLER
client.on('guildCreate', (guild) => {
    console.log(guild.channels.cache.find((channel) => channel.name.toLowerCase() === "chess"))
})

//GUILD LEAVE HANDLER
client.on('guildDelete', (guild) => {
    console.log(guild.channels.cache.find((channel) => channel.name.toLowerCase() === "chess"))
})
client.login(token)
