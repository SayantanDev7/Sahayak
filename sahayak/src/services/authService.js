export const authService = {
  doLogin: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          resolve({ user: { name: 'User', email: credentials.email }, token: 'mock-token-xyz' });
        } else {
          reject(new Error("Email or password missing"));
        }
      }, 1500); // simulate network latency
    });
  },

  doSignup: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userData.email && userData.password && userData.name) {
          resolve({ user: { name: userData.name, email: userData.email }, token: 'mock-token-xyz' });
        } else {
          reject(new Error("Missing required fields"));
        }
      }, 1500); // simulate network latency
    });
  }
};
