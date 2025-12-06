import React, { useState, useRef, useEffect } from 'react';
import { UploadIcon, XIcon, LoaderIcon, ShieldIcon, AlertIcon } from './components/Icons';
import { analyzeImages } from './services/geminiService';
import { DisasterType, AnalysisItem, ImageUpload } from './types';
import { ResultsDisplay } from './components/ResultsDisplay';

const DISASTER_TYPES: DisasterType[] = ['General', 'Flood', 'Cyclone', 'Fire', 'Earthquake', 'Building Collapse'];

export default function App() {
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [disasterType, setDisasterType] = useState<DisasterType>('General');
  const [extraNotes, setExtraNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: ImageUpload[] = Array.from(e.target.files).map((file: File) => ({
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages]);
      setResults(null); // Reset results on new upload
      setError(null);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleAnalyze = async () => {
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const files = images.map((img) => img.file);
      const response = await analyzeImages(files, disasterType, extraNotes);
      setResults(response.results);
      
      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err: any) {
      setError(err.message || "An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg text-white">
              <ShieldIcon />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Disaster Lens</h1>
              <p className="text-xs text-slate-500 font-medium">AI Damage Analyzer</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Upload disaster images</h2>
          <p className="text-slate-600">Get real-time hazard detection, severity assessment, and life-saving safety guidance.</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          
          {/* File Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-red-400 transition-colors group"
          >
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
              <UploadIcon />
            </div>
            <p className="text-slate-900 font-medium">Click to upload photos</p>
            <p className="text-slate-500 text-sm mt-1">Supports multi-image upload</p>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                    className="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {/* Disaster Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Disaster Context (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {DISASTER_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setDisasterType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      disasterType === type 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra Notes */}
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">Extra Notes</label>
               <textarea
                 value={extraNotes}
                 onChange={(e) => setExtraNotes(e.target.value)}
                 placeholder="E.g., Located near a school, smell of gas..."
                 className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm min-h-[80px]"
               />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
             <AlertIcon />
             <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Results Section */}
        <div ref={resultsRef}>
          {results && <ResultsDisplay results={results} images={images} />}
        </div>
        
      </main>

      {/* Sticky Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || images.length === 0}
            className={`w-full py-3.5 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] ${
              isLoading || images.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-500/30'
            }`}
          >
            {isLoading ? (
              <>
                <LoaderIcon /> Analyzing...
              </>
            ) : (
              'Analyze Images'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}