'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

/**
 * CookieBanner – shows a persistent consent banner at the bottom of the page.
 * Uses localStorage (`nd_cookie_consent`) to remember the visitor’s choice.
 * Place once in `app/layout.tsx` (or another root layout) so it renders on every route.
 */
export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // Show banner if no consent has been stored yet
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = localStorage.getItem('nd_cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const handleConsent = (decision: 'accepted' | 'declined') => {
    localStorage.setItem('nd_cookie_consent', decision);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg sm:p-6">
      <div className="mx-auto flex max-w-6xl flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <p className="flex-1 text-base text-gray-700 sm:text-sm">
          We use cookies to improve your experience, personalize content, and
          analyze site traffic. By clicking “Accept All,” you consent to our use
          of cookies.&nbsp;
          <Button
            variant="link"
            size="sm"
            onClick={() => setOpen(true)}
            className="p-0 font-medium text-[#356574]"
          >
            Learn More
          </Button>
        </p>
        <div className="flex-shrink-0 space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleConsent('declined')}
          >
            Decline
          </Button>
          <Button
            size="sm"
            className="bg-[#356574] text-white hover:bg-[#2d5562]"
            onClick={() => handleConsent('accepted')}
          >
            Accept All
          </Button>
        </div>
      </div>

      {/* Detailed cookie settings */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild />
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Cookie Settings</DialogTitle>
          </DialogHeader>
          <p className="text-base leading-relaxed text-gray-700">
            You can manage your cookie preferences below. For full details, see
            our{' '}
            <a href="/cookie-policy" className="font-medium text-[#356574]">
              Cookie Policy
            </a>
            .
          </p>
          <div className="mt-4 space-y-3">
            <Button
              disabled
              variant="secondary"
              className="w-full justify-between"
            >
              Essential Cookies <span className="text-xs">Always Active</span>
            </Button>
            <Button
              disabled
              variant="secondary"
              className="w-full justify-between"
            >
              Performance Cookies <span className="text-xs">Active</span>
            </Button>
            <Button
              disabled
              variant="secondary"
              className="w-full justify-between"
            >
              Functional Cookies <span className="text-xs">Active</span>
            </Button>
            <Button
              disabled
              variant="secondary"
              className="w-full justify-between"
            >
              Advertising Cookies <span className="text-xs">Active</span>
            </Button>
          </div>
          <div className="flex justify-end space-x-2 pt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleConsent('declined')}
            >
              Decline All
            </Button>
            <Button
              size="sm"
              className="bg-[#356574] text-white hover:bg-[#2d5562]"
              onClick={() => handleConsent('accepted')}
            >
              Accept All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CookieBanner;
