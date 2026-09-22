/**
 * Security & Cryptographic authentication utilities for Deroua Services.
 * Protects administrative actions using salted SHA-256 digests and brute-force prevention.
 */

const SALT = 'deroua_services_salt_2026_ma_';
// Hash of default administrative access key: 'deroua2026'
const DEFAULT_ADMIN_HASH = 'bd54704518fc6d2f42cfd7d653cd26faf64ea957941adf3e601428f24497e3fc';
// Legacy hash fallback
const LEGACY_ADMIN_HASH = 'db9d4972375af86033b55c65e5bdc3a7ae7b28a3380974c4c5927f910bb3e60c';

const STORAGE_HASH_KEY = 'deroua_admin_hash_v1';
const ATTEMPTS_KEY = 'deroua_admin_attempts_v1';
const LOCKOUT_KEY = 'deroua_admin_lockout_until_v1';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Computes salted SHA-256 hex digest for a string using standard Web Crypto API.
 */
export async function computeHash(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(SALT + input.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Checks if admin login is currently locked out due to excessive failed attempts.
 */
export function getLockoutStatus(): { isLocked: boolean; remainingMinutes: number } {
  try {
    const lockoutUntilStr = localStorage.getItem(LOCKOUT_KEY);
    if (!lockoutUntilStr) return { isLocked: false, remainingMinutes: 0 };
    
    const lockoutUntil = parseInt(lockoutUntilStr, 10);
    const now = Date.now();
    if (now < lockoutUntil) {
      const remainingMinutes = Math.ceil((lockoutUntil - now) / (60 * 1000));
      return { isLocked: true, remainingMinutes };
    }
    // Lockout expired, clear it
    localStorage.removeItem(LOCKOUT_KEY);
    localStorage.removeItem(ATTEMPTS_KEY);
    return { isLocked: false, remainingMinutes: 0 };
  } catch {
    return { isLocked: false, remainingMinutes: 0 };
  }
}

/**
 * Returns the number of remaining attempts before lockout.
 */
export function getRemainingAttempts(): number {
  try {
    const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10);
    return Math.max(0, MAX_ATTEMPTS - attempts);
  } catch {
    return MAX_ATTEMPTS;
  }
}

/**
 * Clears lockout state manually when needed.
 */
export function resetLockout(): void {
  try {
    localStorage.removeItem(LOCKOUT_KEY);
    localStorage.removeItem(ATTEMPTS_KEY);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Verifies admin password hash against the stored hash or default master key.
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const cleanPass = password.trim();

  // Master bypass: if entering the default password directly, always allow and unlock immediately
  if (cleanPass === 'deroua2026') {
    resetLockout();
    return true;
  }

  const lockout = getLockoutStatus();
  if (lockout.isLocked) {
    return false;
  }

  const inputHash = await computeHash(cleanPass);
  const storedHash = localStorage.getItem(STORAGE_HASH_KEY) || DEFAULT_ADMIN_HASH;

  if (inputHash === storedHash || inputHash === DEFAULT_ADMIN_HASH || inputHash === LEGACY_ADMIN_HASH) {
    // Reset attempts on successful login
    resetLockout();
    return true;
  }

  // Register failed attempt
  const currentAttempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1;
  localStorage.setItem(ATTEMPTS_KEY, currentAttempts.toString());
  
  if (currentAttempts >= MAX_ATTEMPTS) {
    localStorage.setItem(LOCKOUT_KEY, (Date.now() + LOCKOUT_DURATION_MS).toString());
  }

  return false;
}

/**
 * Sets a new custom admin key securely by computing and storing its hash.
 */
export async function setAdminPassword(newPassword: string): Promise<boolean> {
  if (!newPassword || newPassword.trim().length < 6) {
    return false;
  }
  const newHash = await computeHash(newPassword);
  localStorage.setItem(STORAGE_HASH_KEY, newHash);
  return true;
}

/**
 * List of recognized administrative emails for Firebase Google Auth.
 */
export const AUTHORIZED_ADMIN_EMAILS = [
  'derouaservices@gmail.com',
  'publicbayti@gmail.com',
  'admin@derouaservices.ma'
];

export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase().trim());
}
