import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider, 
  githubProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from './firebase';

export const authService = {
  doResetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },
  doLogin: async (credentials) => {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, token };
  },

  doSignup: async (userData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    await updateProfile(userCredential.user, { displayName: userData.name });
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, token };
  },

  doGoogleLogin: async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    return { user: result.user, token };
  },

  doGithubLogin: async () => {
    const result = await signInWithPopup(auth, githubProvider);
    const token = await result.user.getIdToken();
    return { user: result.user, token };
  },

  doLogout: async () => {
    await signOut(auth);
  }
};
