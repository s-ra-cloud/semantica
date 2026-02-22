import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSemantic, SynonymGroup } from '@/context/SemanticContext';
import { Link } from 'wouter';
import { Plus, Trash2, ArrowLeft, RotateCcw, Lock, Download, Upload, MessageSquare, X, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Editor() {
  const { synonymGroups, isLoading, addGroup, updateGroup, deleteGroup, resetDefaults, refetch, authToken, setAuthToken } = useSemantic();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAuthenticated = !!authToken;

  useEffect(() => {
    if (authToken) {
      fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${authToken}` },
      }).then(res => {
        if (!res.ok) setAuthToken(null);
      }).catch(() => setAuthToken(null));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const { token } = await res.json();
        setAuthToken(token);
        setShowLoginModal(false);
        setErrorMessage(null);
        setPassword('');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.message || 'Incorrect password');
      }
    } catch {
      setErrorMessage('Connection error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if (authToken) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
      }).catch(() => {});
    }
    setAuthToken(null);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset to default expressions? All custom expressions will be lost.")) {
      resetDefaults();
    }
  };

  const handleExport = async () => {
    const res = await fetch('/api/synonym-groups/export');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'semantica-expressions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const groups = JSON.parse(text);
      if (!Array.isArray(groups)) {
        setImportStatus('Error: file must contain a JSON array');
        return;
      }

      if (!confirm(`This will replace all ${synonymGroups.length} current expressions with ${groups.length} from the file. Continue?`)) {
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
      const res = await fetch('/api/synonym-groups/import', {
        method: 'POST',
        headers,
        body: JSON.stringify({ groups }),
      });

      if (!res.ok) {
        const err = await res.json();
        setImportStatus(`Error: ${err.message}`);
      } else {
        const result = await res.json();
        setImportStatus(`Imported ${result.count} expression groups`);
        refetch();
      }
    } catch {
      setImportStatus('Error: invalid JSON file');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setImportStatus(null), 4000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-zinc-300 flex items-center justify-center">
        <p className="text-zinc-500">Loading expressions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans p-6 md:p-12 selection:bg-green-500/30">
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}>
          <div className="w-full max-w-sm p-8 border border-zinc-800 rounded-2xl bg-zinc-900/95 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-zinc-400" />
              </div>
              <h2 className="text-2xl font-display font-medium text-white">Admin Access</h2>
              <p className="text-zinc-500 text-sm mt-2 text-center">Enter the password to edit expressions</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Password"
                  className={`bg-zinc-950 border-zinc-800 focus-visible:ring-green-500/50 text-white h-12 ${errorMessage ? 'border-red-500/50 focus-visible:ring-red-500/50' : ''}`}
                  autoFocus
                  data-testid="input-admin-password"
                />
                {errorMessage && <p className="text-red-400 text-xs mt-2">{errorMessage}</p>}
              </div>
              <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 h-12 text-sm font-medium" data-testid="btn-admin-submit">
                Access Database
              </Button>
            </form>

            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white" data-testid="btn-close-login-modal">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <h1 className="text-3xl font-display font-medium text-white flex-1">Expression Database</h1>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleReset} className="border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900/50">
                <RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="text-zinc-500 hover:text-white" data-testid="btn-logout">
                <LogOut className="w-4 h-4 mr-2" /> Log out
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setShowLoginModal(true)} className="border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900/50" data-testid="btn-login">
              <LogIn className="w-4 h-4 mr-2" /> Admin
            </Button>
          )}
        </div>
        
        <p className="text-zinc-400 mb-6 max-w-2xl">
          {isAuthenticated
            ? 'Define groups of interchangeable expressions. When any word in a group is found in the Tractatus text, it will become interactive and can be swapped with other words in the same group.'
            : 'Browse the groups of interchangeable expressions used in the Tractatus. You can send feedback about any entry.'
          }
          <span className="text-zinc-500 ml-1" data-testid="text-total-expressions">({synonymGroups.length} expressions)</span>
        </p>

        {isAuthenticated && (
          <div className="flex flex-wrap items-center gap-3 mb-8 p-4 border border-zinc-800 rounded-xl bg-zinc-900/20">
            <Button variant="outline" onClick={handleExport} className="border-zinc-700 text-zinc-400 hover:text-white bg-zinc-900/50" data-testid="btn-export-db">
              <Download className="w-4 h-4 mr-2" /> Export DB
            </Button>
            <label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                data-testid="input-import-file"
              />
              <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white bg-zinc-900/50 cursor-pointer" onClick={() => fileInputRef.current?.click()} data-testid="btn-import-db">
                <Upload className="w-4 h-4 mr-2" /> Import DB
              </Button>
            </label>
            {importStatus && (
              <span className={`text-xs ${importStatus.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {importStatus}
              </span>
            )}
          </div>
        )}

        <div className="space-y-6">
          {(() => {
            const groupKeyColors: Record<string, string> = {};
            const colorPalette = [
              'border-l-emerald-500/60', 'border-l-blue-500/60', 'border-l-purple-500/60',
              'border-l-amber-500/60', 'border-l-rose-500/60', 'border-l-cyan-500/60',
              'border-l-orange-500/60', 'border-l-pink-500/60', 'border-l-teal-500/60',
              'border-l-indigo-500/60', 'border-l-lime-500/60', 'border-l-fuchsia-500/60',
              'border-l-sky-500/60', 'border-l-violet-500/60', 'border-l-red-500/60',
              'border-l-yellow-500/60', 'border-l-green-500/60',
            ];
            let colorIndex = 0;
            synonymGroups.forEach(g => {
              if (g.groupKey && !groupKeyColors[g.groupKey]) {
                groupKeyColors[g.groupKey] = colorPalette[colorIndex % colorPalette.length];
                colorIndex++;
              }
            });

            const rendered = new Set<number>();
            const result: React.ReactNode[] = [];

            synonymGroups.forEach(group => {
              if (rendered.has(group.id)) return;

              if (group.groupKey) {
                const siblings = synonymGroups.filter(g => g.groupKey === group.groupKey);
                siblings.forEach(s => rendered.add(s.id));
                const borderColor = groupKeyColors[group.groupKey];
                if (isAuthenticated) {
                  result.push(
                    <div key={`gk-${group.groupKey}`} className={`border-l-4 ${borderColor} pl-4 space-y-3`}>
                      <div className="text-xs text-zinc-500 font-mono mb-1">Group: {group.groupKey}</div>
                      {siblings.map(s => (
                        <GroupEditor
                          key={s.id}
                          group={s}
                          onUpdate={(g) => updateGroup(s.id, { language: g.language, words: g.words, type: g.type || 'semantic', groupKey: g.groupKey, excludedPropositions: g.excludedPropositions })}
                          onDelete={() => deleteGroup(s.id)}
                        />
                      ))}
                    </div>
                  );
                } else {
                  result.push(
                    <GroupViewerMerged key={`gk-${group.groupKey}`} groups={siblings} groupKey={group.groupKey} borderColor={borderColor} />
                  );
                }
              } else {
                rendered.add(group.id);
                result.push(
                  isAuthenticated ? (
                    <GroupEditor
                      key={group.id}
                      group={group}
                      onUpdate={(g) => updateGroup(group.id, { language: g.language, words: g.words, type: g.type || 'semantic', groupKey: g.groupKey, excludedPropositions: g.excludedPropositions })}
                      onDelete={() => deleteGroup(group.id)}
                    />
                  ) : (
                    <GroupViewer key={group.id} group={group} />
                  )
                );
              }
            });

            return result;
          })()}
          
          {isAuthenticated && (
            <Button 
              onClick={async () => { await addGroup({ language: 'en', words: [''], type: 'semantic', groupKey: null, excludedPropositions: null }); setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 500); }}
              variant="outline" 
              className="w-full h-16 border-dashed border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 bg-transparent hover:bg-zinc-900/30"
              data-testid="btn-add-group"
            >
              <Plus className="w-5 h-5 mr-2" /> Add New Expression Group
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function GroupViewer({ group }: { group: SynonymGroup }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackSending, setFeedbackSending] = useState(false);

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) return;
    setFeedbackSending(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propositionId: `expression-group-${group.id}`,
          language: group.language,
          message: `[Expression Group #${group.id} — ${group.words.join(', ')}] ${feedbackText}`,
        }),
      });
      setFeedbackSent(true);
      setFeedbackText('');
      setTimeout(() => { setFeedbackSent(false); setShowFeedback(false); }, 3000);
    } catch {
    } finally {
      setFeedbackSending(false);
    }
  };

  return (
    <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30 shadow-lg" data-testid={`group-viewer-${group.id}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{group.language === 'en' ? 'English' : group.language === 'fr' ? 'French' : group.language === 'de' ? 'German' : group.language}</span>
          <span className="text-sm text-zinc-500 font-mono">ID: {group.id}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${group.type === 'math-logic' ? 'bg-purple-500/20 text-purple-400' : group.type === 'logic' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
            {group.type === 'math-logic' ? 'Math' : group.type === 'logic' ? 'Logic' : 'Semantic'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { setShowFeedback(!showFeedback); setFeedbackSent(false); }}
          className="text-zinc-500 hover:text-amber-400 hover:bg-amber-400/10"
          data-testid={`btn-feedback-group-${group.id}`}
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {group.words.filter(w => w.trim()).map((word, idx) => (
          <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm ${group.type === 'math-logic' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : group.type === 'logic' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' : 'bg-green-500/10 text-green-300 border border-green-500/20'}`}>
            {word}
          </span>
        ))}
      </div>

      {group.excludedPropositions && group.excludedPropositions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-zinc-500 mr-1">Excluded from:</span>
          {group.excludedPropositions.map((p, idx) => (
            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono">{p}</span>
          ))}
        </div>
      )}

      {showFeedback && (
        <div className="mt-4 p-4 border border-zinc-700 rounded-lg bg-zinc-950/50">
          {feedbackSent ? (
            <p className="text-green-400 text-sm">Thank you for your feedback!</p>
          ) : (
            <div className="flex flex-col gap-2">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Say something about this entry..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 h-20 resize-none focus:outline-none focus:border-amber-500/50"
                data-testid={`input-feedback-group-${group.id}`}
              />
              <Button
                onClick={handleSendFeedback}
                disabled={feedbackSending || !feedbackText.trim()}
                size="sm"
                className="self-end bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-xs"
                data-testid={`btn-send-feedback-group-${group.id}`}
              >
                {feedbackSending ? 'Sending...' : 'Send Feedback'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GroupViewerMerged({ groups, groupKey, borderColor }: { groups: SynonymGroup[]; groupKey: string; borderColor: string }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackSending, setFeedbackSending] = useState(false);

  const langLabel = (l: string) => l === 'en' ? 'EN' : l === 'fr' ? 'FR' : l === 'de' ? 'DE' : l.toUpperCase();
  const first = groups[0];
  const excludedProps = groups.find(g => g.excludedPropositions && g.excludedPropositions.length > 0)?.excludedPropositions;

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) return;
    setFeedbackSending(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propositionId: `expression-group-key-${groupKey}`,
          language: first.language,
          message: `[Group "${groupKey}" — IDs: ${groups.map(g => g.id).join(', ')}] ${feedbackText}`,
        }),
      });
      setFeedbackSent(true);
      setFeedbackText('');
      setTimeout(() => { setFeedbackSent(false); setShowFeedback(false); }, 3000);
    } catch {
    } finally {
      setFeedbackSending(false);
    }
  };

  return (
    <div className={`border-l-4 ${borderColor} pl-4`}>
      <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30 shadow-lg" data-testid={`group-viewer-merged-${groupKey}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 font-mono">{groupKey}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${first.type === 'math-logic' ? 'bg-purple-500/20 text-purple-400' : first.type === 'logic' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
              {first.type === 'math-logic' ? 'Math' : first.type === 'logic' ? 'Logic' : 'Semantic'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setShowFeedback(!showFeedback); setFeedbackSent(false); }}
            className="text-zinc-500 hover:text-amber-400 hover:bg-amber-400/10"
            data-testid={`btn-feedback-merged-${groupKey}`}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {groups.map(g => (
            <div key={g.id}>
              <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">{langLabel(g.language)}</div>
              <div className="flex flex-wrap gap-1.5">
                {g.words.filter(w => w.trim()).map((word, idx) => (
                  <span key={idx} className={`px-2.5 py-1 rounded-lg text-sm ${first.type === 'math-logic' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : first.type === 'logic' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' : 'bg-green-500/10 text-green-300 border border-green-500/20'}`}>
                    {word}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {excludedProps && excludedProps.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-zinc-500 mr-1">Excluded from:</span>
            {excludedProps.map((p, idx) => (
              <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono">{p}</span>
            ))}
          </div>
        )}

        {showFeedback && (
          <div className="mt-4 p-4 border border-zinc-700 rounded-lg bg-zinc-950/50">
            {feedbackSent ? (
              <p className="text-green-400 text-sm">Thank you for your feedback!</p>
            ) : (
              <div className="flex flex-col gap-2">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Say something about this entry..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 h-20 resize-none focus:outline-none focus:border-amber-500/50"
                  data-testid={`input-feedback-merged-${groupKey}`}
                />
                <Button
                  onClick={handleSendFeedback}
                  disabled={feedbackSending || !feedbackText.trim()}
                  size="sm"
                  className="self-end bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-xs"
                  data-testid={`btn-send-feedback-merged-${groupKey}`}
                >
                  {feedbackSending ? 'Sending...' : 'Send Feedback'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function GroupEditor({ group, onUpdate, onDelete }: { group: SynonymGroup, onUpdate: (g: SynonymGroup) => void, onDelete: () => void }) {
  const [localWords, setLocalWords] = useState<string[]>(group.words);
  const [localLang, setLocalLang] = useState(group.language);
  const [localGroupKey, setLocalGroupKey] = useState(group.groupKey || '');
  const [localExcluded, setLocalExcluded] = useState((group.excludedPropositions || []).join(', '));
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalWords(group.words);
    setLocalLang(group.language);
    setLocalGroupKey(group.groupKey || '');
    setLocalExcluded((group.excludedPropositions || []).join(', '));
  }, [group.id]);

  const currentGroup = () => ({
    ...group,
    language: localLang,
    words: localWords,
    groupKey: localGroupKey.trim() || null,
    excludedPropositions: localExcluded.trim() ? localExcluded.split(',').map(s => s.trim()).filter(Boolean) : null,
  });

  const saveDebounced = useCallback((updated: SynonymGroup) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onUpdate(updated);
    }, 600);
  }, [onUpdate]);

  const handleWordChange = (idx: number, val: string) => {
    const newWords = [...localWords];
    newWords[idx] = val;
    setLocalWords(newWords);
    saveDebounced({ ...currentGroup(), words: newWords });
  };
  
  const removeWord = (idx: number) => {
    const newWords = localWords.filter((_, i) => i !== idx);
    setLocalWords(newWords);
    onUpdate({ ...currentGroup(), words: newWords });
  };

  const addWord = () => {
    const newWords = [...localWords, ''];
    setLocalWords(newWords);
    onUpdate({ ...currentGroup(), words: newWords });
  };

  const handleLangChange = (val: string) => {
    setLocalLang(val);
    onUpdate({ ...currentGroup(), language: val });
  };

  const handleGroupKeyChange = (val: string) => {
    setLocalGroupKey(val);
    saveDebounced({ ...currentGroup(), groupKey: val.trim() || null });
  };

  const handleExcludedChange = (val: string) => {
    setLocalExcluded(val);
    const parsed = val.trim() ? val.split(',').map(s => s.trim()).filter(Boolean) : null;
    saveDebounced({ ...currentGroup(), excludedPropositions: parsed });
  };

  return (
    <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30 shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <Select 
            value={localLang} 
            onValueChange={handleLangChange}
          >
            <SelectTrigger className="w-[120px] bg-zinc-950 border-zinc-800 text-zinc-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-zinc-500 font-mono">ID: {group.id}</div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${group.type === 'math-logic' ? 'bg-purple-500/20 text-purple-400' : group.type === 'logic' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
            {group.type === 'math-logic' ? 'Math' : group.type === 'logic' ? 'Logic' : 'Semantic'}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete} className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {localWords.map((word, idx) => (
          <div key={idx} className="flex gap-3">
            <Input 
              value={word} 
              onChange={e => handleWordChange(idx, e.target.value)}
              placeholder="Enter an expression..."
              className="bg-zinc-950 border-zinc-800 focus-visible:ring-green-500/50 text-white"
            />
            <Button variant="ghost" size="icon" onClick={() => removeWord(idx)} disabled={localWords.length === 1} className="text-zinc-500 hover:text-white">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button variant="ghost" size="sm" onClick={addWord} className="text-zinc-400 hover:text-green-400 mt-4">
          <Plus className="w-4 h-4 mr-2" /> Add synonym
        </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
        <div className="flex items-center gap-3">
          <label className="text-xs text-zinc-500 w-24 shrink-0">Group Key</label>
          <Input
            value={localGroupKey}
            onChange={e => handleGroupKeyChange(e.target.value)}
            placeholder="e.g. world, form, thought..."
            className="bg-zinc-950 border-zinc-800 focus-visible:ring-green-500/50 text-white text-sm h-8"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-zinc-500 w-24 shrink-0">Excluded Props</label>
          <Input
            value={localExcluded}
            onChange={e => handleExcludedChange(e.target.value)}
            placeholder="e.g. 2.0122, 4.012, 5.451..."
            className="bg-zinc-950 border-zinc-800 focus-visible:ring-green-500/50 text-white text-sm h-8"
          />
        </div>
      </div>
    </div>
  );
}
