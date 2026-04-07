"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getWeekTitle } from "@/lib/weeks";

// 合奏歌曲列表
const ensembleSongs = [
  {
    id: "hippo",
    name: "河馬歌",
    url: "https://youtu.be/1OjkOZ7HhFc?si=xXvTlycalF1aS5OK",
    videoId: "1OjkOZ7HhFc"
  },
  {
    id: "aram",
    name: "A Ram Sam Sam",
    url: "https://youtu.be/t59wPLPdzcM?feature=shared",
    videoId: "t59wPLPdzcM"
  },
  {
    id: "embrace",
    name: "擁抱世界擁抱你",
    url: "https://youtu.be/rBvJ3CFnnQU?si=pqN4d3qRlVEjzKnz",
    videoId: "rBvJ3CFnnQU"
  },
  {
    id: "environment",
    name: "人人做環保",
    url: "https://youtu.be/-Cmj65rNdok?si=rYBF9UnuHjaA9IGf",
    videoId: "-Cmj65rNdok"
  },
  {
    id: "mud",
    name: "捏泥巴",
    url: "https://youtu.be/qn_0T9gerCA?si=dkcJyXYjmxImhxdg",
    videoId: "qn_0T9gerCA"
  },
  {
    id: "copper",
    name: "丟丟銅仔",
    url: "https://youtu.be/baRAM0RVhn8?si=FixdUEn7tj5gQgjC",
    videoId: "baRAM0RVhn8"
  }
];

export default function EnsemblePage() {
  const router = useRouter();
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedSongName, setSelectedSongName] = useState<string>("");

  const handlePlayVideo = (videoId: string, songName: string) => {
    setSelectedVideoId(videoId);
    setSelectedSongName(songName);
  };

  const handleCloseVideo = () => {
    setSelectedVideoId(null);
    setSelectedSongName("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex flex-col relative">
      {/* 返回按鈕 */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => router.push('/courses/4')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          title={`返回${getWeekTitle('4')}課程`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium text-gray-700">返回{getWeekTitle('4')}</span>
        </button>
      </div>

      {selectedVideoId ? (
        // 播放影片模式
        <div className="w-full h-screen bg-black relative">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1&cc_load_policy=1&iv_load_policy=3`}
            title={selectedSongName}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
          
          {/* 關閉按鈕 */}
          <button
            onClick={handleCloseVideo}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
            title="返回歌曲列表"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm font-medium text-gray-700">返回列表</span>
          </button>

          {/* 標題顯示在頂部中央（不擋播放器控制欄） */}
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-black bg-opacity-70 text-white px-6 py-2 rounded-lg pointer-events-none">
            <h2 className="text-lg font-semibold">{selectedSongName}</h2>
          </div>
        </div>
      ) : (
        // 歌曲列表模式
        <div className="flex-1 flex flex-col items-center justify-center p-8 pt-24">
          <div className="w-full max-w-4xl">
            <h1 className="text-5xl font-bold text-orange-800 mb-4 text-center">🎵 合奏</h1>
            <p className="text-xl text-gray-700 mb-8 text-center">
              選擇一首歌曲，一起合奏吧！
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ensembleSongs.map((song) => (
                <button
                  key={song.id}
                  onClick={() => handlePlayVideo(song.videoId, song.name)}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-2 border-orange-200 hover:border-orange-400 text-left group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-orange-600 group-hover:text-orange-700">
                      {song.name}
                    </h3>
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-gray-600 text-sm">
                    點擊播放
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

