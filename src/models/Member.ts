interface Member {
    [id: string]: {
        level: number; // 成員的等級
        experience: number; // 成員的經驗值
        currency: number; // 成員的貨幣數量
    };
}

export default Member;
