import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderArchive,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Pin,
  Star,
  Trash2,
  Download,
  Eye,
  Search,
  Grid,
  List,
  Plus,
  X
} from 'lucide-react';
import { VaultDocument } from '../../types';

export const SmartVaultView: React.FC = () => {
  const {
    vaultDocuments,
    addVaultDocument,
    deleteVaultDocument,
    toggleDocumentPin,
    toggleDocumentFavorite,
    openQuickAdd,
    pinItemToHome,
    unpinItemFromHome,
    isItemPinnedToHome
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);

  const filteredDocs = vaultDocuments.filter(d => {
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let type: VaultDocument['fileType'] = 'other';
    if (file.name.endsWith('.pdf')) type = 'pdf';
    else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) type = 'docx';
    else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) type = 'xlsx';
    else if (file.type.startsWith('image/')) type = 'image';

    addVaultDocument({
      title: file.name,
      originalFileName: file.name,
      fileType: type,
      sizeBytes: file.size || 1500000,
      category: 'Work',
      tags: ['Uploaded', 'Vault'],
      pinned: false,
      favorite: false,
      fileContentPreview: `Stored file metadata: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
    });
  };

  const handleDownload = (doc: VaultDocument) => {
    const blob = new Blob([doc.fileContentPreview || doc.title], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.originalFileName || doc.title;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Smart Document Vault</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Secure, encrypted personal document and certificate storage inspired by Google Drive.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* File Upload Trigger */}
          <label className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer">
            <UploadCloud className="w-4 h-4" />
            <span>Upload File</span>
            <input
              type="file"
              className="hidden"
              onChange={handleSimulatedUpload}
            />
          </label>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents by name or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-hidden"
          />
        </div>

        {/* Categories & View mode */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="Work">Work</option>
            <option value="Academic">Academic</option>
            <option value="Identity">Identity</option>
            <option value="Finance">Finance</option>
            <option value="Receipts">Receipts</option>
          </select>

          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-400'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-400'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Display or Empty State */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <FolderArchive className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Your vault is empty. Upload your first document.
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Store PDFs, invoices, certificates, spreadsheets, and files securely in your personal vault.
          </p>
          <label className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors">
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
            <input type="file" className="hidden" onChange={handleSimulatedUpload} />
          </label>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDocs.map(doc => {
            const isPdf = doc.fileType === 'pdf';
            const isDocx = doc.fileType === 'docx';
            const isXlsx = doc.fileType === 'xlsx';

            return (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`p-3 rounded-2xl shrink-0 ${
                        isPdf
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                          : isXlsx
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                          : isDocx
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                          : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600'
                      }`}
                    >
                      {isXlsx ? (
                        <FileSpreadsheet className="w-6 h-6" />
                      ) : (
                        <FileText className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleDocumentPin(doc.id)}
                        className={`p-1 rounded-md transition-colors ${
                          doc.pinned ? 'text-amber-500 fill-amber-500' : 'text-slate-300 hover:text-slate-600'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleDocumentFavorite(doc.id)}
                        className={`p-1 rounded-md transition-colors ${
                          doc.favorite ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-slate-600'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={doc.title}>
                    {doc.title}
                  </h4>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{doc.category}</span>
                    <span className="font-mono">{(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                </div>

                {/* Card actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() =>
                        isItemPinnedToHome(doc.id)
                          ? unpinItemFromHome(doc.id)
                          : pinItemToHome(doc.id, 'document', `Doc: ${doc.title}`)
                      }
                      className={`text-xs px-2 py-0.5 rounded border transition-colors flex items-center gap-1 cursor-pointer ${
                        isItemPinnedToHome(doc.id)
                          ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                      }`}
                      title={isItemPinnedToHome(doc.id) ? 'Remove from Home Page' : 'Add to Home Page'}
                    >
                      <Pin className={`w-3 h-3 ${isItemPinnedToHome(doc.id) ? 'fill-blue-600 text-blue-600' : 'text-slate-400'}`} />
                      <span className="text-[10px]">{isItemPinnedToHome(doc.id) ? 'Pinned' : 'Pin to Home'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteVaultDocument(doc.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
                <th className="text-left font-semibold pb-3">File Name</th>
                <th className="text-left font-semibold pb-3">Category</th>
                <th className="text-left font-semibold pb-3">Size</th>
                <th className="text-left font-semibold pb-3">Uploaded</th>
                <th className="text-right font-semibold pb-3 pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="truncate max-w-xs">{doc.title}</span>
                  </td>
                  <td className="py-3 text-slate-500">{doc.category}</td>
                  <td className="py-3 font-mono text-slate-400">
                    {(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB
                  </td>
                  <td className="py-3 text-slate-400 font-mono">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-right pr-2 space-x-2">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="text-blue-600 hover:underline"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => deleteVaultDocument(doc.id)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-md">
                  {previewDoc.title}
                </span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 font-mono text-slate-600 dark:text-slate-300 leading-relaxed min-h-[140px]">
                {previewDoc.fileContentPreview || 'No text preview available for this binary format.'}
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-500">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Category</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{previewDoc.category}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">File Type</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 uppercase">{previewDoc.fileType}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(previewDoc)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
