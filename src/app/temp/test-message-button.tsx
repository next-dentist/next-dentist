'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Test component to verify the message button flow
export default function TestMessageButton() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  // Sample dentist data for testing
  const testDentistData = {
    id: 'test-dentist-1',
    name: 'Dr. Test Dentist',
    userId: 'cm57dq5ct000214ykfmwprj9b', // Replace with actual dentist user ID
    speciality: 'General Dentist',
  };

  const handleTestMessageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('🧪 TEST: Message button clicked:', {
      authStatus,
      dentistUserId: testDentistData.userId,
      dentistName: testDentistData.name,
      sessionUserId: session?.user?.id,
    });

    if (authStatus !== 'authenticated') {
      console.log('🧪 TEST: User not authenticated');
      toast.error('Please login to send messages');
      router.push('/login');
      return;
    }

    if (!testDentistData.userId) {
      console.error('🧪 TEST: No userId found for dentist:', testDentistData);
      toast.error('Unable to message this dentist');
      return;
    }

    console.log(
      '🧪 TEST: Redirecting to chat with userId:',
      testDentistData.userId
    );
    const targetUrl = `/chat?user=${testDentistData.userId}`;
    console.log('🧪 TEST: Target URL:', targetUrl);

    // Redirect to chat with dentist's user ID
    router.push(targetUrl);
  };

  return (
    <div className="rounded-lg border bg-white p-8 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">Message Button Test</h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Auth Status:</h3>
          <p>{authStatus}</p>
        </div>

        <div>
          <h3 className="font-semibold">Current User:</h3>
          <p>{session?.user?.name || 'Not logged in'}</p>
          <p className="text-sm text-gray-600">
            {session?.user?.id || 'No ID'}
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Test Dentist Data:</h3>
          <pre className="rounded bg-gray-100 p-2 text-sm">
            {JSON.stringify(testDentistData, null, 2)}
          </pre>
        </div>

        <button
          onClick={handleTestMessageClick}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Test Message Button
        </button>

        <div className="text-sm text-gray-600">
          <p>
            Check the browser console for detailed logs when clicking the
            button.
          </p>
        </div>
      </div>
    </div>
  );
}
