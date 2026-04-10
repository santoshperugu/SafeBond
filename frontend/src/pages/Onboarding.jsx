import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  User, 
  MapPin, 
  FileText, 
  Camera, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle,
  Briefcase,
  Heart,
  ShieldCheck,
  ShieldAlert,
  Search
} from 'lucide-react';

// Demo Aadhaar Database (client-side, for demo purposes)
const DEMO_AADHAAR_DB = {
  '234567890123': { 
    name: 'Arjun Sharma', dob: '15 Mar 1996', address: '42, MG Road, Bengaluru, Karnataka', gender: 'Male',
    backgroundCheck: { clearedStatus: 'Clear', remarks: 'No adverse history found.' }
  },
  '876543210987': { 
    name: 'Priya Mehta', dob: '22 Jul 1998', address: '18, Civil Lines, Jaipur, Rajasthan', gender: 'Female',
    backgroundCheck: { 
      clearedStatus: 'Minor Flag', remarks: 'Minor civil dispute regarding property rental.',
      policeCases: [{ caseNo: 'CIVIL/552', date: '2022-04-10', description: 'Rental agreement dispute', status: 'In Mediation' }]
    }
  },
  '345678912345': { 
    name: 'Rahul Verma', dob: '01 Jan 1994', address: '7, Lake View Road, Pune, Maharashtra', gender: 'Male',
    backgroundCheck: { 
      clearedStatus: 'Alert', remarks: 'Active investigation regarding financial document forgery.',
      firs: [{ firNo: 'PN/EOW/2023/12', station: 'EOW, Pune', date: '2023-11-20', charge: 'IPC 468', status: 'Pending' }]
    }
  },
  '987654321098': { 
    name: 'Sneha Iyer', dob: '10 Nov 1999', address: '55, Anna Nagar, Chennai, Tamil Nadu', gender: 'Female',
    backgroundCheck: { clearedStatus: 'Clear', remarks: 'Standard background check cleared.' }
  },
  '123456789012': { 
    name: 'Kavya Nair', dob: '05 Feb 1997', address: 'Patel Nagar, New Delhi', gender: 'Female',
    backgroundCheck: { 
      clearedStatus: 'Alert', remarks: 'Credential verification failed for multiple professional claims.',
      complaints: [{ complaintNo: 'COMP/2024/002', date: '2024-02-01', description: 'Professional forgery allegation', filedBy: 'Former Employer' }]
    }
  },
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    dob: '',
    gender: '',
    education: '',
    occupation: '',
    annualIncome: '',
    religion: '',
    caste: '',
    fathersName: '',
    mothersName: '',
    familyType: '',
    familyValues: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    aadhaarNumber: '',
    aadhaarVerified: false,
    backgroundCheck: null,
    documents: {
      aadhaarOrPassport: '',
      photos: [],
      incomeProof: '',
      familyCertificates: ''
    }
  });

  const [aadhaarInput, setAadhaarInput] = useState('');
  const [aadhaarResult, setAadhaarResult] = useState(null); // null | { found: bool, data?: {} }
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);

  const [uploading, setUploading] = useState({
    aadhaar: false,
    income: false,
    photos: false
  });

  const handleAadhaarVerify = () => {
    const cleaned = aadhaarInput.replace(/\s/g, '');
    if (cleaned.length !== 12 || !/^\d{12}$/.test(cleaned)) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    setVerifyingAadhaar(true);
    // Simulate API delay
    setTimeout(() => {
      const record = DEMO_AADHAAR_DB[cleaned];
      if (record) {
        setAadhaarResult({ found: true, data: record });
        const masked = 'XXXX XXXX ' + cleaned.slice(-4);
        setFormData(prev => ({ 
          ...prev, 
          aadhaarNumber: masked, 
          aadhaarVerified: true,
          backgroundCheck: record.backgroundCheck || { clearedStatus: 'Clear' }
        }));
        toast.success('Aadhaar Verified Successfully!');
      } else {
        setAadhaarResult({ found: false });
        setFormData(prev => ({ ...prev, aadhaarNumber: '', aadhaarVerified: false, backgroundCheck: null }));
      }
      setVerifyingAadhaar(false);
    }, 1500);
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading({ ...uploading, [type]: true });
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const { data } = await axios.post('http://localhost:5000/api/upload/document', uploadFormData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (type === 'photos') {
        setFormData({
          ...formData,
          documents: {
            ...formData.documents,
            photos: [...formData.documents.photos, data.url]
          }
        });
      } else {
        const fieldMap = {
          aadhaar: 'aadhaarOrPassport',
          income: 'incomeProof'
        };
        setFormData({
          ...formData,
          documents: {
            ...formData.documents,
            [fieldMap[type]]: data.url
          }
        });
      }
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Profile updated successfully!");
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Personal', icon: <User size={20} /> },
    { title: 'Family', icon: <Heart size={20} /> },
    { title: 'Location', icon: <MapPin size={20} /> },
    { title: 'Documents', icon: <Camera size={20} /> },
    { title: 'Review', icon: <FileText size={20} /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-12">
           <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-slate-500 hover:text-primary-600 transition-all font-bold text-sm"
           >
             <ChevronLeft size={18} />
             <span>Back to Dashboard</span>
           </button>
           <div className="text-xs font-black uppercase tracking-widest text-slate-400">Section {step} of 5</div>
        </div>
        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step > i + 1 ? 'bg-green-500 text-white' : 
                    step === i + 1 ? 'bg-primary-600 text-white ring-4 ring-primary-100' : 
                    'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {step > i + 1 ? <CheckCircle size={20} /> : s.icon}
                </div>
                <span className={`text-xs mt-2 font-medium ${step === i + 1 ? 'text-primary-600' : 'text-slate-500'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Personal Details</h2>
                    <p className="text-slate-500">Tell us a bit about yourself.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                      <input 
                        type="date" name="dob" value={formData.dob} onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                      <select 
                        name="gender" value={formData.gender} onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Education</label>
                      <input 
                        type="text" name="education" value={formData.education} onChange={handleChange}
                        placeholder="e.g. B.Tech in Computer Science"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Occupation</label>
                      <input 
                        type="text" name="occupation" value={formData.occupation} onChange={handleChange}
                        placeholder="e.g. Software Engineer"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Annual Income (₹)</label>
                      <input 
                        type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange}
                        placeholder="e.g. 1200000"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Religion</label>
                      <input 
                        type="text" name="religion" value={formData.religion} onChange={handleChange}
                        placeholder="e.g. Hindu"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Caste (Optional)</label>
                      <input 
                        type="text" name="caste" value={formData.caste} onChange={handleChange}
                        placeholder="e.g. Brahmin"
                        className="input-field"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Family Background</h2>
                    <p className="text-slate-500">Information about your family roots.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Father's Name</label>
                      <input 
                        type="text" name="fathersName" value={formData.fathersName} onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Mother's Name</label>
                      <input 
                        type="text" name="mothersName" value={formData.mothersName} onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Family Type</label>
                      <select 
                        name="familyType" value={formData.familyType} onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select Type</option>
                        <option value="Nuclear">Nuclear</option>
                        <option value="Joint">Joint</option>
                        <option value="Extended">Extended</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Family Values</label>
                      <select 
                        name="familyValues" value={formData.familyValues} onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select Values</option>
                        <option value="Traditional">Traditional</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Liberal">Liberal</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Location Details</h2>
                    <p className="text-slate-500">Where are you currently located?</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                      <textarea 
                        name="address" value={formData.address} onChange={handleChange}
                        rows="3"
                        className="input-field"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                        <input 
                          type="text" name="city" value={formData.city} onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                        <input 
                          type="text" name="state" value={formData.state} onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                        <input 
                          type="text" name="country" value={formData.country} onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Pincode</label>
                        <input 
                          type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Document Upload & Aadhaar Verification</h2>
                    <p className="text-slate-500">Verify your Aadhaar and upload supporting documents.</p>
                  </div>

                  {/* Aadhaar Verification Panel */}
                  <div className="p-6 border-2 border-slate-200 rounded-3xl bg-slate-50 mb-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2.5 bg-blue-100 rounded-2xl text-blue-600 mr-3">
                        <ShieldCheck size={22} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Aadhaar Verification</p>
                        <p className="text-xs text-slate-500">Enter your 12-digit Aadhaar number for instant verification</p>
                      </div>
                      {formData.aadhaarVerified && (
                        <span className="ml-auto flex items-center text-xs font-black uppercase tracking-widest text-green-600 bg-green-100 px-3 py-1.5 rounded-full">
                          <CheckCircle size={13} className="mr-1" /> Verified
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="e.g. 2345 6789 0123"
                        value={aadhaarInput}
                        onChange={(e) => setAadhaarInput(e.target.value)}
                        maxLength={14}
                        className="input-field flex-1 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleAadhaarVerify}
                        disabled={verifyingAadhaar}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all disabled:opacity-50"
                      >
                        {verifyingAadhaar ? (
                          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Checking...</span></>
                        ) : (
                          <><Search size={14} /><span>Verify Now</span></>
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {aadhaarResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`mt-4 p-5 rounded-2xl border ${
                            aadhaarResult.found
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          {aadhaarResult.found ? (
                            <div>
                              <div className="flex items-center mb-3">
                                <ShieldCheck size={18} className="text-green-600 mr-2" />
                                <p className="font-black text-green-700 uppercase text-xs tracking-widest">Aadhaar Record Found</p>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div><p className="text-slate-500 text-xs mb-0.5">Name</p><p className="font-bold text-slate-900">{aadhaarResult.data.name}</p></div>
                                <div><p className="text-slate-500 text-xs mb-0.5">Date of Birth</p><p className="font-bold text-slate-900">{aadhaarResult.data.dob}</p></div>
                                <div><p className="text-slate-500 text-xs mb-0.5">Gender</p><p className="font-bold text-slate-900">{aadhaarResult.data.gender}</p></div>
                                <div><p className="text-slate-500 text-xs mb-0.5">Address on Record</p><p className="font-bold text-slate-900">{aadhaarResult.data.address}</p></div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <ShieldAlert size={18} className="text-red-600 mr-2" />
                              <div>
                                <p className="font-black text-red-700 text-sm">Aadhaar Not Found in Records</p>
                                <p className="text-xs text-red-500 mt-0.5">Try demo numbers: 2345 6789 0123 or 8765 4321 0987</p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl hover:border-primary-400 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-3 bg-slate-100 rounded-2xl text-slate-500 mr-4">
                            <FileText size={24} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">Aadhaar / Passport</p>
                            <p className="text-xs text-slate-500">Identity and Age Proof (JPG, PNG or PDF)</p>
                          </div>
                        </div>
                        <input 
                          type="file" id="aadhaar" className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'aadhaar')}
                        />
                        <label 
                          htmlFor="aadhaar" 
                          className={`btn-secondary cursor-pointer py-1.5 px-4 text-sm ${uploading.aadhaar ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {uploading.aadhaar ? 'Uploading...' : formData.documents.aadhaarOrPassport ? 'Change File' : 'Upload'}
                        </label>
                      </div>
                      {formData.documents.aadhaarOrPassport && (
                        <div className="mt-4 text-xs text-green-600 flex items-center">
                          <CheckCircle size={14} className="mr-1" /> File uploaded successfully
                        </div>
                      )}
                    </div>

                    <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl hover:border-primary-400 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-3 bg-slate-100 rounded-2xl text-slate-500 mr-4">
                            <Briefcase size={24} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">Income Proof</p>
                            <p className="text-xs text-slate-500">Latest Salary Slip or Form 16</p>
                          </div>
                        </div>
                        <input 
                          type="file" id="income" className="hidden"
                          onChange={(e) => handleFileUpload(e, 'income')}
                        />
                        <label 
                          htmlFor="income" 
                          className={`btn-secondary cursor-pointer py-1.5 px-4 text-sm ${uploading.income ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {uploading.income ? 'Uploading...' : formData.documents.incomeProof ? 'Change File' : 'Upload'}
                        </label>
                      </div>
                      {formData.documents.incomeProof && (
                        <div className="mt-4 text-xs text-green-600 flex items-center">
                          <CheckCircle size={14} className="mr-1" /> File uploaded successfully
                        </div>
                      )}
                    </div>

                    <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl hover:border-primary-400 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-3 bg-slate-100 rounded-2xl text-slate-500 mr-4">
                            <Camera size={24} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">Profile Photos</p>
                            <p className="text-xs text-slate-500">Upload up to 3 clear photos</p>
                          </div>
                        </div>
                        <input 
                          type="file" id="photos" className="hidden" multiple
                          onChange={(e) => handleFileUpload(e, 'photos')}
                        />
                        <label 
                          htmlFor="photos" 
                          className={`btn-secondary cursor-pointer py-1.5 px-4 text-sm ${uploading.photos ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {uploading.photos ? 'Uploading...' : 'Upload More'}
                        </label>
                      </div>
                      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                        {formData.documents.photos.map((url, i) => (
                          <img key={i} src={url} alt={`Preview ${i}`} className="w-16 h-16 object-cover rounded-xl" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 text-center"
                >
                  <div className="inline-block p-6 bg-green-50 rounded-full text-green-500 mb-4">
                    <CheckCircle size={48} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Ready to Submit!</h2>
                    <p className="text-slate-500 mt-2 max-w-md mx-auto">
                      Please review all information before submitting your profile for verification.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 divide-y divide-slate-200">
                    <div className="pb-4">
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Personal</p>
                      <p className="text-slate-800 font-medium">{formData.gender || 'N/A'}, {formData.religion || 'N/A'}</p>
                      <p className="text-sm text-slate-600">{formData.education}</p>
                    </div>
                    <div className="py-4">
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Location</p>
                      <p className="text-slate-800 font-medium">{formData.city}, {formData.state}</p>
                      <p className="text-sm text-slate-600">{formData.address}</p>
                    </div>
                    <div className="pt-4">
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Background Status</p>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          !formData.backgroundCheck ? 'bg-slate-300' :
                          formData.backgroundCheck.clearedStatus === 'Clear' ? 'bg-green-500' :
                          formData.backgroundCheck.clearedStatus === 'Minor Flag' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <span className="font-bold text-slate-800">
                          {!formData.backgroundCheck ? 'Not Verified' : formData.backgroundCheck.clearedStatus}
                        </span>
                      </div>
                      {formData.backgroundCheck?.remarks && (
                        <p className="text-[10px] text-slate-500 mt-1 italic leading-tight">Note: {formData.backgroundCheck.remarks}</p>
                      )}
                    </div>
                    <div className="pt-4">
                      <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Documents</p>
                      <div className="flex gap-2 mt-2">
                        {formData.documents.aadhaarOrPassport && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">ID Proof ✓</span>}
                        {formData.documents.incomeProof && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Income Proof ✓</span>}
                        {formData.documents.photos.length > 0 && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{formData.documents.photos.length} Photo(s) ✓</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex justify-between">
              {step > 1 ? (
                <button 
                  onClick={prevStep}
                  className="flex items-center text-slate-600 font-semibold hover:text-slate-900 transition-colors"
                >
                  <ChevronLeft size={20} className="mr-1" /> Back
                </button>
              ) : <div></div>}

              {step < 5 ? (
                <button 
                  onClick={nextStep}
                  className="btn-primary flex items-center"
                >
                  Next Step <ChevronRight size={20} className="ml-1" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit} disabled={loading}
                  className="btn-primary flex items-center bg-green-600 hover:bg-green-700 ring-green-100"
                >
                  {loading ? 'Submitting...' : 'Complete Profile'} <CheckCircle size={20} className="ml-1" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
