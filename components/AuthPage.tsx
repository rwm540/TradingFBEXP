import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface AuthPageProps {
    onLogin: (identifier: string, password: string) => { success: boolean, message: string };
    onRegister: (username: string, email: string, password: string) => { success: boolean, message: string };
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
    // Login state
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register state
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            let result;
            if (isLoginView) {
                result = onLogin(loginIdentifier, loginPassword);
            } else {
                result = onRegister(registerUsername, registerEmail, registerPassword);
            }

            if (!result.success) {
                setError(result.message);
            }
            // On success, the App component will handle the state change and unmount this page.
            setIsLoading(false);
        }, 1000);
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError('');
    };

    const renderLoginForm = () => (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-300">
                    Username or Email
                </label>
                <div className="mt-1">
                    <input
                        id="identifier"
                        name="identifier"
                        type="text"
                        autoComplete="username"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800 text-white"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password-login" className="block text-sm font-medium text-gray-300">
                    Password
                </label>
                <div className="mt-1">
                    <input
                        id="password-login"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800 text-white"
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-colors"
                >
                    Sign in
                </button>
            </div>
        </form>
    );

    const renderRegisterForm = () => (
        <form onSubmit={handleSubmit} className="space-y-6">
             <div>
                <label htmlFor="username-register" className="block text-sm font-medium text-gray-300">
                    Username
                </label>
                <div className="mt-1">
                    <input
                        id="username-register"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800 text-white"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="email-register" className="block text-sm font-medium text-gray-300">
                    Email address
                </label>
                <div className="mt-1">
                    <input
                        id="email-register"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800 text-white"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password-register" className="block text-sm font-medium text-gray-300">
                    Password
                </label>
                <div className="mt-1">
                    <input
                        id="password-register"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800 text-white"
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 transition-colors"
                >
                    Create Account
                </button>
            </div>
        </form>
    );

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <LoadingSpinner isOpen={isLoading} />
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-4xl font-extrabold text-white">FBEXP</h1>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    {isLoginView ? 'Sign in to your account' : 'Create a new account'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    Or{' '}
                    <button onClick={toggleView} className="font-medium text-blue-500 hover:text-blue-400">
                        {isLoginView ? 'create an account' : 'sign in to your account'}
                    </button>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[#161B22] py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-700">
                    {error && (
                        <div className="mb-4 rounded-md bg-red-900/50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-300">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {isLoginView ? renderLoginForm() : renderRegisterForm()}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
