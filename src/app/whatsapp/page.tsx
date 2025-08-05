'use client';

import { sendWhatsAppMessage } from '@/lib/utils';

export default function WhatsAppToolPage() {
  const handleSendMessage = async () => {
    // In a real application, you would get the number dynamically,
    // e.g., from a form input or a contact list.
    // For this example, we use a placeholder.+91 98982 81989
    const phoneNumber = '+919979202955'; // Replace with a valid test number

    try {
      const data = await sendWhatsAppMessage(phoneNumber);
      alert(`Message sent to ${phoneNumber}! Check console for details.`);
    } catch (error) {
      alert('Failed to send message. Check console for errors.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        WhatsApp Messaging Tool
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        Click the button below to send a test WhatsApp message using the
        configured template.
      </p>
      <button
        onClick={handleSendMessage}
        className="rounded-md bg-green-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
      >
        Send WhatsApp Test Message
      </button>
      <p className="mt-4 text-sm text-gray-500">
        (Sends to a hardcoded test number for demonstration purposes)
      </p>
    </div>
  );
}
