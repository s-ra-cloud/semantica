import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSemantic, SynonymGroup } from '@/context/SemanticContext';
import { Link } from 'wouter';
import { Plus, Trash2, ArrowLeft, RotateCcw, Lock, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Editor() {
  const { synonymGroups, isLoading, addGroup, updateGroup, deleteGroup, resetDefaults, refetch } = useSemantic();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Trismegiste') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
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

      const res = await fetch('/api/synonym-groups/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'Trismegiste', groups }),
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-zinc-300 font-sans p-6 md:p-12 flex items-center justify-center selection:bg-green-500/30">
        <div className="w-full max-w-sm p-8 border border-zinc-800 rounded-2xl bg-zinc-900/30 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-zinc-400" />
            </div>
            <h1 className="text-2xl font-display font-medium text-white">Database Access</h1>
            <p className="text-zinc-500 text-sm mt-2 text-center">Enter the password to edit expressions</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Password"
                className={`bg-zinc-950 border-zinc-800 focus-visible:ring-green-500/50 text-white h-12 ${error ? 'border-red-500/50 focus-visible:ring-red-500/50' : ''}`}
                autoFocus
              />
              {error && <p className="text-red-400 text-xs mt-2">Incorrect password</p>}
            </div>
            <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 h-12 text-sm font-medium">
              Access Database
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="ghost" className="text-zinc-500 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tractatus
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-zinc-300 flex items-center justify-center">
        <p className="text-zinc-500">Loading expressions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans p-6 md:p-12 selection:bg-green-500/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <h1 className="text-3xl font-display font-medium text-white flex-1">Expression Database</h1>
          <Button variant="outline" onClick={handleReset} className="border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900/50">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults
          </Button>
        </div>
        
        <p className="text-zinc-400 mb-6 max-w-2xl">
          Define groups of interchangeable expressions. When any word in a group is found in the Tractatus text, it will become interactive and can be swapped with other words in the same group.
          <span className="text-zinc-500 ml-1" data-testid="text-total-expressions">({synonymGroups.length} expressions)</span>
        </p>

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

        <div className="space-y-6">
          {synonymGroups.map(group => (
            <GroupEditor 
              key={group.id} 
              group={group} 
              onUpdate={(g) => updateGroup(group.id, { language: g.language, words: g.words, type: g.type || 'semantic' })} 
              onDelete={() => deleteGroup(group.id)} 
            />
          ))}
          
          <Button 
            onClick={async () => { await addGroup({ language: 'en', words: [''], type: 'semantic' }); setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 500); }}
            variant="outline" 
            className="w-full h-16 border-dashed border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 bg-transparent hover:bg-zinc-900/30"
            data-testid="btn-add-group"
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Expression Group
          </Button>
        </div>
      </div>
    </div>
  );
}

function GroupEditor({ group, onUpdate, onDelete }: { group: SynonymGroup, onUpdate: (g: SynonymGroup) => void, onDelete: () => void }) {
  const [localWords, setLocalWords] = useState<string[]>(group.words);
  const [localLang, setLocalLang] = useState(group.language);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalWords(group.words);
    setLocalLang(group.language);
  }, [group.id]);

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
    saveDebounced({ ...group, language: localLang, words: newWords });
  };
  
  const removeWord = (idx: number) => {
    const newWords = localWords.filter((_, i) => i !== idx);
    setLocalWords(newWords);
    onUpdate({ ...group, language: localLang, words: newWords });
  };

  const addWord = () => {
    const newWords = [...localWords, ''];
    setLocalWords(newWords);
    onUpdate({ ...group, language: localLang, words: newWords });
  };

  const handleLangChange = (val: string) => {
    setLocalLang(val);
    onUpdate({ ...group, language: val, words: localWords });
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
    </div>
  );
}
