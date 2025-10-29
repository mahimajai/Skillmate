export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  rating: number;
  completedExchanges: number;
  location: string;
  bio?: string;
  skills?: string[];
}

const AUTH_STORAGE_KEY = "skillmate_auth";
const USER_PROFILE_KEY = "skillmate_user_profile";

const defaultUserProfile: UserProfile = {
  name: "John Doe",
  email: "john@skillmate.com",
  avatar: "JD",
  rating: 4.9,
  completedExchanges: 42,
  location: "San Francisco, CA",
  bio: "Passionate learner and teacher. Love sharing knowledge and learning new skills!",
  skills: ["React.js", "UI/UX Design", "Photography"],
};

export const isLoggedIn = (): boolean => {
  try {
    const authState = localStorage.getItem(AUTH_STORAGE_KEY);
    return authState === "true";
  } catch {
    return false;
  }
};

export const loginUser = (email: string, password: string): boolean => {
  try {
    if (email && password) {
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      const existing = localStorage.getItem(USER_PROFILE_KEY);
      if (!existing) localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(defaultUserProfile));
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const logoutUser = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {}
};

export const getUserProfile = (): UserProfile | null => {
  try {
    if (!isLoggedIn()) return null;
    const profile = localStorage.getItem(USER_PROFILE_KEY);
    return profile ? JSON.parse(profile) : defaultUserProfile;
  } catch {
    return null;
  }
};

export const updateUserProfile = (updates: Partial<UserProfile>): void => {
  try {
    if (!isLoggedIn()) return;
    const current = getUserProfile() || defaultUserProfile;
    const next = { ...current, ...updates };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(next));
  } catch {}
};

export const registerUser = (name: string, email: string, password: string): boolean => {
  try {
    if (name && email && password) {
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      const userProfile: UserProfile = {
        ...defaultUserProfile,
        name,
        email,
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const getInitials = (name: string): string => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
