import React, { useState, useRef, useEffect } from 'react';
import type { UserProfile } from '../types';

interface ProfilePageProps {
    userProfile: UserProfile;
    onUpdateProfile: (newProfile: UserProfile) => void;
    onChangePassword: (current: string, newPass: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, onUpdateProfile, onChangePassword }) => {
    const [username, setUsername] = useState(userProfile.username);
    const [firstName, setFirstName] = useState(userProfile.firstName);
    const [lastName, setLastName] = useState(userProfile.lastName);
    const [email, setEmail] = useState(userProfile.email);
    const [profilePicture, setProfilePicture] = useState<string | null>(userProfile.profilePicture);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync local state if props change (e.g., after loading from localStorage)
    useEffect(() => {
        setUsername(userProfile.username);
        setFirstName(userProfile.firstName);
        setLastName(userProfile.lastName);
        setEmail(userProfile.email);
        setProfilePicture(userProfile.profilePicture);
    }, [userProfile]);


    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        // Basic validation for file size (e.g., 2MB)
        if (file && file.size > 2 * 1024 * 1024) {
            alert('File is too large. Please select an image under 2MB.');
            return;
        }
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfilePicture(base64String);
                // Immediately update profile to save picture to localStorage
                onUpdateProfile({ ...userProfile, firstName, lastName, username, email, profilePicture: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        onUpdateProfile({ ...userProfile, username, firstName, lastName, email, profilePicture });
    };
    
    const handleChangePasswordClick = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match.');
            return;
        }
        onChangePassword(currentPassword, newPassword);
        // Clear fields after submission for security
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    // Reusable Card component for consistent styling
    const Card: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
        <div className="bg-[#161B22] p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-3">{title}</h3>
            {children}
        </div>
    );

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                <p className="text-gray-400 mt-1">Manage your account information and security.</p>
            </header>

            <Card title="Profile Picture">
                <div className="flex items-center space-x-6">
                    {profilePicture ? (
                        <img src={profilePicture} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-2 border-blue-500" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-4xl font-bold">
                             {(firstName || 'U').charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/png, image/jpeg"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Upload Photo
                        </button>
                        <p className="text-xs text-gray-500 mt-2">PNG or JPG. Max size 2MB.</p>
                    </div>
                </div>
            </Card>

            <Card title="Account Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white"
                        />
                    </div>
                     <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white"
                        />
                    </div>
                     <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white"
                        />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white"
                        />
                    </div>
                </div>
            </Card>

             <Card title="Change Password">
                <div className="space-y-4 max-w-sm">
                     <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                        <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white" />
                    </div>
                     <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                        <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white" />
                    </div>
                     <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white" />
                    </div>
                    <div className="flex justify-end pt-2">
                         <button onClick={handleChangePasswordClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Change Password
                        </button>
                    </div>
                </div>
            </Card>
            
            <div className="flex justify-end mt-2">
                <button
                    onClick={handleSaveChanges}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
                >
                    Save Profile Changes
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;