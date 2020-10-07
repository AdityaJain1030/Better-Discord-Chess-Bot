import {Chess} from 'chess.js'
import fs from 'fs'


import {Command, Game} from '../typings'
import {games} from '../data/games.json'
import {prefix} from '../data/config.json'
const Games = games as Game[]

export = <Command>{
    name: 'start',
    description: 'Start a Chess Game',
    usage: `${prefix}start [opponent]`,
    execute: (msg, args) => {
        //check if user already in game
        if (Games.some(game=>msg.author.id === game.p1uid || msg.author.id === game.p2uid)){
            msg.channel.send('You are already in a game!')
            return
        }
        // get players 
        const challenger = msg.author.id
        const opponent = args.filter(word => word.startsWith('<@') && word.endsWith('>'))[0]?.replace(/((?:<@!)|>)/g, '') || null
        if (opponent === null || opponent === challenger ){
            msg.channel.send('Invalid Opponent!')
            return
        }

        //check if opposition already in game
        if (Games.some(game=>opponent === game.p1uid || opponent === game.p2uid)){
            msg.channel.send('Your opponent is in a game!')
            return
        }

        //create game and save it to file
        const game = new Chess()
        const time = (new Date()).toUTCString()
        game.header('White', opponent, 'Black', challenger, 'Date',  time)
        const gameMeta : Game = {
            p1uid: challenger,
            p2uid: opponent,
            pgn: game.pgn({newline_char: '\n'}),
            starttime: time
        }
        //append to game array and write to JSON
        Games.push(gameMeta)
        // THIS IS AN EXPORTED MODULE, SO ALL THE SCRIPTS INSIDE THE EXPORT ARE RUN IN THE INDEX.TS FILE. THEREFORE ALL PATHS MUCH SHOW AS SUCH
        fs.writeFileSync('./data/games.json', JSON.stringify({games: Games}, null, 2))
    }
}