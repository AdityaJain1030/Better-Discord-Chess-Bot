import {Chess} from 'chess.js'

import {Command} from '../typings'
import {prefix} from '../data/config.json'

export = <Command>{
    name: 'ping',
    description: 'ping pong',
    usage: `${prefix}ping`,
    execute: (msg):void => {
        msg.channel.send('gong')
        console.log('pong')
    }
}