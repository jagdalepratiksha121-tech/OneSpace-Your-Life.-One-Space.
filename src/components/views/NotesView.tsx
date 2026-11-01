import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Pin,
  Star,
  Trash2,
  Folder,
  Tag,
  Search,
  Calendar,
  Check
} from 'lucide-react';
import { Note } from '../../types';

export const NotesView: React.FC = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    toggleNotePin,
    toggleNoteFavorite,
    pinItemToHome,
    unpinItemFromHome,
    isItemPinnedToHome
  } = useApp();

  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');

  const selectedNote = notes.find(n => n.id === selectedNoteId) || notes[0];

  const folders = Array.from(new Set(notes.map(n => n.folder).filter(Boolean)));

  const filteredNotes = notes.filter(n => {
    if (selectedFolder !== 'all' && n.folder !== selectedFolder) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateNewNote = () => {
    const newNoteId = `note-${Date.now()}`;
    addNote({
      title: 'Untitled Note',
      content: '',
      folder: selectedFolder !== 'all' ? selectedFolder : 'General',
      tags: ['Personal'],
      pinned: false,
      favorite: false
    });
    setSelectedNoteId(newNoteId);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Notes & Personal Knowledge
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Capture study concepts, meeting summaries, ideas, and important instructions.
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* 2-Pane Editor Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch min-h-[560px]">
        {/* Left Pane: Notes List (4 cols) */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col">
          {/* Search bar inside notes */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden"
            />
          </div>

          {/* Folder tabs */}
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto text-[11px]">
            <button
              onClick={() => setSelectedFolder('all')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedFolder === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All ({notes.length})
            </button>
            {folders.map(folder => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedFolder === folder
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {folder}
              </button>
            ))}
          </div>

          {/* Notes items */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[460px]">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">Your notes will appear here.</p>
                <p className="text-[11px] text-slate-400 mt-0.5 mb-3">Capture ideas, lecture points, or outlines.</p>
                <button
                  onClick={handleCreateNewNote}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Note</span>
                </button>
              </div>
            ) : (
              filteredNotes.map(note => {
                const isSelected = selectedNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate flex-1">
                        {note.title || 'Untitled'}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0">
                        {note.pinned && <Pin className="w-3 h-3 text-amber-500 fill-amber-500" />}
                        {note.favorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {note.content || 'No additional text...'}
                    </p>

                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span className="font-mono">{note.folder}</span>
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Live Editor (7 cols) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          {selectedNote ? (
            <div className="flex-1 flex flex-col">
              {/* Note meta toolbar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    📁 {selectedNote.folder}
                  </span>
                  {selectedNote.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() =>
                      isItemPinnedToHome(selectedNote.id)
                        ? unpinItemFromHome(selectedNote.id)
                        : pinItemToHome(selectedNote.id, 'note', `Note: ${selectedNote.title || 'Untitled'}`)
                    }
                    className={`px-2 py-1 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                      isItemPinnedToHome(selectedNote.id)
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                    }`}
                    title={isItemPinnedToHome(selectedNote.id) ? 'Remove from Home Page' : 'Add to Home Page'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${isItemPinnedToHome(selectedNote.id) ? 'fill-blue-600 text-blue-600' : 'text-slate-400'}`} />
                    <span className="hidden sm:inline">
                      {isItemPinnedToHome(selectedNote.id) ? 'Pinned to Home' : 'Add to Home'}
                    </span>
                  </button>

                  <button
                    onClick={() => toggleNotePin(selectedNote.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      selectedNote.pinned
                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                    }`}
                    title="Pin within Notes folder"
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleNoteFavorite(selectedNote.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      selectedNote.favorite
                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                    }`}
                    title="Favorite Note"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title input */}
              <input
                type="text"
                value={selectedNote.title}
                onChange={e => updateNote(selectedNote.id, { title: e.target.value })}
                placeholder="Note title..."
                className="w-full text-xl font-bold text-slate-900 dark:text-white bg-transparent focus:outline-hidden pb-2"
              />

              {/* Content textarea */}
              <textarea
                value={selectedNote.content}
                onChange={e => updateNote(selectedNote.id, { content: e.target.value })}
                placeholder="Write your note, thoughts, or outline here... (Auto-saves continuously)"
                className="w-full flex-1 min-h-[340px] text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-transparent focus:outline-hidden resize-none leading-relaxed mt-2"
              />

              {/* Footer status */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Auto-saved to local memory</span>
                <span className="font-mono">
                  Updated: {new Date(selectedNote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No note selected
              </p>
              <p className="text-xs text-slate-400 mt-1 mb-4 max-w-xs">
                Your notes will appear here. Create your first note to start writing.
              </p>
              <button
                onClick={handleCreateNewNote}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Note</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
