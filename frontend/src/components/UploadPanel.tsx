import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, ShieldAlert } from 'lucide-react';
import { useAnalysisStore } from '../store/analysisStore';
import { useAnalysis } from '../hooks/useAnalysis';

export function UploadPanel() {
    const [files, setFiles] = useState<File[]>([]);
    const { framework, setFramework } = useAnalysisStore();
    const { startAnalysis, isUploading, error } = useAnalysis();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.length) {
            setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const removeFile = (idx: number) => {
        setFiles(files.filter((_, i) => i !== idx));
    };

    const onStart = () => {
        if (files.length > 0) {
            startAnalysis(files);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 p-6 w-[400px] flex-shrink-0">
            <div className="flex items-center gap-3 mb-8">
                <ShieldAlert className="w-8 h-8 text-blue-500" />
                <h2 className="text-xl font-bold tracking-tight">CyberSec Analyzer</h2>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">Mapping Framework</label>
                <select
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                >
                    <option value="NIST CSF 2.0">NIST CSF 2.0</option>
                    <option value="ISO 27001">ISO 27001</option>
                    <option value="SOC 2">SOC 2</option>
                </select>
            </div>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-lg p-8 text-center cursor-pointer hover:bg-slate-800/50 transition-colors mb-6"
            >
                <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => {
                        if (e.target.files?.length) {
                            setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                        }
                    }}
                />
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-300 font-medium">Click or drag evidence here</p>
                <p className="text-xs text-slate-500 mt-1">PDF, CSV, JSON, XLSX, PNG up to 50MB</p>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 mb-6 space-y-2">
                {files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-950 border border-slate-800 p-3 rounded-md group">
                        <File className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-sm truncate flex-1" title={file.name}>{file.name}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                            className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {files.length === 0 && (
                    <p className="text-sm text-slate-500 italic text-center mt-4">No files uploaded yet.</p>
                )}
            </div>

            {error && (
                <div className="bg-red-950/50 border border-red-900 text-red-200 text-sm p-3 rounded-md mb-4">
                    {error}
                </div>
            )}

            <button
                onClick={onStart}
                disabled={files.length === 0 || isUploading}
                className={`w-full py-3 rounded-md font-medium text-sm transition-colors ${files.length === 0 || isUploading
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20'
                    }`}
            >
                {isUploading ? 'Initializing...' : 'Start Analysis'}
            </button>
        </div>
    );
}
