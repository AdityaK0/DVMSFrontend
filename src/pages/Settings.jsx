import { useState } from 'react';
import ProfileForm from '../components/ProfileForm.jsx';
import PreferencesForm from '../components/PreferencesForm.jsx';
import { useAuthStore } from '../store/authStore';
import { useVendorStore } from '../store/vendorStore';
import CategoryList from '../components/CategoryList.jsx';

const Settings = () => {
  const user = useAuthStore((state) => state.user);
  const vendorProfile = useVendorStore((state) => state.vendorProfile);
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className='flex'>
        <div>
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600">Manage your account and preferences</p>
       </div>

       <div >
          <img src={vendorProfile.logo} alt="" />
       </div>
      </div> */}

      <div className='flex justify-between'>
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600">Manage your account and preferences</p>
      </div>

      <div>
        {vendorProfile.logo ? (
          <img
            src={vendorProfile.logo_url}
            alt="Vendor Logo"
            className="h-18 w-18 rounded-full object-cover bg-black   shadow-xl "
          />
        ) : (
          <p className="text-secondary-600">No logo available</p>
        )}
      </div>
    </div>


      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preferences'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            Categories
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && <ProfileForm user={user} vendorProfile={vendorProfile} />}
      {activeTab === 'preferences' && <PreferencesForm />}
      {activeTab === 'categories' && <CategoryList />}


    </div>
  );
};

export default Settings;
