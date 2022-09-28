 const { PrismaClient } =  require('@prisma/client')
const { Client, GatewayIntentBits, userMention, User, GuildChannelManager, GuildMessages, MessageContent} = require('discord.js');
const { token, guildId } = require('../config.json');




const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: ['MESSAGE'] });
const prisma = new PrismaClient()

client.once('ready', () => {
    console.log('Ready!');
});

 client.on('messageCreate',  async  (message) => {
    const messageContent = message.content
     const messagesId = message.id
        try {const poop = await prisma.messages.create({
         data: {
             author: `${message.author.username}` ,
             messageID: `${messagesId}`,
             contents: `${messageContent}`


         }
     })}
     catch (error){
        console.log(error)
     }

 });

 client.on('messageDelete', async(message) => {
     const deletedMessageChannel = await client.channels.cache.get('1024730889982316554')
     const DeltedMessageID = message.id
     const result =  await prisma.messages.findUnique({
         where: {
             messageID: `${DeltedMessageID}`
         }
     })
     await deletedMessageChannel.send(`a message has just been deleted by: ${result.author} the message contents read: ${result.contents}`)


 })


client.on('interactionCreate', async  interaction => {
    if (interaction.user.id === "500753790388011008") {interaction.reply('fuck off'); return;}
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction



    if (commandName === 'ping') {
        interaction.reply(`ping: ${client.ws.ping}ms`)
    }
    if (commandName === 'warn') {
        const adminChannel = await client.channels.cache.get('1022839355062104175');
        const warned_user =  await interaction.options.getUser('target')
        const reason = await interaction.options.getString('reason')

        await interaction.reply({content:`${warned_user.tag} has been warned by ${interaction.user.tag} for the reason ${reason}`, ephemeral: true})
        await interaction.followUp({ content:'admins have been notified of your issue', ephemeral: true})
             .then ( async () => {
             await client.guilds.cache.get(guildId).channels.create({
                 name: `${interaction.user.username} issue`,
                 type: 0
                 })
             })
        try {const poop = await prisma.report.create({
            data: {
                userID: `${warned_user.id}`,
                reason: `${reason}`
            }
        })}
        catch (error) {
            console.log(error)
        }


        await adminChannel.send(`${warned_user.tag} has been warned fat admin bastards attack for ${reason}`)

        try {
            await warned_user.send({content:`You have been warned for ${reason}`, ephemeral: true });
        }
        catch (error) {
            console.log(error)
        }


    }

    if (commandName === 'ban'){
        const user = await interaction.options('user')
        await client.guilds.cache.get(guildId).members.ban(user)
        interaction.reply(`${user.tag} has been banned`)
    }
});


// Login to Discord with your client's token
client.login(token)
    .then(async (e) => {
    await prisma.$disconnect()
     })
     .catch(async  (e) => {
        console.error(e)
         await prisma.$disconnect()
       process.exit(1)
    });