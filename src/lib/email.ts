// This file can be removed if you're using the MSG91 API route
// Instead of deleting, I'll provide a placeholder that directs to your API route

// You should consider removing this file if it's not needed,
// or updating it to use your MSG91 API

/**
 * This is a placeholder file.
 * The application uses an MSG91 API route at /api/send-email instead of this utility.
 */

export const sendEmail = async (payload: {
  to: string;
  subject: string;
  html: string;
}) => {
  // Redirect to your MSG91 API route
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: payload.to,
      subject: payload.subject,
      message: payload.html,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send email");
  }

  return { success: true };
};
