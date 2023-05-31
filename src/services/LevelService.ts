import Member from '../models/Member';
import * as fs from 'fs';

const dataFilePath = '../data/memberData.json';
const memberData: Member = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

class LevelService {
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

    static async addLevel(id: string, levels: number): Promise<void> {
        if (memberData[id]) {
            memberData[id].level += levels;
            await this.saveMemberData(memberData);
        }
    }

    static async addCurrency(id: string, amount: number): Promise<void> {
        if (memberData[id]) {
            memberData[id].currency += amount;
            await this.saveMemberData(memberData);
        }
    }

    static async spendCurrency(id: string, amount: number): Promise<boolean> {
        if (memberData[id] && memberData[id].currency >= amount) {
            memberData[id].currency -= amount;
            await this.saveMemberData(memberData);
            return true; // 表示消費成功
        } else {
            return false; // 表示消費失敗
        }
    }

    static getCurrency(id: string): number {
        if (memberData[id]) {
            return memberData[id].currency;
        } else {
            return 0;
        }
    }

    static async getLevel(id: string): Promise<number> {
        if (memberData[id]) {
            return memberData[id].level; // 返回成員的等級
        } else {
            return 0; // 如果沒有成員資料，返回0
        }
    }

    static async getExperience(id: string): Promise<number> {
        if (memberData[id]) {
            return memberData[id].experience; // 返回成員的經驗值
        } else {
            return 0; // 如果沒有成員資料，返回0
        }
    }


    static async setCurrency(id: string, amount: number): Promise<void> {
        if (memberData[id]) {
            memberData[id].currency = amount;
            await this.saveMemberData(memberData);
        }
    }

    static async checkMemberData(id: string): Promise<void> {
        if (!memberData[id]) { // 如果沒有成員資料
            memberData[id] = { // 創建一個新資料
                level: 1, // 初始等級為1
                experience: 0, // 初始經驗值為0
                currency: 0 // 初始貨幣數量為0
            };
            await this.saveMemberData(memberData); // 保存成員資料
        }
    }

    static canLevelUp(id: string): boolean {
        const currentLevel = memberData[id].level;
        const currentExp = memberData[id].experience;
        const requiredExp = Math.floor(450 * Math.pow(1.15, currentLevel - 1));
        return currentExp >= requiredExp && currentLevel < 50;
    }

    static canLevelDown(id: string): boolean {
        const currentLevel = memberData[id].level;
        const currentExp = memberData[id].experience;
        const requiredExp = Math.floor(450 * Math.pow(1.15, currentLevel - 2)); // 計算上一個等級所需的經驗值
        return currentExp < requiredExp && currentLevel > 1; // 如果經驗值低於所需值且等級高於1，則可以降級
    }

    static async reduceExp(id: string, exp: number): Promise<void> {
        if (memberData[id]) {
            memberData[id].experience -= exp; // 減少經驗值
            if (this.canLevelDown(id)) { // 檢查是否可以降級
                await this.reduceLevel(id, 1); // 降低一個等級
            }
            await this.saveMemberData(memberData);
        }
    }

    static async reduceLevel(id: string, levels: number): Promise<void> {
        if (memberData[id]) {
            memberData[id].level -= levels; // 減少等級
            if (memberData[id].level < 1) { // 如果等級低於1
                memberData[id].level = 1; // 將等級設為1
            }
            await this.saveMemberData(memberData);
        }
    }

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