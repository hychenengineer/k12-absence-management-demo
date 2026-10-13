import React, { useState } from 'react';
import { X, Sparkles, Key, Cpu, Zap, Eye, EyeOff, Check, ShieldCheck } from 'lucide-react';
import { AiSettings } from '../types';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AiSettings;
  onSave: (newSettings: AiSettings) => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [provider, setProvider] = useState<'groq' | 'openai' | 'anthropic' | 'offline'>(settings.provider);
  const [model, setModel] = useState<string>(settings.model);
  const [apiKey, setApiKey] = useState<string>(settings.apiKey);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleProviderChange = (newProvider: 'groq' | 'openai' | 'anthropic' | 'offline') => {
    setProvider(newProvider);
    if (newProvider === 'groq') {
      setModel('llama-3.3-70b-versatile');
    } else if (newProvider === 'openai') {
      setModel('gpt-4o-mini');
    } else if (newProvider === 'anthropic') {
      setModel('claude-3-5-haiku-20241022');
    } else {
      setModel('built-in-k12-heuristics');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      provider,
      model,
      apiKey: apiKey.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-card" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '520px', width: '100%', borderRadius: '12px', background: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '8px', color: '#d97706', display: 'flex' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>AI Dispatch Copilot Settings</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Configure AI provider, model, and authentication</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: '24px' }}>
          {/* Provider Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
              <Zap size={14} style={{ display: 'inline', marginRight: '6px', color: '#d97706' }} />
              AI Inference Provider
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleProviderChange('groq')}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: provider === 'groq' ? '2px solid #FF5A43' : '1px solid #e2e8f0',
                  background: provider === 'groq' ? '#fff5f4' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>⚡ Groq (Fastest)</span>
                  {provider === 'groq' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5A43' }} />}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Sub-second LPU speed for 6:00 AM dispatch</div>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange('openai')}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: provider === 'openai' ? '2px solid #FF5A43' : '1px solid #e2e8f0',
                  background: provider === 'openai' ? '#fff5f4' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>OpenAI</span>
                  {provider === 'openai' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5A43' }} />}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>GPT-4o / GPT-4o-mini models</div>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange('anthropic')}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: provider === 'anthropic' ? '2px solid #FF5A43' : '1px solid #e2e8f0',
                  background: provider === 'anthropic' ? '#fff5f4' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Anthropic</span>
                  {provider === 'anthropic' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5A43' }} />}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Claude 3.5 Sonnet & Haiku</div>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange('offline')}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: provider === 'offline' ? '2px solid #FF5A43' : '1px solid #e2e8f0',
                  background: provider === 'offline' ? '#fff5f4' : '#ffffff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Offline Simulator</span>
                  {provider === 'offline' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF5A43' }} />}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>No API key needed (Zero config)</div>
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              <Cpu size={14} style={{ display: 'inline', marginRight: '6px', color: '#2563EB' }} />
              Model Name
            </label>
            <input 
              type="text" 
              value={model} 
              onChange={e => setModel(e.target.value)}
              disabled={provider === 'offline'}
              placeholder="e.g. llama-3.3-70b-versatile"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontFamily: 'monospace',
                background: provider === 'offline' ? '#f1f5f9' : '#ffffff',
                boxSizing: 'border-box'
              }}
            />
            {provider === 'groq' && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setModel('llama-3.3-70b-versatile')}
                  style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                >
                  llama-3.3-70b-versatile (Recommended)
                </button>
                <button
                  type="button"
                  onClick={() => setModel('llama-3.1-8b-instant')}
                  style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                >
                  llama-3.1-8b-instant
                </button>
              </div>
            )}
          </div>

          {/* API Key */}
          {provider !== 'offline' && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  <Key size={14} style={{ display: 'inline', marginRight: '6px', color: '#10b981' }} />
                  {provider.toUpperCase()} API Key
                </label>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Stored locally in browser only</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showKey ? 'text' : 'password'}
                  value={apiKey} 
                  onChange={e => setApiKey(e.target.value)}
                  placeholder={provider === 'groq' ? 'gsk_...' : provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                  style={{
                    width: '100%',
                    padding: '9px 38px 9px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <ShieldCheck size={16} style={{ color: '#10b981', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              {provider === 'offline' 
                ? 'Offline Simulator mode requires no external API keys and runs instantaneously.' 
                : 'Keys are stored in your local browser storage and sent directly to the backend for inference.'}
            </span>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '9px 20px',
                borderRadius: '6px',
                border: 'none',
                background: savedSuccess ? '#10b981' : '#FF5A43',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background 0.2s ease'
              }}
            >
              {savedSuccess ? (
                <>
                  <Check size={16} />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
