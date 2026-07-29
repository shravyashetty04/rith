import React, { useState, useEffect, useRef } from 'react';
import { 
  X, User, Mail, Phone, MapPin, GraduationCap, Briefcase, 
  UploadCloud, FileText, CheckCircle, CreditCard, ArrowRight, 
  ArrowLeft, Download, AlertCircle, RefreshCw, Check
} from 'lucide-react';
import { Job } from './JobCard';

export interface Applicant {
  id: string;
  jobId: string;
  jobTitle: string;
  jobDepartment: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: number;
  education: string;
  university: string;
  gradYear: string;
  skills: string[];
  resumeName: string;
  resumeUrl: string;
  coverLetter: string;
  whyJoin: string;
  workMode: string;
  paymentId: string;
  paymentMethod: string;
  amountPaid: number;
  currency: string;
  status: 'Pending' | 'Shortlisted' | 'Interviewing' | 'Hired' | 'Rejected';
  appliedAt: string;
}

interface ApplicationModalProps {
  job: Job;
  onClose: () => void;
  onSubmitSuccess: (applicant: Applicant) => void;
}

type FormStep = 'contact' | 'education' | 'documents' | 'payment' | 'receipt';

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ job, onClose, onSubmitSuccess }) => {
  const [step, setStep] = useState<FormStep>('contact');
  
  // Currency setting - Locked to INR (Rupees)
  const currency = 'INR';
  const amount = 100;

  // Step 1: Contact Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  // Step 2: Education & Professional Details
  const [experience, setExperience] = useState<number>(0);
  const [education, setEducation] = useState('Bachelor\'s Degree');
  const [university, setUniversity] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>(job.skills.slice(0, 2));

  // Step 3: Documents & Cover Letter
  const [resumeName, setResumeName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [whyJoin, setWhyJoin] = useState('');
  const [workMode, setWorkMode] = useState('Remote');

  // Step 4: Payment Simulation
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [upiTimer, setUpiTimer] = useState(300); // 5 minutes in seconds
  
  // Card Inputs
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Netbanking Input
  const [selectedBank, setSelectedBank] = useState('');

  // Step 5: Submission / Receipt Data
  const [submittedData, setSubmittedData] = useState<Applicant | null>(null);

  // Error States
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Countdown timer for UPI QR Code
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'payment' && paymentMethod === 'upi' && upiTimer > 0) {
      interval = setInterval(() => {
        setUpiTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, paymentMethod, upiTimer]);

  const formatUpiTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // Format credit card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = value.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(value);
    }
  };

  // Format card expiry (MM/YY)
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    } else {
      setCardExpiry(value);
    }
  };

  // Validate fields for Step 1
  const validateContact = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.replace(/[^0-9]/g, '').length < 8) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!location.trim()) newErrors.location = 'Current location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate fields for Step 2
  const validateEducation = () => {
    const newErrors: Record<string, string> = {};
    if (!university.trim()) newErrors.university = 'College or University name is required';
    if (!gradYear.trim() || Number(gradYear) < 1970 || Number(gradYear) > 2035) {
      newErrors.gradYear = 'Please enter a valid graduation year';
    }
    if (experience < 0) newErrors.experience = 'Experience cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate fields for Step 3
  const validateDocuments = () => {
    const newErrors: Record<string, string> = {};
    if (!resumeName) newErrors.resume = 'Please upload your resume';
    if (!coverLetter.trim() || coverLetter.trim().length < 30) {
      newErrors.coverLetter = 'Cover letter must be at least 30 characters';
    }
    if (!whyJoin.trim() || whyJoin.trim().length < 30) {
      newErrors.whyJoin = 'This field must be at least 30 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle mock file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setResumeName(file.name);

    // Simulate progress bar loading
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  // Add custom skill to list
  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = skillsInput.trim().replace(/,/g, '');
      if (val && !skillsList.includes(val)) {
        setSkillsList([...skillsList, val]);
        setSkillsInput('');
      }
    }
  };

  const removeSkill = (index: number) => {
    setSkillsList(skillsList.filter((_, i) => i !== index));
  };

  // Handle payment validation & submission
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Card fields validation
    if (paymentMethod === 'card') {
      const cardErrors: Record<string, string> = {};
      if (!cardName.trim()) cardErrors.cardName = 'Name on card is required';
      if (cardNumber.replace(/\s+/g, '').length !== 16) cardErrors.cardNumber = 'Enter a valid 16-digit card number';
      if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) cardErrors.cardExpiry = 'Enter expiry format MM/YY';
      if (cardCvv.length < 3) cardErrors.cardCvv = 'Enter CVV code';
      
      if (Object.keys(cardErrors).length > 0) {
        setErrors(cardErrors);
        return;
      }
    }

    // Simple Netbanking validation
    if (paymentMethod === 'netbanking' && !selectedBank) {
      alert('Please select a bank');
      return;
    }

    // Start payment processing steps
    setErrors({});
    setPaymentProcessing(true);
    
    const messages = [
      'Establishing secure connection...',
      'Authorizing transaction with payment gateway...',
      'Verifying account balance...',
      'Completing registration verification...',
      'Generating application certificate...'
    ];

    let currentMsgIndex = 0;
    setProcessingMessage(messages[0]);

    const msgInterval = setInterval(() => {
      currentMsgIndex++;
      if (currentMsgIndex < messages.length) {
        setProcessingMessage(messages[currentMsgIndex]);
      }
    }, 600);

    setTimeout(() => {
      clearInterval(msgInterval);
      
      // Payment Successful - Generate Applicant object
      const randomAppId = `CG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const randomTxnId = `TXN${Math.floor(100000000 + Math.random() * 900000000)}`;
      
      const newApplicant: Applicant = {
        id: randomAppId,
        jobId: job.id,
        jobTitle: job.title,
        jobDepartment: job.department,
        fullName,
        email,
        phone,
        location,
        experience,
        education,
        university,
        gradYear,
        skills: skillsList,
        resumeName,
        resumeUrl: '#', // Simulate file path
        coverLetter,
        whyJoin,
        workMode,
        paymentId: randomTxnId,
        paymentMethod: paymentMethod.toUpperCase(),
        amountPaid: amount,
        currency,
        status: 'Pending',
        appliedAt: new Date().toLocaleString()
      };

      setSubmittedData(newApplicant);
      setPaymentProcessing(false);
      setStep('receipt');
      
      // Notify parent app
      onSubmitSuccess(newApplicant);
    }, 3500);
  };

  // Download transaction receipt as txt file
  const downloadReceipt = () => {
    if (!submittedData) return;
    const text = `
========================================
       CAREEERGATE VERIFIED RECEIPT
========================================
Receipt Date: ${submittedData.appliedAt}
Application ID: ${submittedData.id}
Transaction ID: ${submittedData.paymentId}
----------------------------------------
APPLICANT DETAILS:
Name: ${submittedData.fullName}
Email: ${submittedData.email}
Phone: ${submittedData.phone}
Location: ${submittedData.location}

JOB APPLICATION DETAILS:
Job Role: ${submittedData.jobTitle}
Department: ${submittedData.jobDepartment}
Education: ${submittedData.education} (${submittedData.university})
Experience: ${submittedData.experience} Years
Work Mode: ${submittedData.workMode}

PAYMENT DETAILS:
Payment Fee: ₹${submittedData.amountPaid}.00 (100 Rupees)
Payment Status: SUCCESSFUL / VERIFIED
Gateway Method: ${submittedData.paymentMethod}
----------------------------------------
Thank you for your verification payment.
Your application is fast-tracked for review.
========================================
`;
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${submittedData.id}-Receipt.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Progress Tracker (Hide on receipt screen) */}
        {step !== 'receipt' && (
          <div className="bg-slate-900/90 sticky top-0 z-10 px-6 pt-6 pb-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
                Applying For
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {job.title}
              </h2>
            </div>
            
            {/* Steps Indicators */}
            <div className="hidden sm:flex items-center gap-3">
              {[
                { id: 'contact', num: 1, label: 'Contact' },
                { id: 'education', num: 2, label: 'Experience' },
                { id: 'documents', num: 3, label: 'Materials' },
                { id: 'payment', num: 4, label: 'Verify Fee' }
              ].map((s, idx) => {
                const stepOrder = ['contact', 'education', 'documents', 'payment'];
                const currentIdx = stepOrder.indexOf(step);
                const isActive = step === s.id;
                const isCompleted = currentIdx > idx;

                return (
                  <div key={s.id} className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isActive ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20' : 
                      isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isCompleted ? <Check size={12} strokeWidth={3} /> : s.num}
                    </div>
                    <span className={`text-xs font-medium ${
                      isActive ? 'text-white' : 
                      isCompleted ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {s.label}
                    </span>
                    {idx < 3 && <div className="w-4 h-[1px] bg-slate-800" />}
                  </div>
                );
              })}
            </div>

            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {step === 'contact' && (
            <div className="space-y-6 animate-scale-in">
              <div className="border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <User size={20} className="text-violet-500" />
                  Personal Information
                </h3>
                <p className="text-sm text-slate-400 mt-1">Provide your primary contact and location details.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className={`w-full bg-slate-950 border ${errors.fullName ? 'border-red-500' : 'border-slate-800'} focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-all text-sm`}
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3.5 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="johndoe@example.com"
                      className={`w-full bg-slate-950 border ${errors.email ? 'border-red-500' : 'border-slate-800'} focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-all text-sm`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3.5 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`w-full bg-slate-950 border ${errors.phone ? 'border-red-500' : 'border-slate-800'} focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-all text-sm`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Current Location *</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Mumbai, India"
                      className={`w-full bg-slate-950 border ${errors.location ? 'border-red-500' : 'border-slate-800'} focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-all text-sm`}
                    />
                  </div>
                  {errors.location && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.location}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 'education' && (
            <div className="space-y-6 animate-scale-in">
              <div className="border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <GraduationCap size={20} className="text-violet-500" />
                  Professional & Education Details
                </h3>
                <p className="text-sm text-slate-400 mt-1">Briefly outline your academic and industrial background.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Highest Education Level *</label>
                  <div className="relative">
                    <GraduationCap size={16} className="absolute left-3 top-3.5 text-slate-500" />
                    <select
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none transition-all text-sm appearance-none"
                    >
                      <option>High School / Diploma</option>
                      <option>Bachelor's Degree</option>
                      <option>Master's Degree</option>
                      <option>Ph.D. / Doctorate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">College / University Name *</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3 top-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="University of Mumbai"
                      className={`w-full bg-slate-950 border ${errors.university ? 'border-red-500' : 'border-slate-800'} focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-all text-sm`}
                    />
                  </div>
                  {errors.university && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.university}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Graduation Year *</label>
                  <input
                    type="number"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    placeholder="2025"
                    min="1970"
                    max="2035"
                    className={`w-full bg-slate-950 border ${errors.gradYear ? 'border-red-500' : 'border-slate-800'} focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-all text-sm`}
                  />
                  {errors.gradYear && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.gradYear}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Years of Professional Experience *</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    min="0"
                    max="45"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-all text-sm"
                  />
                  {errors.experience && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.experience}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Core Skills (Press Enter to add)
                </label>
                <div className={`w-full bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-wrap gap-2 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all`}>
                  {skillsList.map((skill, index) => (
                    <span 
                      key={index} 
                      className="flex items-center gap-1 text-xs text-white bg-violet-600/30 border border-violet-500/20 px-2 py-1 rounded-md"
                    >
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => removeSkill(index)}
                        className="text-violet-400 hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    onKeyDown={addSkill}
                    placeholder="e.g. React, Python"
                    className="flex-1 bg-transparent min-w-[120px] text-white placeholder-slate-600 focus:outline-none text-sm py-0.5"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 'documents' && (
            <div className="space-y-6 animate-scale-in">
              <div className="border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText size={20} className="text-violet-500" />
                  Resume & Cover Letter
                </h3>
                <p className="text-sm text-slate-400 mt-1">Upload your CV and provide key screening answers.</p>
              </div>

              {/* Resume File Selector Simulation */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Resume / CV *</label>
                <div className={`relative border-2 border-dashed ${errors.resume ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800 hover:border-violet-500/50'} rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/50`}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  
                  {!resumeName ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UploadCloud size={32} className="text-slate-500" />
                      <span className="text-sm font-semibold text-white">Click or drag resume file here</span>
                      <span className="text-xs text-slate-500">Supports PDF, DOC, DOCX up to 10MB</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-3">
                        <FileText size={24} className="text-violet-500" />
                        <span className="text-sm font-semibold text-white truncate max-w-[250px]">{resumeName}</span>
                      </div>
                      
                      {isUploading ? (
                        <div className="max-w-[200px] mx-auto">
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-violet-600 transition-all duration-150" 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">Uploading {uploadProgress}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-xs text-emerald-400">
                          <CheckCircle size={14} />
                          <span>Uploaded successfully</span>
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setResumeName('');
                            }} 
                            className="text-red-400 hover:underline hover:text-red-300 font-medium ml-2"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {errors.resume && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.resume}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Cover Letter (Short Intro) *</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself, highlight your credentials, and summarize why you are interested in this position..."
                  rows={3}
                  className={`w-full bg-slate-950 border ${errors.coverLetter ? 'border-red-500' : 'border-slate-800'} focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-all text-sm resize-none`}
                />
                <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                  <span>Minimum 30 characters</span>
                  <span>{coverLetter.length} chars</span>
                </div>
                {errors.coverLetter && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.coverLetter}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Why do you think you are a good fit for this role? *</label>
                <textarea
                  value={whyJoin}
                  onChange={(e) => setWhyJoin(e.target.value)}
                  placeholder="Explain how your expertise matches the job description, listing relevant projects or achievements..."
                  rows={3}
                  className={`w-full bg-slate-950 border ${errors.whyJoin ? 'border-red-500' : 'border-slate-800'} focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-all text-sm resize-none`}
                />
                <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                  <span>Minimum 30 characters</span>
                  <span>{whyJoin.length} chars</span>
                </div>
                {errors.whyJoin && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.whyJoin}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Work Arrangement</label>
                <div className="flex gap-4">
                  {['Remote', 'Hybrid', 'On-site'].map((mode) => (
                    <label key={mode} className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white">
                      <input
                        type="radio"
                        name="workMode"
                        value={mode}
                        checked={workMode === mode}
                        onChange={() => setWorkMode(mode)}
                        className="w-4 h-4 text-violet-600 bg-slate-950 border-slate-800 focus:ring-violet-500 focus:ring-offset-slate-900 focus:ring-1"
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6 animate-scale-in">
              <div className="bg-gradient-to-r from-violet-900/40 via-fuchsia-900/20 to-slate-900 border border-violet-500/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl self-start md:self-center">
                  <CreditCard className="text-violet-400" size={28} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Application Registration & Verification Fee</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    To prevent automated spams and fast-track your profile directly to recruiter interviews, a one-time registration fee of <span className="font-bold text-violet-300">₹100 Rupees</span> is required. Your application will be instantly indexed and evaluated upon payment.
                  </p>
                </div>
              </div>

              {/* Currency & Amount display */}
              <div className="flex items-center justify-between bg-slate-950 border border-slate-800/80 p-4 rounded-xl">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-widest block font-medium">Registration Fee</span>
                  <span className="text-3xl font-extrabold text-white mt-1 block">
                    ₹100.00 <span className="text-sm font-medium text-slate-400">(100 Rupees)</span>
                  </span>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold">
                  INR (₹) Only
                </div>
              </div>

              {/* Payment Methods Options */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2 border-b border-slate-800 mb-5 pb-1">
                  {[
                    { id: 'upi', label: 'UPI / QR Scan', icon: '⚡' },
                    { id: 'card', label: 'Credit Card', icon: '💳' },
                    { id: 'netbanking', label: 'Net Banking', icon: '🏦' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(m.id as any);
                        setErrors({});
                      }}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                        paymentMethod === m.id 
                          ? 'bg-violet-600/10 border-violet-500 text-white shadow-sm shadow-violet-500/10' 
                          : 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 bg-slate-950/20'
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  {/* UPI Gateway Interface */}
                  {paymentMethod === 'upi' && (
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-4 text-center">
                      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xl max-w-[160px]">
                        {/* Simulated QR Code Canvas/SVG */}
                        <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                          {/* Outer frame */}
                          <path d="M5 5h20v5H10v15H5V5zm0 90h20v-5H10v-15H5v20zM95 5H75v5h15v15h5V5zm0 90H75v-5h15v-15h5v20z" fill="#000"/>
                          {/* Inner blocks - QR Code Mock patterns */}
                          <path d="M10 10h10v10H10V10zm25 10h5v15h-5V20zm10 5h15v5H45v-5zm20 5h10v15H65V30z" fill="#312e81"/>
                          <path d="M10 40h20v5H10v-5zm35 5h10v15H45V45zm25-10h15v5H70v-5zM15 70h15v15H15V70zm45 10h20v5H60v-5z" fill="#1e1b4b"/>
                          <path d="M10 70h5v15h-5V70zm40 10h10v5H50v-5zm10-15h15v5H60v-5zm15 15h15v5H75v-5zm-5-30h10v15H70V50z" fill="#4c1d95"/>
                          <circle cx="50" cy="50" r="10" fill="#6366f1" />
                        </svg>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">Scan this QR using Google Pay, PhonePe, or Paytm</p>
                        <p className="text-xs text-violet-400 font-medium">Verify Amount: {currency === 'INR' ? '₹' : '$'}{amount}.00</p>
                        <p className="text-[10px] text-slate-500 font-medium">UPI ID: jobpay@careergate</p>
                      </div>

                      {/* Timer */}
                      <div className="flex items-center gap-1.5 bg-slate-900 border border-white/5 py-1 px-3 rounded-full text-[11px] font-semibold text-slate-400">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                        <span>Expires in {formatUpiTime(upiTimer)}</span>
                      </div>

                      <div className="pt-2 w-full max-w-[280px]">
                        <button
                          type="button"
                          onClick={() => {
                            // Instant auto-payment simulation
                            setPaymentProcessing(true);
                            handlePayment({ preventDefault: () => {} } as any);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 text-xs tracking-wider uppercase transition-all"
                        >
                          <RefreshCw size={14} className="animate-spin" />
                          Simulate QR Code Scan
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Card Gateway Interface */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 p-5 bg-slate-950/40 rounded-2xl border border-slate-800">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none"
                        />
                        {errors.cardName && <p className="text-[10px] text-red-500 mt-0.5">{errors.cardName}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4111 2222 3333 4444"
                          maxLength={19}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none"
                        />
                        {errors.cardNumber && <p className="text-[10px] text-red-500 mt-0.5">{errors.cardNumber}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={handleCardExpiryChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none"
                          />
                          {errors.cardExpiry && <p className="text-[10px] text-red-500 mt-0.5">{errors.cardExpiry}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">CVV Code</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/gi, ''))}
                            placeholder="***"
                            maxLength={3}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none"
                          />
                          {errors.cardCvv && <p className="text-[10px] text-red-500 mt-0.5">{errors.cardCvv}</p>}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/20 text-sm mt-2 transition-all"
                      >
                        Securely Pay {currency === 'INR' ? '₹' : '$'}{amount}
                      </button>
                    </div>
                  )}

                  {/* Net Banking Gateway Interface */}
                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-4 p-5 bg-slate-950/40 rounded-2xl border border-slate-800">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Select Bank</label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none appearance-none"
                        >
                          <option value="">-- Choose Bank --</option>
                          <option value="SBI">State Bank of India (SBI)</option>
                          <option value="HDFC">HDFC Bank</option>
                          <option value="ICICI">ICICI Bank</option>
                          <option value="AXIS">Axis Bank</option>
                          <option value="KOTAK">Kotak Mahindra Bank</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/20 text-sm mt-2 transition-all"
                      >
                        Proceed to NetBanking Payment
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {step === 'receipt' && submittedData && (
            <div className="space-y-6 text-center animate-scale-in py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
                <CheckCircle size={36} className="animate-pulse" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white">Application Submitted!</h3>
                <p className="text-sm text-emerald-400 font-semibold">Payment Confirmed & Profile Verified Successfully</p>
                <p className="text-xs text-slate-400 max-w-[450px] mx-auto mt-2">
                  Thank you for applying. Your registration fee has been received, and your profile is fast-tracked. Our recruiters will contact you via email at <span className="text-white font-medium">{submittedData.email}</span>.
                </p>
              </div>

              {/* Receipt Table */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 text-left max-w-xl mx-auto space-y-3.5">
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-xs font-bold text-slate-400">APPLICATION ID</span>
                  <span className="text-xs font-mono font-bold text-white">{submittedData.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-xs font-bold text-slate-400">ROLE APPLIED</span>
                  <span className="text-xs font-bold text-white">{submittedData.jobTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-xs font-bold text-slate-400">APPLICANT</span>
                  <span className="text-xs font-bold text-white">{submittedData.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-xs font-bold text-slate-400">TRANSACTION ID</span>
                  <span className="text-xs font-mono text-white">{submittedData.paymentId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-xs font-bold text-slate-400">AMOUNT PAID</span>
                  <span className="text-xs font-extrabold text-violet-400">
                    ₹{submittedData.amountPaid}.00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-slate-400">STATUS</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    Verified (Paid)
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto pt-4">
                <button
                  onClick={downloadReceipt}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all text-sm border border-white/5"
                >
                  <Download size={16} />
                  Download Receipt
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all text-sm shadow-md"
                >
                  Finish & Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer (Hide on payment processing and receipt) */}
        {step !== 'receipt' && !paymentProcessing && (
          <div className="bg-slate-900/90 border-t border-slate-800 px-6 py-4 flex items-center justify-between sticky bottom-0 z-10">
            {/* Back button */}
            {step !== 'contact' ? (
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  if (step === 'payment') setStep('documents');
                  else if (step === 'documents') setStep('education');
                  else if (step === 'education') setStep('contact');
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <div />
            )}

            {/* Next button */}
            {step !== 'payment' ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 'contact' && validateContact()) {
                    setStep('education');
                  } else if (step === 'education' && validateEducation()) {
                    setStep('documents');
                  } else if (step === 'documents' && validateDocuments()) {
                    setStep('payment');
                  }
                }}
                className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold shadow-md shadow-violet-600/10 hover:shadow-violet-600/20 transition-all hover:scale-[1.02]"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <div />
            )}
          </div>
        )}

        {/* Payment Processing Overlay */}
        {paymentProcessing && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center space-y-5 p-6 text-center z-50">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-violet-600/20 border-t-violet-500 rounded-full animate-spin" />
              <div className="absolute w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                <CreditCard size={14} className="text-violet-400" />
              </div>
            </div>
            <div className="space-y-1 max-w-[280px]">
              <h4 className="text-lg font-bold text-white">Processing Payment</h4>
              <p className="text-xs text-violet-400 font-bold">{currency === 'INR' ? '₹' : '$'}{amount}.00 Fee</p>
              <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed animate-pulse">{processingMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
