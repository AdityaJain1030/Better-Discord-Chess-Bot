import {Chess} from 'chess.js'
import fs from 'fs'


import {Command, Game} from '../typings'
import {games} from '../data/games.json'
import {prefix} from '../data/config.json'
const Games = games as Game[]

export = <Command>{
    name: 'move',
    description: 'Move a piece, using any notation you like',
    usage: `${prefix}move [notation]`,
    execute: (msg, args) => {
        //check if user not already in game
        if (Games.some(game=>msg.author.id === game.p1uid && msg.author.id === game.p2uid)){
            msg.channel.send('You aren\'t in a game yet!')
            return
        }
        //create board with previous state
        const currentState = Games.filter(game=>game.p1uid === msg.author.id || game.p2uid === msg.author.id)[0]
        const game = new Chess()
        game.load_pgn(currentState.pgn, {newline_char: '\n'})
        game.header('White', currentState.p1uid, 'Black', currentState.p2uid, "Date", currentState.starttime)

        //check if its right players turn
        let playerToMove = (msg.author.id === currentState.p1uid ? 'w' : 'b')
        if(playerToMove !== game.turn()){
            msg.channel.send('Not Your Turn!')
            msg.channel.send(`\`${game.ascii()}\``)
            return
        }
        //move piece
        game.move(args[0], {sloppy: true})
        //write new state to file
        currentState.pgn = game.pgn({newline_char: '\n'})
        fs.writeFileSync('./data/games.json', JSON.stringify({games: Games}, null, 2))
        //show updated board
        msg.channel.send(`\`${game.ascii()}\``)
    }
}