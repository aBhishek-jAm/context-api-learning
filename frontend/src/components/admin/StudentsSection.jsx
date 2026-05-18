import React, { useState, useMemo } from 'react';
import {
  Users, Search, RefreshCw, Trash2, Mail, Calendar, GraduationCap,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Download, CheckSquare, Square, UserCircle, ArrowUpDown
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const levelConfig = {
  beginner: { emoji: '🌱', classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  intermediate: { emoji: '📚', classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  advanced: { emoji: '🚀', classes: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
};

const StudentsSection = ({ students, loading, onRefresh, onDelete, onUpdateLevel, onBulkDelete, token }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Filter
  const filtered = useMemo(() => {
    let list = students.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Sort
    list.sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (sortField === 'createdAt') { va = new Date(va); vb = new Date(vb); }
      else { va = (va || '').toString().toLowerCase(); vb = (vb || '').toString().toLowerCase(); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [students, searchTerm, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === paged.length) setSelected(new Set());
    else setSelected(new Set(paged.map(s => s._id)));
  };

  const handleDelete = async (id, name) => {
    await onDelete(id, name);
    setDeleteConfirm(null);
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    showSuccess(`${name} has been removed`);
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selected);
    await onBulkDelete(ids);
    setSelected(new Set());
    setBulkDeleteConfirm(false);
    showSuccess(`${ids.length} student(s) deleted`);
  };

  const handleLevelChange = async (id, level) => {
    await onUpdateLevel(id, level);
    setEditingLevel(null);
    showSuccess('Level updated');
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Learning Level', 'Joined'];
    const rows = filtered.map(s => [s.name, s.email, s.learningLevel, new Date(s.createdAt).toLocaleDateString()]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'students.csv'; a.click();
    URL.revokeObjectURL(url);
    showSuccess('CSV exported');
  };

  const formatDate = (dateStr) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-600" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-amber-400" /> : <ChevronDown className="w-3 h-3 text-amber-400" />;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> Student Management
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">{filtered.length} student{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                placeholder="Search students..."
                className="bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-56"
              />
            </div>
            <button onClick={onRefresh} className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors" title="Refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 text-sm transition-colors" title="Export CSV">
              <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
            </button>
            {selected.size > 0 && (
              <button onClick={() => setBulkDeleteConfirm(true)} className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 text-sm font-medium transition-colors">
                <Trash2 className="w-4 h-4" /> Delete ({selected.size})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success / Bulk Delete Confirm */}
      {successMsg && (
        <div className="mx-5 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" /> {successMsg}
        </div>
      )}
      {bulkDeleteConfirm && (
        <div className="mx-5 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
          <span className="text-sm text-red-400">Delete {selected.size} student(s)? This cannot be undone.</span>
          <div className="flex gap-2">
            <button onClick={handleBulkDelete} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-colors">Confirm</button>
            <button onClick={() => setBulkDeleteConfirm(false)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded-lg transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Loading students...</p>
        </div>
      ) : paged.length === 0 ? (
        <div className="p-12 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No students found</p>
          <p className="text-xs text-slate-500 mt-1">{searchTerm ? 'Try a different search term' : 'No students have registered yet'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-5 py-3 text-left">
                  <button onClick={toggleSelectAll} className="text-slate-500 hover:text-slate-300">
                    {selected.size === paged.length && paged.length > 0 ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left"><button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-300">Student <SortIcon field="name" /></button></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left"><button onClick={() => toggleSort('learningLevel')} className="flex items-center gap-1 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-300">Level <SortIcon field="learningLevel" /></button></th>
                <th className="px-4 py-3 text-left"><button onClick={() => toggleSort('createdAt')} className="flex items-center gap-1 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-300">Joined <SortIcon field="createdAt" /></button></th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((student) => {
                const lcfg = levelConfig[student.learningLevel] || levelConfig.intermediate;
                const initials = student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                const isSelected = selected.has(student._id);

                return (
                  <tr key={student._id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${isSelected ? 'bg-amber-500/5' : ''}`}>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleSelect(student._id)} className="text-slate-500 hover:text-slate-300">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-blue-400">{initials}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-200">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{student.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      {editingLevel === student._id ? (
                        <select
                          defaultValue={student.learningLevel}
                          onChange={(e) => handleLevelChange(student._id, e.target.value)}
                          onBlur={() => setEditingLevel(null)}
                          autoFocus
                          className="bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        >
                          <option value="beginner">🌱 Beginner</option>
                          <option value="intermediate">📚 Intermediate</option>
                          <option value="advanced">🚀 Advanced</option>
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingLevel(student._id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer hover:opacity-80 transition-opacity ${lcfg.classes}`}
                          title="Click to change level"
                        >
                          {lcfg.emoji} {student.learningLevel}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDate(student.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {deleteConfirm === student._id ? (
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-xs text-red-400">Delete?</span>
                          <button onClick={() => handleDelete(student._id, student.name)} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-colors">Yes</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded-lg transition-colors">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(student._id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete student">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">Page {safePage} of {totalPages} · {filtered.length} total</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (safePage <= 3) pageNum = i + 1;
              else if (safePage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = safePage - 2 + i;
              return (
                <button key={pageNum} onClick={() => setPage(pageNum)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${safePage === pageNum ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsSection;
