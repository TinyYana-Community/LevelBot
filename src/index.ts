import { Client, GatewayIntentBits } from "discord.js";
import * as fs from "fs";
import LevelService from "./services/LevelService";

const token: { token: string } = JSON.parse(fs.readFileSync('token.json', {
    encoding: 'utf8'
}));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log("等級系統已被啟動");
});

const levelService: LevelService = new LevelService();

client.on('messageCreate', (message) => {

});

client.on('messageReactionAdd', (reaction, user) => {

});

client.on('error', (error) => { console.log(error) });
process.on('unhandledRejection', (rejection) => { console.log(rejection) });
process.on('uncaughtException', (exception) => { console.log(exception) });

client.login(token.token);