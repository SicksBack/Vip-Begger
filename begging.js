const mineflayer = require('mineflayer');
const fs = require('fs');
const path = require('path');

const accountsFilePath = path.join(__dirname, 'accounts.txt');

async function readAccounts(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data.trim().split('\n');
    } catch (error) {
        console.error('Error reading accounts file:', error);
        return [];
    }
}

async function createBot(email) {
    const bot = mineflayer.createBot({
        host: 'hypixel.net',
        version: '1.8.9',
        auth: 'microsoft',
        username: email,
        viewDistance: 2
    });

    const messages = [
        'Can someone gift me VIP?',
        'I really want VIP, please!',
        'Is anyone kind enough to give me VIP?',
        'I would love to have VIP, can someone help?',
        'Please gift me VIP!',
        'It would mean a lot if someone could get me VIP.',
        'I dream of having VIP, can anyone gift it to me?',
        'Help me get VIP, please!',
        'VIP would make my day, can anyone gift it?',
        'I need VIP, can someone help me out?',
        'Anyone willing to gift VIP?',
        'Looking for a generous person to gift VIP.',
        'VIP would be awesome, can someone get it for me?',
        'Can anyone spare a VIP gift?',
        'Please, I really want VIP!',
        'It would be amazing to have VIP, can someone gift it?',
        'Anyone here can gift VIP?',
        'VIP would be so cool, can anyone help?',
        'I would appreciate it if someone could gift me VIP.',
        'Please gift VIP, I really need it!',
        'I’m looking for someone to gift VIP, please!',
        'It would be so kind if someone could get me VIP.',
        'Can anyone get me VIP?',
        'VIP would be the best, can someone gift it?',
        'Looking for someone generous to gift VIP.',
        'Please, I just want VIP!',
        'It would mean the world to get VIP, can someone gift it?',
        'Anyone able to gift VIP?',
        'VIP would be awesome, can anyone help me get it?',
        'I need VIP so bad, can someone gift it?',
        'Anyone willing to get me VIP?',
        'VIP would make my day, can anyone gift it?',
        'Can someone please gift VIP?',
        'I would love to have VIP, can anyone help?',
        'Looking for a kind soul to gift VIP.',
        'VIP would be amazing, can anyone gift it?',
        'Please, can someone get me VIP?',
        'VIP would make me so happy, can anyone gift it?',
        'Can anyone gift me VIP?',
        'VIP would be a dream come true, can someone gift it?',
        'I really need VIP, can anyone help?',
        'Looking for someone to gift VIP, please!',
        'VIP would be incredible, can anyone gift it?',
        'Can anyone spare a VIP gift, please?',
        'Please gift VIP, I need it!',
        'VIP would be so cool, can anyone help?',
        'Anyone here can gift VIP?',
        'I would appreciate it if someone could get me VIP.',
        'Please, I really want VIP!',
        'Can anyone help me get VIP?',
        'VIP would be awesome, can someone gift it?',
        'Anyone willing to gift VIP?',
        'VIP would make my day, can anyone get it for me?',
        'Can someone please get me VIP?',
        'VIP would be amazing, can anyone help?',
        'Looking for someone to gift VIP.',
        'Please gift VIP, I need it!',
        'I dream of having VIP, can someone get it for me?',
        'Anyone able to gift VIP?',
        'VIP would be incredible, can someone gift it?',
        'Can anyone get me VIP, please?',
        'VIP would be the best, can someone gift it?',
        'Anyone here can get me VIP?',
        'VIP would be so cool, can anyone help me get it?',
        'Please, I just want VIP!',
        'It would mean the world to have VIP, can someone gift it?',
        'Can anyone help me get VIP, please?',
        'VIP would be amazing, can someone get it for me?',
        'Anyone willing to get me VIP?',
        'VIP would make my day, can someone gift it?',
        'Please, can someone gift me VIP?',
        'VIP would be awesome, can anyone help me get it?',
        'Can someone please gift VIP?',
        'I would love to have VIP, can anyone get it for me?',
        'Looking for someone generous to gift VIP.',
        'VIP would be the best, can anyone gift it?',
        'Please, I really need VIP!',
        'It would mean a lot to get VIP, can someone gift it?',
        'Anyone able to get me VIP?',
        'VIP would be incredible, can someone get it for me?',
        'Can anyone spare a VIP gift?',
        'Please gift VIP, I really want it!',
        'VIP would be so cool, can anyone get it for me?',
        'Anyone here can gift me VIP?',
        'I would appreciate it if someone could gift VIP.',
        'Please, I just want VIP!',
        'Can anyone help me get VIP?',
        'VIP would be amazing, can someone gift it for me?',
        'Anyone willing to gift VIP?',
        'VIP would make my day, can anyone get it for me?',
        'Can someone please get VIP?',
        'VIP would be awesome, can anyone help?',
        'Looking for someone to gift VIP, please!',
        'Please gift VIP, I really need it!'
    ];

    function sendRandomMessage() {
        const message = messages[Math.floor(Math.random() * messages.length)];
        console.log(`[BOT] ${bot.username}: ${message}`);
        bot.chat(message);
    }

    bot.once('spawn', async () => {
        console.log(`Bot with email ${email} spawned.`);
        bot.chat('/l bw');

        setInterval(sendRandomMessage, 6000); // message every 6 seconds NI- drilla
        setInterval(() => {
            console.log('Rejoining lobby...');
            bot.chat('/l bw');
        }, 180000); 
    });

    bot.on('message', (rawMessage) => {
        const message = rawMessage.toString();
        console.log(`[CHAT] ${message}`);
    });

    bot.on('windowOpen', (window) => {
        const content = window.slots.map(slot => slot ? slot.name : '').join(' ');
        if (content.includes('wants to gift you VIP') && content.includes('Will you accept?') && content.includes('Yes')) {
            console.log(`[BOT] ${bot.username}: Clicking 'Yes' to accept VIP gift`);
            const yesButton = window.slots.find(slot => slot && slot.name && slot.name.includes('Yes'));
            if (yesButton) {
                bot.clickWindow(yesButton.slot, 0, 0);
            }
        }
    });

    bot.on('end', () => {
        console.log(`Bot with email ${email} disconnected.`);
    });
}

async function main() {
    const accounts = await readAccounts(accountsFilePath);

    for (const account of accounts) {
        createBot(account);
        await new Promise(resolve => setTimeout(resolve, 5000)); 
    }
}

main();
