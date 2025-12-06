import React from 'react';
import { AnalysisItem } from '../types';
import { AlertIcon, CheckIcon } from './Icons';

interface ResultsDisplayProps {
  results: AnalysisItem[];
  images: { id: string; previewUrl: string }[];
}

const SeverityBadge = ({ level }: { level: string }) => {
  let colorClass = "bg-gray-100 text-gray-800";
  if (level === "Critical") colorClass = "bg-red-100 text-red-800 border-red-200";
  else if (level === "High") colorClass = "bg-orange-100 text-orange-800 border-orange-200";
  else if (level === "Medium") colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
  else if (level === "Low") colorClass = "bg-green-100 text-green-800 border-green-200";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${colorClass}`}>
      {level}
    </span>
  );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, images }) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {results.map((result, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
              {images[index] && (
                <img 
                  src={images[index].previewUrl} 
                  alt="Analyzed scene" 
                  className="w-16 h-16 object-cover rounded-md border border-slate-300"
                />
              )}
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Scene Analysis #{index + 1}</h3>
                <p className="text-slate-500 text-sm">AI Assessment</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
               <div className="flex flex-col items-end">
                   <span className="text-xs text-slate-500 font-semibold mb-1">DAMAGE SEVERITY</span>
                   <SeverityBadge level={result.severity} />
               </div>
               <div className="flex flex-col items-end">
                   <span className="text-xs text-slate-500 font-semibold mb-1">RESCUE PRIORITY</span>
                   <SeverityBadge level={result.rescue_priority} />
               </div>
            </div>
          </div>

          <div className="p-6 grid gap-6 md:grid-cols-2">
            {/* Summary & Hazards */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Summary</h4>
                <p className="text-slate-700 leading-relaxed">{result.scene_summary}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertIcon /> Detected Hazards
                </h4>
                <ul className="space-y-2">
                  {result.hazards.map((hazard, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 text-sm bg-red-50 p-2 rounded-md border border-red-100">
                      <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                      {hazard}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Safety & Resources */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <CheckIcon /> Safety Instructions
                </h4>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <ol className="list-decimal list-inside space-y-2 text-slate-700 text-sm">
                    {result.safety_steps.map((step, i) => (
                      <li key={i} className="pl-1"><span className="font-medium text-slate-900">{step}</span></li>
                    ))}
                  </ol>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-2">Recommended Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {result.recommended_resources.map((resource, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded border border-blue-100">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
