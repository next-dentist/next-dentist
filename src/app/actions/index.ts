"use server";

export async function uploadImage(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Need to use absolute URLs in server actions
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    const res = await fetch(`${origin}/api/upload`, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Upload failed with status:", res.status);
      return null;
    }

    const data = await res.json();

    if (data.success) {
      return data.url;
    }

    return null;
  } catch (error) {
    console.error("Error in uploadImage:", error);
    return null;
  }
}
