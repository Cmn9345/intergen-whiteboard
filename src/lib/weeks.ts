// 週數據定義
export const weeks = [
	{
		id: "0",
		title: "第1週：相見歡",
		description: "建立小默契、分組、破冰活動",
	},
	{
		id: "1",
		title: "第2週：心情溫度計",
		description: "情緒探索、心情表達、情感連結活動",
	},
	{
		id: "2",
		title: "第3週：夢想經驗大碰撞",
		description: "職業探索、繪本故事、夢想分享活動",
	},
	{
		id: "3",
		title: "第4週：我的家人",
		description: "家人稱呼拉霸機、你演我猜（家事轉盤）、誰陪我來等活動",
	},
	{
		id: "4",
		title: "第5週：玩具時光機",
		description: "古早玩具、現代玩具、傳統遊戲分享",
	},
	{
		id: "5",
		title: "第6週：時而聲笑",
		description: "課程回顧、成果發表、歡樂結業",
	},
];

// 根據週ID獲取週標題
export function getWeekTitle(weekId: string | number): string {
	const id = typeof weekId === 'string' ? weekId : String(weekId);
	const week = weeks.find(w => w.id === id);
	return week ? week.title : `第${parseInt(id) + 1}週`;
}

// 根據週ID獲取週數據
export function getWeek(weekId: string | number) {
	const id = typeof weekId === 'string' ? weekId : String(weekId);
	return weeks.find(w => w.id === id);
}

