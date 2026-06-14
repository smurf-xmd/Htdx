export const ValidatorsUtil = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  isValidUsername: (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  getPasswordStrengthErrors: (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('Must be at least 8 characters');
    if (!/[a-z]/.test(password)) errors.push('Must contain a lowercase letter');
    if (!/[A-Z]/.test(password)) errors.push('Must contain an uppercase letter');
    if (!/\d/.test(password)) errors.push('Must contain a number');
    if (!/[@$!%*?&]/.test(password)) errors.push('Must contain a special character (@$!%*?&)');
    return errors;
  },
};
