import React from 'react';
import { useSemantic, SynonymGroup } from '@/context/SemanticContext';
import { Link } from 'wouter';
import { Plus, Trash2, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultSynonyms } from '@/context/SemanticContext';

export default function Editor() {
  const { synonymGroups, addGroup, updateGroup, deleteGroup, setSynonymGroups } = useSemantic();

  const handleReset = () => {
    if (confirm("Are you sure you want to reset to default expressions? All custom expressions will be lost.")) {
      setSynonymGroups(defaultSynonyms);
    }
  };

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
        
        <p className="text-zinc-400 mb-8 max-w-2xl">
          Define groups of interchangeable expressions. When any word in a group is found in the Tractatus text, it will become interactive and can be swapped with other words in the same group. This allows for a deeper structural reading of the text.
        </p>

        <div className="space-y-6">
          {synonymGroups.map(group => (
            <GroupEditor key={group.id} group={group} onUpdate={(g) => updateGroup(group.id, g)} onDelete={() => deleteGroup(group.id)} />
          ))}
          
          <Button 
            onClick={() => addGroup({ id: Date.now().toString(), language: 'en', words: [''] })}
            variant="outline" 
            className="w-full h-16 border-dashed border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 bg-transparent hover:bg-zinc-900/30"
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Expression Group
          </Button>
        </div>
      </div>
    </div>
  );
}

function GroupEditor({ group, onUpdate, onDelete }: { group: SynonymGroup, onUpdate: (g: SynonymGroup) => void, onDelete: () => void }) {
  const handleWordChange = (idx: number, val: string) => {
    const newWords = [...group.words];
    newWords[idx] = val;
    onUpdate({ ...group, words: newWords });
  };
  
  const removeWord = (idx: number) => {
    const newWords = group.words.filter((_, i) => i !== idx);
    onUpdate({ ...group, words: newWords });
  };

  const addWord = () => {
    onUpdate({ ...group, words: [...group.words, ''] });
  };

  return (
    <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30 shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <Select 
            value={group.language} 
            onValueChange={(val: 'en'|'fr') => onUpdate({ ...group, language: val })}
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
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete} className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {group.words.map((word, idx) => (
          <div key={idx} className="flex gap-3">
            <Input 
              value={word} 
              onChange={e => handleWordChange(idx, e.target.value)}
              placeholder="Enter an expression..."
              className="bg-zinc-950 border-zinc-800 focus-visible:ring-green-500/50 text-white"
            />
            <Button variant="ghost" size="icon" onClick={() => removeWord(idx)} disabled={group.words.length === 1} className="text-zinc-500 hover:text-white">
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