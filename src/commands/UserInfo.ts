import Discord from 'discord.js';
import LevelService from "../services/LevelService";

class UserInfo {
    constructor(client: Discord.Client) {
        client.once('ready', async () => {
            const builder = new Discord.SlashCommandBuilder();
            builder
                .setName("info")
                .setDescription("查看成員資訊，等級、經驗值、貨幣等");
            await client.application?.commands.create(builder);
        });
    }

    private async _setupEmbed(member: Discord.GuildMember) { // 使用async關鍵字
        const embed = new Discord.EmbedBuilder();
        embed
            .setTitle(member.displayName)
            .addFields(
                { name: "等級", value: (await LevelService.getLevel(member.id.toString())).toString(), inline: true },
                { name: "經驗値", value: (await LevelService.getExperience(member.id.toString())).toString(), inline: true },
                { name: "貨幣", value: LevelService.getCurrency(member.id.toString()).toString(), inline: true },
            )
            .setColor(member.displayColor)
            .setImage(member.user.avatarURL());
        return embed;
    }

    async showUserInfo(interaction: Discord.CommandInteraction) {
        await interaction.reply({ embeds: [await this._setupEmbed(interaction.member as Discord.GuildMember)] });
    }

}
export default UserInfo;