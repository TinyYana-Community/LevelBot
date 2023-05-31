import { Client, GatewayIntentBits } from "discord.js";
import * as fs from "fs";
import LevelService from "./services/LevelService";
import Config from "./models/Config";
import UserInfo from "./commands/UserInfo";

const config: Config = JSON.parse(fs.readFileSync('config.json', {
    encoding: 'utf8'
}));

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

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    await LevelService.addExp(message.author.id, config.exp.chatMessageExpCount);
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;
    await LevelService.addExp(user.id, config.exp.reationExpCount);
});

const userInfo = new UserInfo(client);

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        await userInfo.showUserInfo(interaction);
    }
});

client.on('error', (error) => { console.log(error) });
process.on('unhandledRejection', (rejection) => { console.log(rejection) });
process.on('uncaughtException', (exception) => { console.log(exception) });

client.login(token.token);