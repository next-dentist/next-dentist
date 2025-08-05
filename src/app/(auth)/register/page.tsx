'use client';

import { WhiteRoundedBox } from '@/components/WhiteRoundedBox';
import { CheckCircle, Mail, MessageCircle, Shield, Users } from 'lucide-react';
import { useState } from 'react';
import Register from './Register';
import RegisterWithQTP from './RegisterWithQTP';

export default function RegisterPage() {
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
                <span className="hidden text-xs sm:inline">Registration</span>
                <span className="hidden rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 sm:ml-2 sm:inline">
                  Recommended
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
                <span className="hidden text-xs sm:inline">Registration</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px] sm:min-h-[600px]">
            {activeTab === 'whatsapp' ? (
              <div className="space-y-4 sm:space-y-6">
                {/* WhatsApp Registration Form */}
                <RegisterWithQTP />
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Email Registration Form */}
                <Register />
              </div>
            )}
          </div>
        </WhiteRoundedBox>

        {/* Additional Info Section */}
        <div className="mt-4 text-center sm:mt-8">
          <WhiteRoundedBox className="mx-auto max-w-3xl p-3 sm:p-6">
            <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4 sm:gap-3">
              <Users className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
              <h3 className="text-base font-semibold sm:text-lg">
                Why Register with Us?
              </h3>
            </div>
            <div className="grid gap-4 text-sm text-gray-600 sm:gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 p-2 sm:mb-3 sm:h-12 sm:w-12 sm:p-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                </div>
                <p className="text-xs sm:text-sm">
                  <strong>Easy Booking:</strong> Book appointments with verified
                  dentists instantly
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-50 p-2 sm:mb-3 sm:h-12 sm:w-12 sm:p-3">
                  <Shield className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
                </div>
                <p className="text-xs sm:text-sm">
                  <strong>Secure & Private:</strong> Your data is protected with
                  enterprise-grade security
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 p-2 sm:mb-3 sm:h-12 sm:w-12 sm:p-3">
                  <Users className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />
                </div>
                <p className="text-xs sm:text-sm">
                  <strong>Trusted Network:</strong> Access to 500+ verified
                  dental professionals
                </p>
              </div>
            </div>
          </WhiteRoundedBox>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500 sm:mt-8 sm:text-sm">
          <p>
            Already have an account?{' '}
            <a
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
