'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MAX_RESUME_FILE_SIZE, ALLOWED_MIME_TYPES } from '@/lib/validation';
import { useToast } from '@/components/layout/Toast';

interface ResumeUploaderProps {
  onFileUploaded: (fileInfo: { fileName: string; fileSize: number }, suggestedSkills?: string[]) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onFileUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const validateAndProcessFile = async (file: File) => {
    setErrorMessage(null);
    setUploadSuccess(false);

    // Validação RG08
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      const err = 'Formato inválido: Somente arquivos PDF (.pdf) são permitidos.';
      setErrorMessage(err);
      showToast(err, 'error');
      return;
    }

    if (file.size > MAX_RESUME_FILE_SIZE) {
      const err = `Arquivo muito grande: ${(file.size / (1024 * 1024)).toFixed(1)}MB (limite de 5MB).`;
      setErrorMessage(err);
      showToast(err, 'error');
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha na validação do currículo.');
      }

      setUploadSuccess(true);
      showToast('Currículo PDF validado com sucesso!', 'success');

      const extracted = data.aiSuggestions?.extractedSkills || [];
      setAiSuggestions(extracted);
      onFileUploaded(
        { fileName: file.name, fileSize: file.size },
        extracted
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao processar arquivo.');
      showToast(err.message || 'Erro no upload', 'error');
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setUploadSuccess(false);
    setAiSuggestions([]);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
          Upload de Currículo (PDF Seguro — RG08)
        </label>
        <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">Máx 5MB • Somente .PDF</span>
      </div>

      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
              : 'border-slate-300 dark:border-zinc-800 hover:border-blue-500/50 bg-slate-50 dark:bg-zinc-900/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                validateAndProcessFile(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-white dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 shadow-sm text-blue-600 dark:text-blue-400">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-zinc-200">
                Arraste o arquivo PDF aqui ou <span className="text-blue-600 dark:text-blue-400 underline">clique para selecionar</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Validação estrita de extensão, tamanho e tipo MIME (Sem execução de código)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-100 dark:bg-red-950/60 text-rose-600 dark:text-red-400 rounded-lg border border-rose-200 dark:border-red-900/50">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-zinc-200 truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB •{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verificado e Seguro
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg"
              title="Remover arquivo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isUploading && (
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
              <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full" />
              Processando e validando conformidade do documento...
            </div>
          )}

          {uploadSuccess && aiSuggestions.length > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800/50 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-blue-800 dark:text-blue-100">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Competências detectadas no currículo (IA Auxiliar — Requisito 25):
              </div>
              <div className="flex flex-wrap gap-1">
                {aiSuggestions.map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white dark:bg-zinc-950 text-blue-700 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-800/60 text-[11px] font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800/60">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
