
const { REST, SlashCommandBuilder, Routes, User} = require('discord.js');
const { clientId, guildId, token } = require('../config.json');

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('measures ping of the bot'),
    new SlashCommandBuilder().setName('warn').setDescription('warns the user').addSubcommand(User =>
    User
        .setName('user')
        .setDescription('gets user info')
        .addUserOption(options => options.setName('target').setDescription('The user').setRequired(true))
        .addStringOption(options => options.setName('reason').setDescription('reason why warm').setRequired(true) )
    ),
    new SlashCommandBuilder().setName('ban').setDescription('bans user').addSubcommand(ban =>
    ban
        .setName('user')
        .setDescription('chooses user')
        .addUserOption(options => options.setName('user').setDescription('targets user').setRequired(true))

    )

]
    .map(command => command.toJSON());


const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
    .catch(console.error);
