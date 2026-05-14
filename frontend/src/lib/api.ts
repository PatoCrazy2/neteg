import { CreateEventRequest, Event } from "@/types/event";
import { AuthResponse } from "@/types/auth";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "An error occurred");
  }
  return response.json();
}

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const authApi = {
  register: async (data: any): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  login: async (data: any): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  googleLogin: async (data: { idToken: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },
};

export const eventApi = {
  getMyEvents: async (): Promise<Event[]> => {
    const response = await fetch(`${API_URL}/api/events/me`, {
      headers: getHeaders(),
    });
    return handleResponse<Event[]>(response);
  },

  createEvent: async (data: CreateEventRequest): Promise<Event> => {
    const response = await fetch(`${API_URL}/api/events`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Event>(response);
  },
};

// Helper to get stored token
export const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;

// Helper to set stored token
export const setToken = (token: string) => localStorage.setItem("token", token);

// Helper to remove stored token
export const removeToken = () => localStorage.removeItem("token");
