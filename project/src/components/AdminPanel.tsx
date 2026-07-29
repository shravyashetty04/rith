import React, { useState } from 'react';
import { 
  Users, DollarSign, Clock, Search, Filter, Eye, Trash2, 
  ChevronDown, FileText, Mail, Phone, MapPin, GraduationCap, 
  Download, PlusCircle, AlertTriangle, ShieldCheck, X
} from 'lucide-react';
import { Applicant } from './ApplicationModal';
import { Job } from './JobCard';

interface AdminPanelProps {
  applicants: Applicant[];
  jobs: Job[];
  onUpdateStatus: (id: string, newStatus: Applicant['status']) => void;
  onDeleteApplicant: (id: string) => void;
  onAddTestApplicant: () => void;
  onClearAll: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  applicants,
  jobs,
  onUpdateStatus,
  onDeleteApplicant,
  onAddTestApplicant,
  onClearAll,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [jobFilter, setJobFilter] = useState<string>('ALL');
  
  // Selected applicant for detailed modal view
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // Statistics calculation
  const totalApplicants = applicants.length;
  const totalRevenue = applicants.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const inReview = applicants.filter(a => a.status === 'Pending').length;
  const hiredCount = applicants.filter(a => a.status === 'Hired').length;

  // Filter and search logic
  const filteredApplicants = applicants.filter(a => {
    const matchesSearch = 
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesJob = jobFilter === 'ALL' || a.jobId === jobFilter;

    return matchesSearch && matchesStatus && matchesJob;
  });

  const getStatusColor = (status: Applicant['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Shortlisted': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Interviewing': return 'bg-violet-500/10 text-violet-400 border border-violet-500/20';
      case 'Hired': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Rejected': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const handleExportCSV = () => {
    if (applicants.length === 0) return;
    const headers = 'ID,Name,Email,Phone,Location,Job Title,Experience,Education,University,Grad Year,Skills,Payment Method,Amount,Txn ID,Status,Applied At\n';
    const rows = applicants.map(a => {
      return `"${a.id}","${a.fullName}","${a.email}","${a.phone}","${a.location}","${a.jobTitle}","${a.experience}","${a.education}","${a.university}","${a.gradYear}","${a.skills.join('; ')}","${a.paymentMethod}",${a.amountPaid},"${a.paymentId}","${a.status}","${a.appliedAt}"`;
    }).join('\n');
    
    const element = document.createElement("a");
    const file = new Blob([headers + rows], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `CareerGate-Applicants-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-left">
      
      {/* Admin Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/30 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <ShieldCheck className="text-violet-500" size={28} />
            Recruiter Admin Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">Review candidate submissions, manage application statuses, and track verification fees.</p>
        </div>

        {/* Demo helpers */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onAddTestApplicant}
            className="flex items-center gap-1.5 py-2 px-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all"
          >
            <PlusCircle size={14} />
            Add Mock Applicant
          </button>
          
          <button
            onClick={handleExportCSV}
            disabled={applicants.length === 0}
            className="flex items-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all border border-white/5"
          >
            <Download size={14} />
            Export CSV
          </button>

          <button
            onClick={() => {
              if(confirm("Are you sure you want to delete all applications? This cannot be undone.")) {
                onClearAll();
              }
            }}
            disabled={applicants.length === 0}
            className="flex items-center gap-1.5 py-2 px-3 bg-rose-950/40 hover:bg-rose-950/80 text-rose-400 disabled:opacity-50 rounded-lg text-xs font-bold transition-all border border-rose-500/10"
          >
            <AlertTriangle size={14} />
            Reset Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Submissions', val: totalApplicants, icon: Users, desc: 'Verified applications', color: 'text-violet-500' },
          { label: 'Total Verification Fees', val: `₹${totalRevenue}`, icon: DollarSign, desc: 'Collected at ₹100/app', color: 'text-emerald-500' },
          { label: 'Pending Evaluation', val: inReview, icon: Clock, desc: 'Awaiting first screening', color: 'text-amber-500' },
          { label: 'Hired Candidates', val: hiredCount, icon: ShieldCheck, desc: 'Offers accepted', color: 'text-blue-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl flex items-center justify-between backdrop-blur-sm">
            <div>
              <span className="text-xs text-slate-400 font-semibold">{stat.label}</span>
              <span className="text-2xl font-black text-white mt-1.5 block">{stat.val}</span>
              <span className="text-[10px] text-slate-500 mt-1 block">{stat.desc}</span>
            </div>
            <div className={`p-3 bg-slate-800/40 rounded-xl ${stat.color}`}>
              <stat.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters Area */}
      <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search size={18} className="absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, registration ID or skills..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full md:w-auto">
            <Filter size={14} className="text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-300 text-xs font-semibold focus:outline-none cursor-pointer pr-4"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Job Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full md:w-auto">
            <Filter size={14} className="text-slate-500" />
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="bg-transparent text-slate-300 text-xs font-semibold focus:outline-none cursor-pointer pr-4"
            >
              <option value="ALL">All Jobs</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table view */}
      <div className="bg-slate-900/30 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
        {filteredApplicants.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <Users size={40} className="mx-auto text-slate-600 mb-2" />
            <p className="font-bold text-white text-sm">No applications found</p>
            <p className="text-xs">Try adjusting your filters or add a test applicant above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-left">
                  <th className="py-4 px-6">ID & Candidate</th>
                  <th className="py-4 px-6">Position</th>
                  <th className="py-4 px-6">Exp & Education</th>
                  <th className="py-4 px-6">Verification Fee</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-slate-800/10 transition-colors">
                    {/* ID & Candidate */}
                    <td className="py-4.5 px-6">
                      <div className="font-semibold text-white">{applicant.fullName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{applicant.email}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1 bg-slate-800/40 inline-block px-1.5 py-0.5 rounded border border-white/5">
                        {applicant.id}
                      </div>
                    </td>

                    {/* Position */}
                    <td className="py-4.5 px-6">
                      <div className="font-semibold text-slate-200">{applicant.jobTitle}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{applicant.jobDepartment}</div>
                      <div className="text-[10px] font-semibold text-violet-400 mt-1">
                        {applicant.workMode}
                      </div>
                    </td>

                    {/* Experience & Education */}
                    <td className="py-4.5 px-6">
                      <div className="font-semibold text-slate-200">{applicant.experience} Years Exp</div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[150px]">{applicant.education}</div>
                      <div className="text-[10px] text-slate-500 italic mt-0.5 truncate max-w-[150px]">
                        {applicant.university}
                      </div>
                    </td>

                    {/* Verification Fee info */}
                    <td className="py-4.5 px-6">
                      <div className="font-black text-emerald-400">
                        ₹{applicant.amountPaid}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Method: {applicant.paymentMethod}</div>
                      <div className="text-[9px] font-mono text-slate-600 mt-1 truncate max-w-[100px]" title={applicant.paymentId}>
                        Ref: {applicant.paymentId}
                      </div>
                    </td>

                    {/* Interactive Status Selector */}
                    <td className="py-4.5 px-6">
                      <div className="relative inline-block">
                        <select
                          value={applicant.status}
                          onChange={(e) => onUpdateStatus(applicant.id, e.target.value as any)}
                          className={`text-xs font-bold py-1.5 px-3 rounded-full cursor-pointer focus:outline-none appearance-none pr-7 ${getStatusColor(applicant.status)}`}
                        >
                          <option value="Pending">Pending Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedApplicant(applicant)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-white/5"
                          title="View Application Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete application for ${applicant.fullName}?`)) {
                              onDeleteApplicant(applicant.id);
                            }
                          }}
                          className="p-2 bg-rose-950/20 hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 rounded-lg transition-colors border border-rose-500/10"
                          title="Delete Applicant"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Profile Details Drawer/Modal popup */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 text-slate-100 flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(selectedApplicant.status)}`}>
                  {selectedApplicant.status}
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5">{selectedApplicant.fullName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Application ID: {selectedApplicant.id}</p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Details Grid */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              
              {/* Contact Grid info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-white/5">
                  <Mail size={16} className="text-violet-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Email Address</span>
                    <a href={`mailto:${selectedApplicant.email}`} className="text-sm font-semibold text-slate-200 hover:underline">{selectedApplicant.email}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-white/5">
                  <Phone size={16} className="text-violet-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Phone Number</span>
                    <a href={`tel:${selectedApplicant.phone}`} className="text-sm font-semibold text-slate-200 hover:underline">{selectedApplicant.phone}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-white/5">
                  <MapPin size={16} className="text-violet-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Current Location</span>
                    <span className="text-sm font-semibold text-slate-200">{selectedApplicant.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-white/5">
                  <GraduationCap size={16} className="text-violet-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Education Details</span>
                    <span className="text-sm font-semibold text-slate-200 truncate max-w-[180px]" title={`${selectedApplicant.education} (${selectedApplicant.university})`}>
                      {selectedApplicant.education}
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional Profile details */}
              <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-3">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Applied Position</span>
                    <span className="text-sm font-bold text-white">{selectedApplicant.jobTitle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Experience (Years)</span>
                    <span className="text-sm font-bold text-white">{selectedApplicant.experience} Years</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold mb-1.5">University / College</span>
                  <p className="text-sm text-slate-300 font-semibold">{selectedApplicant.university} <span className="text-slate-500 font-normal">({selectedApplicant.gradYear} Grad)</span></p>
                </div>
                
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold mb-1.5">Core Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApplicant.skills.map((skill, i) => (
                      <span key={i} className="text-xs text-white bg-slate-800/80 px-2 py-0.5 rounded border border-white/5">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cover Letter</h4>
                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-sm text-slate-300 leading-relaxed max-h-[120px] overflow-y-auto">
                  {selectedApplicant.coverLetter}
                </div>
              </div>

              {/* Custom Questionnaire */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Why they are a good fit</h4>
                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 text-sm text-slate-300 leading-relaxed max-h-[120px] overflow-y-auto">
                  {selectedApplicant.whyJoin}
                </div>
              </div>

              {/* Resume & Verification Receipt */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-slate-950 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText size={20} className="text-violet-400" />
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase font-bold">CV / Resume Document</span>
                      <span className="text-xs font-bold text-white truncate max-w-[150px] block">{selectedApplicant.resumeName}</span>
                    </div>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Demo Mode: Opening CV simulation for ${selectedApplicant.fullName}`);
                    }}
                    className="text-xs text-violet-400 hover:text-white font-bold underline"
                  >
                    View PDF
                  </a>
                </div>

                <div className="flex-1 bg-slate-950 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Verification Fee (Paid)</span>
                    <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                      ₹{selectedApplicant.amountPaid}.00 via {selectedApplicant.paymentMethod}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 bg-slate-900 border border-white/5 px-2 py-1 rounded">
                    Txn Verified
                  </span>
                </div>
              </div>

            </div>

            {/* Footer action */}
            <div className="border-t border-slate-800 pt-4 mt-5 flex justify-end">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="py-2.5 px-6 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white text-sm transition-all"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
