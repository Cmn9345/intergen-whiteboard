"use client";
import React from "react";
import { useRouter } from "next/navigation";

const weeks = [
	{
		id: "0",
		title: "第0周：我的家人",
		description: "家人稱呼、你演我猜、家庭照等活動",
	},
	{
		id: "1", 
		title: "第1周：相見歡",
		description: "建立小默契、分組、破冰活動",
	},
	...Array.from({ length: 7 }, (_, i) => ({
		id: `${i + 2}`,
		title: `第${i + 2}周`,
		description: "（尚未填寫內容）",
	})),
];

export default function Page() {
	const router = useRouter();

	return (
		<main className="min-h-screen bg-gray-100 p-8 relative">
			{/* 返回主頁按鈕 */}
			<a 
				href="/" 
				className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
				title="返回主頁"
			>
				<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				<span className="text-sm font-medium text-gray-700">返回主頁</span>
			</a>

			<div className="w-full max-w-6xl mx-auto pt-16">
				<h1 className="text-3xl font-bold text-center mb-8">課程總覽</h1>
				<p className="text-center text-gray-600 mb-10">點擊下方課程卡片查看詳細內容</p>
				
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{weeks.map((week) => (
						<button
							key={week.id}
							onClick={() => router.push(`/courses/${week.id}`)}
							className="rounded-xl shadow border-2 border-gray-200 bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-200 p-6 text-left group"
						>
							<div className="flex items-center justify-between mb-3">
								<h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
									{week.title}
								</h3>
								<svg 
									className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" 
									fill="none" 
									stroke="currentColor" 
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</div>
							<p className="text-gray-600 text-sm leading-relaxed">
								{week.description}
							</p>
							<div className="mt-4 text-blue-500 text-sm font-medium group-hover:text-blue-600">
								點擊查看詳細內容 →
							</div>
						</button>
					))}
				</div>
				
				{/* 底部說明 */}
				<div className="mt-12 text-center">
					<div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
						<h3 className="text-lg font-semibold text-gray-800 mb-2">課程說明</h3>
						<p className="text-gray-600 text-sm leading-relaxed">
							本課程總覽包含9週的課程內容，每週都有不同的主題和活動安排。
							點擊上方任意課程卡片即可查看該週的詳細課程內容和活動說明。
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}