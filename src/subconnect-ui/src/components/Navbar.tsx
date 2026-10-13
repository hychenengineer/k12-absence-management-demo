import { 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Radio,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  signalRConnected: boolean;
  onOpenAiSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  signalRConnected,
  onOpenAiSettings,
}) => {
  const tabs = [
    { 
      id: 'admin', 
      label: 'School Admin', 
      sublabel: 'Live Board & Dispatch', 
      icon: Building2 
    },
    { 
      id: 'teacher', 
      label: 'Teacher', 
      sublabel: 'Absence & Coverage Tracker', 
      icon: GraduationCap 
    },
    { 
      id: 'substitute', 
      label: 'Substitute', 
      sublabel: 'Accept / Decline & Schedule', 
      icon: Briefcase 
    },
  ];

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand-section">
          <div className="logo-badge">
            <span className="logo-dot"></span>
            <span className="logo-text">SUBCONNECT</span>
          </div>
          <span className="brand-subtitle">K-12 District Platform</span>
        </div>

        {/* 3 Main Persona Tabs */}
        <nav className="nav-tabs role-switcher-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`nav-tab-btn role-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} className="tab-icon" />
                <div className="tab-text-group">
                  <span className="tab-title">{tab.label}</span>
                  <span className="tab-sublabel">{tab.sublabel}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onOpenAiSettings && (
            <button 
              onClick={onOpenAiSettings}
              className="ai-settings-nav-btn"
              title="Configure AI Model & Provider (Groq, OpenAI, Anthropic)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '20px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#1e293b',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <Sparkles size={13} style={{ color: '#d97706' }} />
              <span>AI Settings</span>
            </button>
          )}
          <div className={`status-pill ${signalRConnected ? 'live' : 'fallback'}`}>
            <Radio size={13} className={signalRConnected ? 'pulse' : ''} />
            <span>{signalRConnected ? 'Azure SignalR Live' : 'Local Connected'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
