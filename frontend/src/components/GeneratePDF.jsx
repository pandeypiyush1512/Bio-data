import React, { useState } from 'react';
import { useForm } from '../context/FormContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FileText, Download, Eye, ArrowLeft, Loader2, CheckCircle, RefreshCw, ExternalLink } from 'lucide-react';

const BACKEND = 'http://localhost:5000';

export default function GeneratePDF({ onBack }) {
  const { formData } = useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { viewUrl, downloadUrl, filename }

  const p = formData.personal;

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post(`${BACKEND}/api/generate-pdf`, formData, {
        timeout: 90000,
      });
      setResult(response.data);
      toast.success('PDF generated successfully!');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.details || err.message || 'Unknown error';
      toast.error(`PDF generation failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { label: 'Personal Info', done: !!p?.fullName, icon: '👤' },
    { label: 'Education', done: formData.education?.length > 0, icon: '🎓' },
    { label: 'Experience', done: formData.experience?.length > 0, icon: '💼' },
    { label: 'Skills', done: Object.values(formData.skills || {}).flat().length > 0, icon: '⚡' },
    { label: 'Certifications', done: formData.certifications?.length > 0, icon: '📜' },
    { label: 'Projects', done: formData.projects?.length > 0, icon: '🚀' },
    { label: 'Achievements', done: formData.achievements?.length > 0, icon: '🏆' },
    { label: 'Hobbies', done: formData.hobbies?.length > 0, icon: '🎯' },
    { label: 'References', done: formData.references?.length > 0, icon: '🤝' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4 px-6 h-16">
          <button onClick={onBack} className="btn-secondary text-sm">
            <ArrowLeft size={16} /> Back to Form
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <h1 className="font-bold text-gray-900">Generate PDF</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">

        {/* Summary */}
        <div className="section-card">
          <h2 className="text-base font-bold text-gray-800 mb-3">Form Summary</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {sections.map(s => (
              <div key={s.label} className={`flex items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                s.done ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-gray-50 border-gray-100 text-gray-400'
              }`}>
                <span>{s.icon}</span>
                <span className="flex-1 leading-tight">{s.label}</span>
                {s.done && <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
          {!p?.fullName && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
              ⚠️ Fill in your <strong>Full Name</strong> in Personal Details before generating.
            </div>
          )}
        </div>

        {/* Generate / Actions */}
        <div className="section-card">
          {!result ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📄</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Ready to Generate?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Creates a professionally formatted, ATS-friendly PDF with all your details.
              </p>
              <button
                onClick={handleGenerate}
                disabled={loading || !p?.fullName}
                className="btn-primary text-base px-8 py-3 mx-auto"
              >
                {loading ? (
                  <><Loader2 size={20} className="animate-spin" /> Generating PDF...</>
                ) : (
                  <><FileText size={20} /> Generate PDF</>
                )}
              </button>
              {loading && (
                <p className="text-xs text-gray-400 mt-3 animate-pulse">
                  This may take 15–30 seconds...
                </p>
              )}
            </div>
          ) : (
            <div>
              {/* Success banner */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <span className="text-3xl">✅</span>
                <div className="flex-1">
                  <p className="font-bold text-emerald-800">PDF Ready!</p>
                  <p className="text-xs text-emerald-600">{result.filename}</p>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs text-emerald-700 border border-emerald-200 bg-white px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  <RefreshCw size={13} /> Regenerate
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {/* View — opens the static PDF file in a new tab, works on Windows */}
                <a
                  href={result.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-6 py-3 no-underline"
                >
                  <Eye size={18} /> View PDF
                </a>

                {/* Download */}
                <a
                  href={result.downloadUrl}
                  download={result.filename}
                  className="btn-success px-6 py-3 no-underline"
                >
                  <Download size={18} /> Download PDF
                </a>
              </div>

              {/* Embedded preview using <object> — more compatible than iframe */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-600">📄 Preview</p>
                  <a
                    href={result.viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary-600 hover:underline"
                  >
                    <ExternalLink size={12} /> Open in browser
                  </a>
                </div>
                <object
                  data={result.viewUrl}
                  type="application/pdf"
                  style={{ width: '100%', height: '75vh' }}
                >
                  {/* Fallback if object tag also fails */}
                  <div className="p-8 text-center bg-gray-50">
                    <p className="text-gray-600 mb-2 font-medium">PDF preview not available in this browser</p>
                    <p className="text-gray-400 text-sm mb-4">Use the buttons above to view or download your PDF.</p>
                    <a
                      href={result.viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary px-6 py-3 mx-auto no-underline"
                    >
                      <ExternalLink size={16} /> Open PDF in Browser
                    </a>
                  </div>
                </object>
              </div>
            </div>
          )}
        </div>

        {/* Included sections */}
        {result && (
          <div className="section-card">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">What's in your PDF:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sections.filter(s => s.done).map(s => (
                <div key={s.label} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-emerald-500">✓</span> {s.icon} {s.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
