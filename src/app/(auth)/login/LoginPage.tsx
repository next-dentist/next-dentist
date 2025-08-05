'use client';

import { WhiteRoundedBox } from '@/components/WhiteRoundedBox';
import { CheckCircle, Mail, MessageCircle, Shield } from 'lucide-react';
import { useState } from 'react';
import Login from './Login';
import LoginWithWhatsApp from './LoginWithWhatsApp';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email'>('whatsapp');

  return (
    <div className="min-h-screen bg-gray-50 px-2 py-4 sm:px-4 sm:py-8">
      <div className="container mx-auto max-w-4xl">
        <WhiteRoundedBox className="p-3 sm:p-6">
          {/* Tab Navigation */}
          <div className="mb-6 flex border-b border-gray-200 sm:mb-8">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex-1 border-b-2 px-2 pb-3 text-center font-medium transition-all duration-200 sm:px-6 sm:pb-4 ${
                activeTab === 'whatsapp'
                  ? 'border-green-500 bg-green-50/50 text-green-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">WhatsApp</span>
                <span className="hidden text-xs sm:inline">Login</span>
                <span className="hidden rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 sm:ml-2 sm:inline">
                  Quick & Easy
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 border-b-2 px-2 pb-3 text-center font-medium transition-all duration-200 sm:px-6 sm:pb-4 ${
                activeTab === 'email'
                  ? 'border-primary text-primary bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Email</span>
                <span className="hidden text-xs sm:inline">Login</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px] sm:min-h-[500px]">
            {activeTab === 'whatsapp' ? (
              <div className="space-y-4 sm:space-y-6">
                {/* WhatsApp Login Form */}
                <LoginWithWhatsApp />
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Email Login Form */}
                <Login />
              </div>
            )}
          </div>
        </WhiteRoundedBox>

        {/* Additional Info Section */}
        <div className="mt-4 text-center sm:mt-8">
          <WhiteRoundedBox className="mx-auto max-w-3xl p-3 sm:p-6">
            <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4 sm:gap-3">
              <Shield className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
              <h3 className="text-base font-semibold sm:text-lg">
                Secure & Trusted Login
              </h3>
            </div>
            <div className="grid gap-4 text-sm text-gray-600 sm:gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-50 p-2 sm:mb-3 sm:h-12 sm:w-12 sm:p-3">
                  <MessageCircle className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
                </div>
                <p className="text-xs sm:text-sm">
                  <strong>WhatsApp Login:</strong> Fast & secure verification
                  through your WhatsApp number
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 p-2 sm:mb-3 sm:h-12 sm:w-12 sm:p-3">
                  <Shield className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                </div>
                <p className="text-xs sm:text-sm">
                  <strong>Data Protection:</strong> Your personal information is
                  encrypted and secure
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 p-2 sm:mb-3 sm:h-12 sm:w-12 sm:p-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />
                </div>
                <p className="text-xs sm:text-sm">
                  <strong>Instant Access:</strong> Get started immediately after
                  verification
                </p>
              </div>
            </div>
          </WhiteRoundedBox>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500 sm:mt-8 sm:text-sm">
          <p>
            Don't have an account?{' '}
            <a
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
