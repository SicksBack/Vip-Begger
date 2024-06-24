const { createBot } = require('mineflayer');
const fs = require('fs');
const path = require('path');

const message = fs.readFileSync(path.join(__dirname, 'message.txt'), 'utf-8').split('\r\n');
const account = fs.readFileSync(path.join(__dirname, 'mc_account.txt'), 'utf-8').split('\r\n');
const prefix = '\x1b[0;90m>';
const log = (msg) => console.log(prefix, msg);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let last = 0;

function hook (bot, opt) {

    async function antiafk () {
        log('antiafk triggered');
        bot.setControlState('right', true);
        await sleep(1500);
        bot.setControlState('right', false);
        bot.setControlState('left', true);
        await sleep(1500);
        bot.setControlState('left', false);
        log('antiafk stopped');
    };
    
    function beg () {
        if(Math.floor((Date.now() - last) / 1000) <= 120) {
            const msg = message[Math.floor(Math.random() * message.length)];
            bot.chat(msg);
            log(msg);
        }
    };    

    bot.once('spawn', async () => {
        setInterval(async function () {
            await antiafk();
        }, 102000);
        setInterval(beg, 8000);
        log('spawned');
        await sleep(2000);
        log('/lobby bw');
        bot.chat('/lobby bw');
        await sleep(2000);
        log('/swaplobby 1');
        bot.chat('/swaplobby 1');
    });

    bot.on('windowOpen', (window) => {
        const content = window.slots.map(slot => slot ? slot.name : '').join(' ');
        if (content.includes('wants to gift you') && content.includes('Will you accept?') && content.includes('Yes')) {
            log('gifted');
            const yesButton = window.slots.find(slot => slot && slot.name && slot.name.includes('Yes'));
            if (yesButton) {
                bot.clickWindow(yesButton.slot, 0, 0);
                bot.chat('Thanks');
            }
        }
    });

    const regexgift = /(.+?) gifted the (.+?) rank to (.+?)!/mg;
    bot.on('messagestr', async (msg) => {
        const gifting = msg.match(regexgift);
        if(gifting) {
            log('gifter detected')
            last = Date.now();
        };
    });
};

console.log(account);
for ( let i = 0 ; i < account.length ; i ++ ) {

    setTimeout(function () {
        const opt = {
            username: account[i],
            host: 'mc.production.hypixel.io',
            auth: 'microsoft',
            version: '1.8.9',
            viewDistance: 2
        };
        const bot = createBot(opt)
        hook(bot, opt);
    }, 10000 * i);

};