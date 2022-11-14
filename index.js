// Require the necessary discord.js classes
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Events, GatewayIntentBits, Intents, SlashCommandBuilder, Guild } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers] });

const { token, clientID, guildId } = require('./config.json');

const fs = require('fs');
const path = require('path');

// Create a client.commands Collection
client.commands = new Collection();
// Create a const that holds the path you want it to look at
const commandsPath = path.join(__dirname, 'commands');
// Create a const that filters based on files ending in js
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Loop through and find all files that end in js for the specfied folder
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);

}

// Listen for events looking for commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);

const triggerWords = ['banana', 'fire', 'white'];

client.on('messageCreate', (message) => {
  if (message.author.bot) return false;

  triggerWords.forEach((word) => {
    if (message.content.includes(word)) {
      message.reply(message.content);
    }
  });
});