/**
 * TRỢ LÝ TOÁN LỚP 4 – MATH 4 AI
 * Ứng dụng dạy và học Toán tương tác trên màn hình TV lớp học
 */

import React, { useState, useEffect } from 'react';
import { AppTab } from './types';
import { Header } from './components/Header';
import { HomeHero } from './components/home/HomeHero';
import { LessonsTab } from './components/lessons/LessonsTab';
import { VirtualToolsSandbox } from './components/tools/VirtualToolsSandbox';
import { SampleActivities } from './components/activities/SampleActivities';
import { MathGames } from './components/games/MathGames';
import { MathAIAssistant } from './components/ai/MathAIAssistant';
import { ExercisesTab } from './components/exercises/ExercisesTab';
import { ResultsTab } from './components/results/ResultsTab';
import { TeacherTVBanner } from './components/TeacherTVBanner';
import { QRRemoteModal } from './components/QRRemoteModal';
import { playSound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [tvMode, setTvMode] = useState<boolean>(false);
  const [tvScale, setTvScale] = useState<number>(1.05);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  // Keyboard shortcuts for classroom TV presentation
  useEffect(() => {
    const tabsList: AppTab[] = [
      'home',
      'lessons',
      'tools',
      'activities',
      'games',
      'ai-assistant',
      'exercises',
      'results',
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs/textareas
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        playSound.pop();
        setTvMode((prev) => {
          const next = !prev;
          if (next && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else if (!next && document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
          return next;
        });
      } else if (e.key === 'Escape' && tvMode) {
        setTvMode(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      } else if (e.key === 'ArrowRight' && tvMode) {
        // Next tab in TV mode
        e.preventDefault();
        playSound.click();
        setActiveTab((cur) => {
          const idx = tabsList.indexOf(cur);
          return tabsList[(idx + 1) % tabsList.length];
        });
      } else if (e.key === 'ArrowLeft' && tvMode) {
        // Prev tab in TV mode
        e.preventDefault();
        playSound.click();
        setActiveTab((cur) => {
          const idx = tabsList.indexOf(cur);
          return tabsList[idx <= 0 ? tabsList.length - 1 : idx - 1];
        });
      } else if ((e.key === '+' || e.key === '=') && tvMode) {
        e.preventDefault();
        playSound.click();
        setTvScale((s) => Math.min(1.5, Number((s + 0.1).toFixed(1))));
      } else if ((e.key === '-' || e.key === '_') && tvMode) {
        e.preventDefault();
        playSound.click();
        setTvScale((s) => Math.max(0.9, Number((s - 0.1).toFixed(1))));
      } else if (e.key === '0') {
        setActiveTab('home');
      } else if (e.key === '1') {
        setActiveTab('lessons');
      } else if (e.key === '2') {
        setActiveTab('tools');
      } else if (e.key === '3') {
        setActiveTab('activities');
      } else if (e.key === '4') {
        setActiveTab('games');
      } else if (e.key === '5') {
        setActiveTab('ai-assistant');
      } else if (e.key === '6') {
        setActiveTab('exercises');
      } else if (e.key === '7') {
        setActiveTab('results');
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setTvMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [tvMode]);

  return (
    <div
      style={{
        fontSize: tvMode ? `${tvScale * 100}%` : '100%',
        transformOrigin: 'top center',
      }}
      className={`min-h-screen w-full overflow-x-hidden bg-slate-100 flex flex-col font-sans transition-all duration-200 ${
        tvMode ? 'tv-presentation-mode bg-slate-900/5' : ''
      }`}
    >
      {/* Main Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tvMode={tvMode}
        setTvMode={setTvMode}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        openQrModal={() => {
          playSound.click();
          setIsQrModalOpen(true);
        }}
        openActivities={() => {
          playSound.click();
          setActiveTab('activities');
        }}
      />

      {/* Main Screen Body - 16:9 Widescreen Optimized */}
      <main className={`flex-1 pb-20 w-full overflow-x-hidden ${tvMode ? 'tv-canvas-16-9' : ''}`}>
        {activeTab === 'home' && (
          <HomeHero
            setActiveTab={setActiveTab}
            openQrModal={() => {
              playSound.click();
              setIsQrModalOpen(true);
            }}
            setTvMode={setTvMode}
          />
        )}

        {activeTab === 'lessons' && (
          <LessonsTab
            tvMode={tvMode}
            onBackToHome={() => {
              playSound.pop();
              setActiveTab('home');
            }}
          />
        )}

        {activeTab === 'tools' && (
          <VirtualToolsSandbox
            tvMode={tvMode}
            onBackToHome={() => {
              playSound.pop();
              setActiveTab('home');
            }}
          />
        )}

        {activeTab === 'activities' && (
          <SampleActivities
            tvMode={tvMode}
            onBackToHome={() => {
              playSound.pop();
              setActiveTab('home');
            }}
          />
        )}

        {activeTab === 'games' && (
          <MathGames
            tvMode={tvMode}
            onBackToHome={() => {
              playSound.pop();
              setActiveTab('home');
            }}
          />
        )}

        {activeTab === 'ai-assistant' && (
          <MathAIAssistant
            tvMode={tvMode}
            onBackToHome={() => {
              playSound.pop();
              setActiveTab('home');
            }}
          />
        )}

        {activeTab === 'exercises' && (
          <ExercisesTab
            tvMode={tvMode}
            onBackToHome={() => {
              playSound.pop();
              setActiveTab('home');
            }}
          />
        )}

        {activeTab === 'results' && (
          <ResultsTab
            tvMode={tvMode}
            onBackToHome={() => {
              playSound.pop();
              setActiveTab('home');
            }}
          />
        )}
      </main>

      {/* Floating Teacher TV Presentation Toolbar */}
      <TeacherTVBanner
        tvMode={tvMode}
        setTvMode={setTvMode}
        scale={tvScale}
        setScale={setTvScale}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* QR Remote Controller Modal */}
      <QRRemoteModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        setActiveTab={setActiveTab}
        setTvMode={setTvMode}
      />
    </div>
  );
}
