import React from 'react';
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight } from 'lucide-react';

export interface Job {
  id: string;
  title: string;
  department: string;
  salary: string;
  location: string;
  type: string; // Full-time, Part-time, Contract
  experience: string;
  skills: string[];
  description: string;
  hot?: boolean;
}

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  return (
    <div className="relative group bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-violet-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
      {/* Light glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div>
        {/* Header: Title and Hot badge */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider bg-violet-500/10 px-2.5 py-1 rounded-full">
              {job.department}
            </span>
            <h3 className="text-xl font-bold text-white mt-2 group-hover:text-violet-300 transition-colors">
              {job.title}
            </h3>
          </div>
          {job.hot && (
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase animate-pulse">
              Hot Role
            </span>
          )}
        </div>

        {/* Metadata info */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm text-slate-400 mb-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-slate-500" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-slate-500" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={15} className="text-slate-500" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={15} className="text-slate-500" />
            <span>{job.experience}</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-400 leading-relaxed mb-5 line-clamp-2">
          {job.description}
        </p>

        {/* Skills Tag List */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="text-xs text-slate-300 bg-slate-800/50 px-2.5 py-1 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={() => onApply(job)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/10 group-hover:shadow-indigo-600/20 transition-all duration-300 hover:scale-[1.02]"
      >
        <span>Apply Now</span>
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
