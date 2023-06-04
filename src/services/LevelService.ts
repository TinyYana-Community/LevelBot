import Member from '../models/Member';
import * as fs from 'fs';

const dataFilePath = './data/memberData.json';
const memberData: Member = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

/**
 * A class that provides functions for managing member data, such as level, experience and currency.
 */
class LevelService {
    /**
     * Adds a given amount of experience to a member and checks if they can level up.
     * @param id The ID of the member.
     * @param exp The amount of experience to add.
     * @returns A promise that resolves when the operation is done.
     */
    static async addExp(id: string, exp: number): Promise<void> {
        await this.checkMemberData(id);
        if (memberData[id]) {
            memberData[id].experience += exp;
            if (this.canLevelUp(id)) {
                await this.addLevel(id, 1);
            }
            await this.saveMemberData(memberData);
        }
    }

    /**
     * Adds a given number of levels to a member.
     * @param id The ID of the member.
     * @param levels The number of levels to add.
     * @returns A promise that resolves when the operation is done.
     */
    static async addLevel(id: string, levels: number): Promise<void> {
        if (memberData[id]) {
            memberData[id].level += levels;
            await this.saveMemberData(memberData);
        }
    }

    /**
     * Adds a given amount of currency to a member.
     * @param id The ID of the member.
     * @param amount The amount of currency to add.
     * @returns A promise that resolves when the operation is done.
     */
    static async addCurrency(id: string, amount: number): Promise<void> {
        if (memberData[id]) {
            memberData[id].currency += amount;
            await this.saveMemberData(memberData);
        }
    }

    /**
     * Spends a given amount of currency from a member if they have enough.
     * @param id The ID of the member.
     * @param amount The amount of currency to spend.
     * @returns A promise that resolves with a boolean indicating whether the operation was successful or not.
     */
    static async spendCurrency(id: string, amount: number): Promise<boolean> {
        if (memberData[id] && memberData[id].currency >= amount) {
            memberData[id].currency -= amount;
            await this.saveMemberData(memberData);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Gets the current amount of currency of a member.
     * @param id The ID of the member.
     * @returns The amount of currency or 0 if the member does not exist.
     */
    static getCurrency(id: string): number {
        if (memberData[id]) {
            return memberData[id].currency;
        } else {
            return 0;
        }
    }

    /**
     * Gets the current level of a member.
     * @param id The ID of the member.
     * @returns The level or 0 if the member does not exist.
     */
    static async getLevel(id: string): Promise<number> {
        if (memberData[id]) {
            return memberData[id].level;
        } else {
            return 0;
        }
    }

    /**
     * Gets the current experience of a member.
     * @param id The ID of the member.
     * @returns The experience or 0 if the member does not exist.
     */
    static async getExperience(id: string): Promise<number> {
        if (memberData[id]) {
            return memberData[id].experience;
        } else {
            return 0;
        }
    }

    /**
     * Sets the currency of a member to a given amount.
     * @param id The ID of the member.
     * @param amount The amount of currency to set.
     * @returns A promise that resolves when the operation is done.
     */
    static async setCurrency(id: string, amount: number): Promise<void> {
        if (memberData[id]) {
            memberData[id].currency = amount;
            await this.saveMemberData(memberData);
        }
    }

    /**
     * Checks if a member exists in the data and creates one if not.
     * @param id The ID of the member.
     * @returns A promise that resolves when the operation is done.
     */
    static async checkMemberData(id: string): Promise<void> {
        if (!memberData[id]) {
            //init member data
            memberData[id] = {
                level: 1,
                experience: 0,
                currency: 0
            };
            await this.saveMemberData(memberData);
        }
    }

    /**
     * Checks if a member can level up based on their current level and experience.
     * @param id The ID of the member.
     * @returns A boolean indicating whether the member can level up or not.
     */
    static canLevelUp(id: string): boolean {
        const currentLevel = memberData[id].level;
        const currentExp = memberData[id].experience;
        const requiredExp = Math.floor(450 * Math.pow(1.15, currentLevel - 1));
        return currentExp >= requiredExp && currentLevel < 50;
    }

    /**
     * Checks if a member can level down based on their current level and experience.
     * @param id The ID of the member.
     * @returns A boolean indicating whether the member can level down or not.
     */
    static canLevelDown(id: string): boolean {
        const currentLevel = memberData[id].level;
        const currentExp = memberData[id].experience;
        const requiredExp = Math.floor(450 * Math.pow(1.15, currentLevel - 2));
        return currentExp < requiredExp && currentLevel > 1;
    }

    /**
     * Reduces a given amount of experience from a member and checks if they can level down.
     * @param id The ID of the member.
     * @param exp The amount of experience to reduce.
     * @returns A promise that resolves when the operation is done.
     */
    static async reduceExp(id: string, exp: number): Promise<void> {
        if (memberData[id]) {
            memberData[id].experience -= exp;
            if (this.canLevelDown(id)) {
                await this.reduceLevel(id, 1);
            }
            await this.saveMemberData(memberData);
        }
    }

    /**
     * Reduces a given number of levels from a member and sets their level to 1 if it goes below that.
     * @param id The ID of the member.
     * @param levels The number of levels to reduce.
     * @returns A promise that resolves when the operation is done.
     */
    static async reduceLevel(id: string, levels: number): Promise<void> {
        if (memberData[id]) {
            memberData[id].level -= levels;
            if (memberData[id].level < 1) {
                memberData[id].level = 1;
            }
            await this.saveMemberData(memberData);
        }
    }

    /**
     * Saves the member data to a JSON file.
     * @param memberData The member data object to save.
     * @returns A promise that resolves when the operation is done or rejects with an error if it fails.
     */
    static async saveMemberData(memberData: Member): Promise<void> {
        try {
            const data = JSON.stringify(memberData, null, 2);
            fs.writeFileSync(dataFilePath, data, 'utf-8');
        } catch (error) {
            console.error('Error saving member data:', error);
        }
    }
}

export default LevelService;