const VERIFY_KEY = "jobton.auth.verify";
const RESET_KEY = "jobton.auth.reset";

interface VerificationState {
  email: string;
  code: string;
  expiresAt: number;
}

interface ResetState {
  email: string;
  token: string;
  expiresAt: number;
}

const safeRead = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const safeWrite = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const authEmailFlowStorage = {
  saveVerificationCode: (email: string, code: string, ttlMinutes = 20) => {
    const state: VerificationState = {
      email,
      code,
      expiresAt: Date.now() + ttlMinutes * 60 * 1000,
    };

    safeWrite(VERIFY_KEY, state);
  },

  verifyCode: (email: string, code: string) => {
    const state = safeRead<VerificationState>(VERIFY_KEY);

    if (!state) return false;
    if (state.expiresAt < Date.now()) return false;

    const isMatch =
      state.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      state.code.trim() === code.trim();

    if (isMatch) {
      localStorage.removeItem(VERIFY_KEY);
    }

    return isMatch;
  },

  saveResetToken: (email: string, token: string, ttlMinutes = 30) => {
    const state: ResetState = {
      email,
      token,
      expiresAt: Date.now() + ttlMinutes * 60 * 1000,
    };

    safeWrite(RESET_KEY, state);
  },

  resolveResetToken: (token: string) => {
    const state = safeRead<ResetState>(RESET_KEY);

    if (!state) return null;
    if (state.expiresAt < Date.now()) return null;
    if (state.token !== token) return null;

    return state.email;
  },

  consumeResetToken: () => {
    localStorage.removeItem(RESET_KEY);
  },
};
