const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
require('dotenv').config();
const { token } = require('./config/config.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Slash-Befehle laden
client.commands = new Collection();
const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[WARN] ${file} fehlt 'data' oder 'execute'`);
  }
}

// Events laden
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}


// Load slash commands
client.once('ready', async () => {
  const CLIENT_ID = client.user.id;
  const GUILD_ID = process.env.GUILD_ID;

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('Registriere Slash-Befehle...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('Slash-Befehle erfolgreich registriert.');
  } catch (error) {
    console.error('Fehler beim Registrieren der Slash-Befehle:', error);
  }
});

// Bot starten
client.login(token);
