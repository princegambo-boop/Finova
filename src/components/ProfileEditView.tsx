import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Camera, 
  Upload, 
  Sparkles, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Building, 
  Briefcase, 
  MapPin, 
  Globe, 
  ArrowLeft, 
  RotateCcw, 
  Lock, 
  Bell, 
  Sliders, 
  Info,
  CheckCircle2,
  Trash2,
  Eye,
  Filter
} from 'lucide-react';
import { User } from '../types';
import { FinovaAvatar, getInitials } from './FinovaAvatar';
import { CURATED_AVATARS, CuratedAvatar } from '../data/curatedAvatars';
import { AvatarCropperModal } from './AvatarCropperModal';

interface ProfileEditViewProps {
  currentUser: User | null;
  onUpdateProfile: (updatedData: Partial<User>) => Promise<void>;
  onNavigateTab: (tab: string) => void;
}

export const ProfileEditView: React.FC<ProfileEditViewProps> = ({
  currentUser,
  onUpdateProfile,
  onNavigateTab,
}) => {
  // Form fields
  const [name, setName] = useState<string>(currentUser?.name || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '+1 (555) 234-8900');
  const [jobTitle, setJobTitle] = useState<string>(currentUser?.jobTitle || 'Managing Director');
  const [company, setCompany] = useState<string>(currentUser?.company || 'Finova Capital Group');
  const [location, setLocation] = useState<string>(currentUser?.location || 'San Francisco, CA');
  const [bio, setBio] = useState<string>(
    currentUser?.bio || 'Fintech investor and liquidity allocator managing balanced growth portfolios.'
  );
  const [currencyPreference, setCurrencyPreference] = useState<string>(
    currentUser?.currencyPreference || 'USD'
  );
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(
    currentUser?.twoFactorEnabled !== false
  );
  const [emailNotifications, setEmailNotifications] = useState<boolean>(
    currentUser?.emailNotifications !== false
  );
  const [smsNotifications, setSmsNotifications] = useState<boolean>(
    currentUser?.smsNotifications || false
  );

  // Profile Picture (Avatar) State
  const [currentAvatar, setCurrentAvatar] = useState<string | undefined>(currentUser?.avatar);
  const [avatarAttribution, setAvatarAttribution] = useState<User['avatarAttribution']>(
    currentUser?.avatarAttribution
  );

  // Avatar Selection Sub-tabs: 'curated' | 'upload' | 'preview'
  const [activeAvatarTab, setActiveAvatarTab] = useState<'curated' | 'upload'>('curated');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Cropper Modal state
  const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);
  const [selectedFileForCropping, setSelectedFileForCropping] = useState<File | null>(null);

  // Feedback states
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string>('');
  const [errorToast, setErrorToast] = useState<string>('');

  // Sync state if currentUser changes from outer auth
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.jobTitle) setJobTitle(currentUser.jobTitle);
      if (currentUser.company) setCompany(currentUser.company);
      if (currentUser.location) setLocation(currentUser.location);
      if (currentUser.bio) setBio(currentUser.bio);
      if (currentUser.currencyPreference) setCurrencyPreference(currentUser.currencyPreference);
      if (currentUser.twoFactorEnabled !== undefined) setTwoFactorEnabled(currentUser.twoFactorEnabled);
      if (currentUser.emailNotifications !== undefined) setEmailNotifications(currentUser.emailNotifications);
      if (currentUser.smsNotifications !== undefined) setSmsNotifications(currentUser.smsNotifications);
      setCurrentAvatar(currentUser.avatar);
      setAvatarAttribution(currentUser.avatarAttribution);
    }
  }, [currentUser]);

  // Filter curated avatars
  const filteredAvatars = CURATED_AVATARS.filter((avatar) => {
    const matchesCategory = selectedCategory === 'all' || avatar.category === selectedCategory;
    const query = searchFilter.toLowerCase();
    const matchesSearch =
      !query ||
      avatar.title.toLowerCase().includes(query) ||
      avatar.photographer.toLowerCase().includes(query) ||
      avatar.tags.some((t) => t.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  // Select a curated stock photo
  const handleSelectCuratedAvatar = (avatar: CuratedAvatar) => {
    setCurrentAvatar(avatar.url);
    setAvatarAttribution({
      photographer: avatar.photographer,
      photographerUrl: avatar.photographerUrl,
      source: 'Unsplash (Verified Stock Photography)',
      category: avatar.categoryLabel,
    });
  };

  // Revert / Remove photo to use brand-colored initials fallback
  const handleRemoveAvatar = () => {
    setCurrentAvatar(undefined);
    setAvatarAttribution(undefined);
  };

  // Handle custom file upload trigger
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFileForCropping(e.target.files[0]);
      setIsCropperOpen(true);
      // Reset input value so user can re-select same file if needed
      e.target.value = '';
    }
  };

  // Handle cropped image output
  const handleSaveCroppedImage = (dataUrl: string) => {
    setCurrentAvatar(dataUrl);
    setAvatarAttribution({
      photographer: 'User Custom Upload',
      source: 'Personal Upload (Moderation Verified)',
    });
  };

  // Save all profile changes
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorToast('Display Name cannot be empty.');
      return;
    }

    setIsSaving(true);
    setErrorToast('');

    try {
      await onUpdateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        jobTitle: jobTitle.trim(),
        company: company.trim(),
        location: location.trim(),
        bio: bio.trim(),
        currencyPreference,
        twoFactorEnabled,
        emailNotifications,
        smsNotifications,
        avatar: currentAvatar || undefined,
        avatarAttribution: currentAvatar ? avatarAttribution : undefined,
      });

      setSuccessToast('Profile and avatar settings saved successfully!');
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setErrorToast(err?.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#1E293B] shadow-2xs transition-all"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">
              Account & Profile Settings
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Manage your personal identity, verified banking credentials, and avatar
            </p>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('dashboard')}
            className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] bg-white border border-[#E2E8F0] rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            id="save-profile-top-btn"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#659B5E] hover:bg-[#54844e] rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {successToast && (
        <div className="p-4 bg-[#F0FDF4] border border-[#86EFAC] rounded-2xl flex items-center justify-between text-[#166534] shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast('')}
            className="text-xs font-semibold text-[#166534] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorToast && (
        <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl flex items-center justify-between text-[#991B1B] shadow-xs">
          <span className="text-xs sm:text-sm font-medium">{errorToast}</span>
          <button
            onClick={() => setErrorToast('')}
            className="text-xs font-semibold text-[#991B1B] hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Profile Layout: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Avatar Studio & Visual Identity (5 cols)     */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Avatar Overview Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Profile Picture (PFP)
              </span>
              <span className="text-[11px] font-semibold text-[#659B5E] bg-[#E8F0EA] px-2.5 py-0.5 rounded-full">
                Finova Identity
              </span>
            </div>

            {/* Avatar Centered Display with Fallback Preview */}
            <div className="flex flex-col items-center justify-center pt-2 pb-4 text-center">
              <div className="relative group">
                <FinovaAvatar
                  avatarUrl={currentAvatar}
                  name={name}
                  user={currentUser}
                  size="2xl"
                  showOnlineStatus={true}
                  className="shadow-md transition-transform group-hover:scale-[1.02]"
                />

                {/* Floating change button overlay */}
                <button
                  type="button"
                  onClick={() => setIsCropperOpen(true)}
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#133320] text-white hover:bg-[#659B5E] flex items-center justify-center shadow-lg border-2 border-white transition-colors"
                  title="Upload / Crop new photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Identity summary */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-[#1E293B]">{name || 'Your Name'}</h3>
                <p className="text-xs text-[#64748B]">{jobTitle} • {company}</p>
              </div>

              {/* Attribution / Mode description */}
              <div className="mt-3 max-w-xs text-center">
                {currentAvatar ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-[11px] text-[#475569]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#659B5E]" />
                    {avatarAttribution?.photographer ? (
                      <span>
                        Photo by{' '}
                        {avatarAttribution.photographerUrl ? (
                          <a
                            href={avatarAttribution.photographerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-[#659B5E] hover:underline"
                          >
                            {avatarAttribution.photographer}
                          </a>
                        ) : (
                          <span className="font-semibold">{avatarAttribution.photographer}</span>
                        )}
                      </span>
                    ) : (
                      <span>Custom Photo Active</span>
                    )}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F0EA] border border-[#CFE0D3] rounded-full text-[11px] text-[#2C4A28] font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#659B5E]" />
                    Finova Forest Monogram (Initials Fallback)
                  </div>
                )}
              </div>

              {/* Multi-size preview strip */}
              <div className="mt-5 w-full pt-4 border-t border-[#F1F5F9] flex items-center justify-around px-4">
                <div className="text-center">
                  <FinovaAvatar avatarUrl={currentAvatar} name={name} size="xs" />
                  <div className="text-[10px] text-[#94A3B8] mt-1 font-mono">28px</div>
                </div>
                <div className="text-center">
                  <FinovaAvatar avatarUrl={currentAvatar} name={name} size="sm" />
                  <div className="text-[10px] text-[#94A3B8] mt-1 font-mono">Navbar</div>
                </div>
                <div className="text-center">
                  <FinovaAvatar avatarUrl={currentAvatar} name={name} size="md" />
                  <div className="text-[10px] text-[#94A3B8] mt-1 font-mono">Card</div>
                </div>
                <div className="text-center">
                  <FinovaAvatar avatarUrl={currentAvatar} name={name} size="lg" />
                  <div className="text-[10px] text-[#94A3B8] mt-1 font-mono">Profile</div>
                </div>
              </div>

              {/* Quick Actions: Upload vs Remove */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 w-full">
                <label className="cursor-pointer px-4 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#1E293B] flex items-center gap-1.5 transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-[#659B5E]" />
                  <span>Upload Custom Photo</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </label>

                {currentAvatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-3.5 py-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                    title="Remove avatar and use Finova initials monogram"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Use Initials</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Curated Licensed Photo Selection Grid */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1E293B] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#659B5E]" />
                  Curated Stock Avatars
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Licensed authentic photography from verified creators (no AI-generated images)
                </p>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All (20+)' },
                { id: 'portraits', label: 'Portraits' },
                { id: 'abstract', label: 'Abstract' },
                { id: 'architecture', label: 'Architecture' },
                { id: 'objects', label: 'Objects' },
                { id: 'nature', label: 'Growth/Tree' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition-all text-xs ${
                    selectedCategory === tab.id
                      ? 'bg-[#133320] text-white shadow-2xs'
                      : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Grid of Licensed Stock Photos */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
              {filteredAvatars.map((item) => {
                const isSelected = currentAvatar === item.url;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectCuratedAvatar(item)}
                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all aspect-square bg-slate-100 flex flex-col justify-end p-1.5 ${
                      isSelected
                        ? 'border-[#659B5E] ring-2 ring-[#659B5E]/30 scale-95 shadow-md'
                        : 'border-transparent hover:border-[#CBD5E1]'
                    }`}
                  >
                    <img
                      src={item.thumbUrl}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Dark gradient for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Selected badge */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#659B5E] text-white flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    {/* Photographer credit snippet */}
                    <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[9px] font-semibold text-white truncate drop-shadow-xs">
                        {item.photographer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Licensing notice */}
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex items-start gap-2 text-[11px] text-[#64748B]">
              <Info className="w-4 h-4 text-[#659B5E] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#1E293B]">License & Attribution Guarantee: </span>
                All curated photos are sourced from the Unsplash open photography library with commercial licenses and authentic human photographer attribution.
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Account & Banking Profile Details (7 cols)  */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveAll} className="space-y-6">
            
            {/* Primary Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-[#659B5E]" />
                  Personal Information
                </h3>
                <p className="text-xs text-[#64748B]">
                  Your public display name and banking contact information
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Display Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#334155] flex items-center gap-1">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="profile-display-name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Prince Gambo"
                    required
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:border-[#659B5E] focus:ring-2 focus:ring-[#659B5E]/20 transition-all"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#334155] flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-[#16A34A] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="email"
                      id="profile-email-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:border-[#659B5E] focus:ring-2 focus:ring-[#659B5E]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#334155]">
                    Phone Number (Security & 2FA)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="tel"
                      id="profile-phone-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:border-[#659B5E] focus:ring-2 focus:ring-[#659B5E]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Job Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#334155]">
                    Professional Title / Role
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      id="profile-jobtitle-input"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Managing Partner"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:border-[#659B5E] focus:ring-2 focus:ring-[#659B5E]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#334155]">
                    Company / Firm
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      id="profile-company-input"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Novapioneer Ventures"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:border-[#659B5E] focus:ring-2 focus:ring-[#659B5E]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#334155]">
                    Location / Residency
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      id="profile-location-input"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Nairobi, Kenya or London, UK"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:border-[#659B5E] focus:ring-2 focus:ring-[#659B5E]/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Bio / Executive Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#334155]">
                  Bio / Account Statement
                </label>
                <textarea
                  id="profile-bio-input"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short note about your treasury focus or investment objectives..."
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:border-[#659B5E] focus:ring-2 focus:ring-[#659B5E]/20 transition-all resize-none"
                />
              </div>

              {/* Currency Preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#334155] flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#659B5E]" />
                  Primary Reporting Currency
                </label>
                <select
                  id="profile-currency-select"
                  value={currencyPreference}
                  onChange={(e) => setCurrencyPreference(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#1E293B] focus:outline-hidden focus:border-[#659B5E] transition-all cursor-pointer"
                >
                  <option value="USD">USD - United States Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound Sterling (£)</option>
                  <option value="KES">KES - Kenyan Shilling (KSh)</option>
                  <option value="CAD">CAD - Canadian Dollar (C$)</option>
                  <option value="AUD">AUD - Australian Dollar (A$)</option>
                  <option value="JPY">JPY - Japanese Yen (¥)</option>
                  <option value="CHF">CHF - Swiss Franc (CHF)</option>
                </select>
              </div>
            </div>

            {/* Security & Notification Preferences Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#659B5E]" />
                  Security & Communication Preferences
                </h3>
                <p className="text-xs text-[#64748B]">
                  Manage verification standards and alert thresholds for your Finova account
                </p>
              </div>

              <div className="space-y-4">
                {/* 2FA Toggle */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E8F0EA] text-[#41603B] flex items-center justify-center shrink-0 mt-0.5">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-[#1E293B]">
                        Two-Factor Authentication (2FA)
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Require an authenticated SMS or passkey code on new device sign-ins
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      id="profile-2fa-toggle"
                      checked={twoFactorEnabled}
                      onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#659B5E]" />
                  </label>
                </div>

                {/* Email Notifications */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E8F0EA] text-[#41603B] flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-[#1E293B]">
                        Monthly Statements & Wealth Digest
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Receive monthly consolidated balance sheets and yield reports via email
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      id="profile-email-notif-toggle"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#659B5E]" />
                  </label>
                </div>

                {/* SMS Alerts */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E8F0EA] text-[#41603B] flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-[#1E293B]">
                        Real-Time SMS Transaction Alerts
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        Instant push SMS notification on transactions exceeding $500.00
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      id="profile-sms-notif-toggle"
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#659B5E]" />
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Save Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigateTab('dashboard')}
                className="px-6 py-3 rounded-2xl bg-white border border-[#CBD5E1] text-[#334155] font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors shadow-2xs"
              >
                Discard Changes
              </button>

              <button
                type="submit"
                id="save-profile-bottom-btn"
                disabled={isSaving}
                className="px-8 py-3 rounded-2xl bg-[#659B5E] hover:bg-[#52824c] text-white font-semibold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synchronizing Profile...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save All Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Interactive Circular Cropper Modal */}
      <AvatarCropperModal
        isOpen={isCropperOpen}
        onClose={() => {
          setIsCropperOpen(false);
          setSelectedFileForCropping(null);
        }}
        initialImageFile={selectedFileForCropping}
        onSaveCroppedImage={handleSaveCroppedImage}
      />
    </div>
  );
};
