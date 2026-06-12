import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    GithubAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { FIREBASE_API_KEY } from "./config.js";

// Firebase Configuration provided by the user
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "symt-1d32d.firebaseapp.com",
  projectId: "symt-1d32d",
  storageBucket: "symt-1d32d.firebasestorage.app",
  messagingSenderId: "1014355570541",
  appId: "1:1014355570541:web:837dc17a3391828070f464",
  measurementId: "G-1BEV0EFYQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ----------------------------------------------------
// Configure Authentication Providers (Firebase v10)
// ----------------------------------------------------

// Google Provider Setup
const googleProvider = new GoogleAuthProvider();
// Recommended: Force account selection prompt to prevent sticky errors
googleProvider.setCustomParameters({
    prompt: 'select_account'
});
// Request standard profile and email scopes
googleProvider.addScope('profile');
googleProvider.addScope('email');

// GitHub Provider Setup
const githubProvider = new GithubAuthProvider();

// ----------------------------------------------------
// Core Login & Sync Logic
// ----------------------------------------------------

const syncUserToLocalStorage = (firebaseUser, providerId) => {
    const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
    const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
    const setCurrentUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user));

    const users = getUsers();
    let existingUser = users.find(u => u.email === firebaseUser.email);

    if (existingUser) {
        setCurrentUser(existingUser);
    } else {
        const nameParts = (firebaseUser.displayName || 'New User').split(' ');
        const fname = nameParts[0] || '';
        const lname = nameParts.slice(1).join(' ') || '';

        const newUser = {
            id: firebaseUser.uid,
            fname,
            lname,
            email: firebaseUser.email,
            password: 'OAUTH_USER', // Not used for OAuth
            role: 'professional', // Default role
            username: (fname + lname).toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000),
            bio: `Hi, I joined via ${providerId}.`,
            location: 'Not specified',
            github: providerId === 'github.com' ? `https://github.com/${firebaseUser.reloadUserInfo?.screenName || ''}` : '',
            linkedin: '',
            website: '',
            joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            avatar: firebaseUser.photoURL || '',
            skills: [],
            projects: []
        };

        users.push(newUser);
        saveUsers(users);
        setCurrentUser(newUser);
    }

    // Redirect to profile after successful sync
    window.location.href = 'profile.html';
};

const handleLogin = async (provider) => {
    try {
        console.log(`[Firebase Auth] Starting authentication flow for ${provider.providerId}...`);
        
        // Ensure standard Web implementation for Google/GitHub
        const result = await signInWithPopup(auth, provider);
        
        // Extract token if needed (for debugging or API calls)
        let token = null;
        if (provider.providerId === 'google.com') {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            token = credential?.accessToken;
        } else if (provider.providerId === 'github.com') {
            const credential = GithubAuthProvider.credentialFromResult(result);
            token = credential?.accessToken;
        }

        const user = result.user;
        console.log("[Firebase Auth] Authentication successful!", { 
            uid: user.uid, 
            email: user.email, 
            tokenExists: !!token 
        });
        
        syncUserToLocalStorage(user, result.providerId);

    } catch (error) {
        // Comprehensive Error Handling required for debugging misconfigurations
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email;
        
        let credential = null;
        try {
            if (provider.providerId === 'google.com') {
                credential = GoogleAuthProvider.credentialFromError(error);
            } else if (provider.providerId === 'github.com') {
                credential = GithubAuthProvider.credentialFromError(error);
            }
        } catch (credError) {
            console.warn("Could not extract credential from error:", credError);
        }

        console.error("[Firebase Auth] Critical Error:", {
            code: errorCode,
            message: errorMessage,
            failedEmail: email,
            credentialDetails: credential,
            fullErrorObject: error
        });
        
        // Provide user-friendly feedback
        if (errorCode === 'auth/popup-closed-by-user') {
            alert("Sign-in was cancelled. Please try again.");
        } else if (errorCode === 'auth/unauthorized-domain') {
            alert(`Configuration Error: This domain is not authorized for OAuth operations in your Firebase project. Please add ${window.location.hostname} in the Firebase Console under Authentication -> Settings -> Authorized domains.`);
        } else if (errorCode === 'auth/operation-not-supported-in-this-environment') {
            alert("Firebase Error: This operation is not supported in the current environment (e.g. running from file://). Please use a local web server (like Live Server).");
        } else {
            alert(`Authentication failed: ${errorMessage}\n(Error Code: ${errorCode})`);
        }
    }
};

// ----------------------------------------------------
// Event Listeners
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const btnGoogle = document.getElementById('btn-google');
    const btnGithub = document.getElementById('btn-github');

    if (btnGoogle) {
        btnGoogle.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogin(googleProvider);
        });
    }

    if (btnGithub) {
        btnGithub.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogin(githubProvider);
        });
    }
});