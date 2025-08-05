import { currencyConfig } from "@/config";
import { compare, hash } from "bcryptjs";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// For combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Hash password with bcrypt
export async function saltAndHashPassword(password: string): Promise<string> {
  return await hash(password, 10); // Use a fixed salt rounds value instead of env variable
}

// Verify password with bcrypt's compare
export async function verifyPassword(
  inputPassword: string,
  storedPassword: string
): Promise<boolean> {
  return await compare(inputPassword, storedPassword);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export function formatDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-IN", options);
}

export function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Check if the cleaned number is a valid 10-digit number
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }

  return phoneNumber;
}

/**
 * Formats a time string (e.g., "09:00", "14:30") into AM/PM format (e.g., "9:00 AM", "2:30 PM").
 * Returns the original string if formatting fails.
 */
export function formatTime(timeString: string | null | undefined): string {
  if (!timeString) return "N/A"; // Or return empty string, or handle as needed

  const parts = timeString.split(":");
  if (parts.length !== 2) return timeString; // Invalid format

  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes)) return timeString; // Invalid numbers

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();

  return `${hours}:${minutesStr} ${ampm}`;
}

// export const deepseekClient = axios.create({
//   baseURL: process.env.DEEPSEEK_API_URL,
//   headers: {
//     Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
//     "Content-Type": "application/json",
//   },
// });

// export async function generateText(prompt: string, options: any) {
//   try {
//     const response = await deepseekClient.post("/completions", {
//       model: process.env.DEEPSEEK_MODEL || "deepseek-coder",
//       prompt,
//       max_tokens: options.maxTokens || 1000,
//       temperature: options.temperature || 0.7,
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error generating text with DeepSeek:", error);
//     throw error;
//   }
// }

// // Initialize the OpenAI compatible client with DeepSeek's API
// const deepseekClient = new OpenAI({
//   baseURL: process.env.DEEPSEEK_API_URL,
//   apiKey: process.env.DEEPSEEK_API_KEY, // Fallback to empty string if not set
// });

// export default deepseekClient;


// filed slug automaticaly in lower case and add "-" instead of space from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}


// utils/currency.ts

type Parsed =
  | { isRange: false; value: number }
  | { isRange: true; min: number; max: number };

export const parseCost = (raw: string): Parsed | null => {
  if (!raw?.trim()) return null;

  // 1. Remove every character that isn’t a digit, comma, dot, dash/en-dash/em-dash or white-space.
  //    This gets rid of “₹”, “$”, “€”, “INR”, etc.
  const cleaned = raw.replace(/[^\d.,\s\-–—]/g, '');

  // 2. Detect a range (works no matter which dash the user types).
  const range = /([\d,.\s]+)\s*[-–—]\s*([\d,.\s]+)/.exec(cleaned);
  if (range) {
    const [, lo, hi] = range;
    const min = parseFloat(lo.replace(/[^\d.]/g, ''));
    const max = parseFloat(hi.replace(/[^\d.]/g, ''));
    return { isRange: true, min, max };
  }

  // 3. Single value.
  const num = parseFloat(cleaned.replace(/[^\d.]/g, ''));
  return isNaN(num) ? null : { isRange: false, value: num };
};


export const formatCost = (val: number, code: string): string => {
  const sym = currencyConfig.list.find(c => c.id === code)?.symbol ?? code;
  return `${sym}${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

type CurrencyConfig = typeof currencyConfig;



export const convert = (parsed: Parsed, from: string, to: string): string => {
  const rate = currencyConfig.rates[to as keyof CurrencyConfig['rates']] / currencyConfig.rates[from as keyof CurrencyConfig['rates']];
  if (parsed.isRange)
    return `${formatCost(parsed.min * rate, to)} – ${formatCost(parsed.max * rate, to)}`;
  return formatCost(parsed.value * rate, to);
};




// utils/sendWhatsApp.ts

export async function sendWhatsAppMessage(to: string) {
  const res = await fetch('/api/whatsapp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to }),
  });

  const data = await res.json();
  return data;
}

// Send custom WhatsApp message
export async function sendCustomWhatsAppMessage(to: string, message: string) {
  const res = await fetch('/api/whatsapp/custom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, message }),
  });

  const data = await res.json();
  return data;
}


