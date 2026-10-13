import React, { useState, useEffect, useCallback } from 'react';
import { Absence, DistrictMetrics, School, Teacher, Substitute, AiSettings } from './types';
import { api, createSignalRConnection } from './services/api';
import { Navbar } from './components/Navbar';
import { AdminPortal } from './components/AdminPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { SubstitutePortal } from './components/SubstitutePortal';
import { AiSettingsModal } from './components/AiSettingsModal';

const DEFAULT_AI_SETTINGS: AiSettings = {
  provider: 'groq',
  model: 'llama-3.3-70b-versatile',
  apiKey: '',
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('admin');
  const [signalRConnected, setSignalRConnected] = useState<boolean>(false);

  const [apiError, setApiError] = useState<string | null>(null);

  // AI Copilot Settings
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState<boolean>(false);
  const [aiSettings, setAiSettings] = useState<AiSettings>(() => {
    try {
      const saved = localStorage.getItem('subconnect_ai_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_AI_SETTINGS;
  });

  const handleSaveAiSettings = (newSettings: AiSettings) => {
    setAiSettings(newSettings);
    try {
      localStorage.setItem('subconnect_ai_settings', JSON.stringify(newSettings));
    } catch {
      // ignore
    }
  };

  // Core Data
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [, setMetrics] = useState<DistrictMetrics>({
    totalAbsencesToday: 0,
    filledCount: 0,
    openCount: 0,
    fillRatePercentage: 100.0,
    substitutesAvailable: 0,
  });
  const [, setSchools] = useState<School[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [substitutes, setSubstitutes] = useState<Substitute[]>([]);

  // Load initial data from backend API
  const loadData = useCallback(async () => {
    try {
      setApiError(null);
      const [abs, met, sch, tch, sub] = await Promise.all([
        api.getAbsences(),
        api.getMetrics(),
        api.getSchools(),
        api.getTeachers(),
        api.getSubstitutes(),
      ]);

      setAbsences(abs);
      setMetrics(met);
      setSchools(sch);
      setTeachers(tch);
      setSubstitutes(sub);
    } catch (err) {
      console.error('Error loading data from backend API', err);
      setApiError('Unable to connect to .NET API backend at http://localhost:5000. Please ensure the .NET Web API is running.');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Establish SignalR WebSocket connection for real-time absence updates
  useEffect(() => {
    const hubConnection = createSignalRConnection(
      (newAbsence: Absence) => {
        setAbsences(prev => [newAbsence, ...prev.filter(a => a.id !== newAbsence.id)]);
        api.getMetrics().then(setMetrics);
      },
      (updatedAbsence: Absence) => {
        setAbsences(prev => prev.map(a => a.id === updatedAbsence.id ? updatedAbsence : a));
        api.getMetrics().then(setMetrics);
      }
    );

    hubConnection.start()
      .then(() => {
        setSignalRConnected(true);
        console.log('✅ SignalR Connected to /hubs/absences');
      })
      .catch((err) => {
        console.warn('SignalR fallback: local mode active', err);
        setSignalRConnected(false);
      });

    return () => {
      hubConnection.stop();
    };
  }, []);

  return (
    <div className="app-container">
      {/* Top Demo Navigation Switcher (Admin / Teacher / Substitute) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        signalRConnected={signalRConnected}
        onOpenAiSettings={() => setIsAiSettingsOpen(true)}
      />

      {apiError && (
        <div style={{ background: '#fffbeb', borderBottom: '1px solid #fde68a', color: '#92400e', padding: '10px 24px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>⚠️ <strong>Backend Offline:</strong> {apiError}</span>
          <button 
            onClick={loadData} 
            style={{ background: '#d97706', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Main K-12 Portals */}
      <main className="main-content-wrapper">
        {activeTab === 'admin' && (
          <AdminPortal
            absences={absences}
            substitutes={substitutes}
            aiSettings={aiSettings}
            onOpenAiSettings={() => setIsAiSettingsOpen(true)}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'teacher' && (
          <TeacherPortal
            absences={absences}
            teachers={teachers}
            onAbsenceCreated={loadData}
          />
        )}

        {activeTab === 'substitute' && (
          <SubstitutePortal
            absences={absences}
            substitutes={substitutes}
            onShiftClaimed={loadData}
          />
        )}
      </main>

      {/* AI Settings Modal */}
      <AiSettingsModal
        isOpen={isAiSettingsOpen}
        onClose={() => setIsAiSettingsOpen(false)}
        settings={aiSettings}
        onSave={handleSaveAiSettings}
      />

      {/* Minimal Footer */}
      <footer className="footer">
        <div className="footer-content">
          <span>
            SubConnect K-12 Absence Management System • Real-Time Event-Driven Architecture
          </span>
          <span className="text-muted">
            .NET Core Web API + React 18 + Azure SignalR Hub
          </span>
        </div>
      </footer>
    </div>
  );
};
