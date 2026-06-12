import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    GithubAuthProvider 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// TODO: Replace this with your own Firebase Configuration
// Go to https://console.firebase.google.com/ to create a project,
// add a web app, and copy the firebaseConfig object here.
const firebaseConfig = {
  apiKey: "AIzaSyDvs62tSdUqrysq3c88HWnun7zOt_D0aHs",
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

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

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
            github: providerId === 'github.com' ? `https://github.com/${firebaseUser.reloadUserInfo.screenName || ''}` : '',
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

    window.location.href = 'profile.html';
};

const handleLogin = async (provider) => {
    try {
        const result = await signInWithPopup(auth, provider);
        syncUserToLocalStorage(result.user, result.providerId);
    } catch (error) {
        console.error("Authentication Error:", error);
        alert(`Authentication failed: ${error.message}`);
    }
};

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
