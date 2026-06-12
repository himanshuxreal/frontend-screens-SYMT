# SYTU - Professional Portfolio & Networking Dashboard

SYTU is a modern, responsive web application designed to act as a professional portfolio, resume, and networking dashboard. 

The application utilizes a dark-mode "glassmorphism" aesthetic built with HTML, CSS, and Vanilla JavaScript. It leverages Firebase Authentication for seamless OAuth login and uses the browser's `localStorage` and `sessionStorage` APIs for data persistence and profile management.

## 🚀 Features

### 1. Robust Authentication Flow
- **OAuth Integration:** Secure sign-in via **Google** and **GitHub** using Firebase Authentication. User profiles are seamlessly synced to local storage.
- **Signup:** Users can also manually create an account. Data is securely formatted and temporarily stored in session.
- **OTP Verification:** Simulates an email OTP flow for manual signups. A mock 6-digit code is generated and displayed on-screen for the user to copy and verify.
- **Login:** Secure session creation validated against stored local data or Firebase OAuth.
- **Forgot Password:** Complete recovery flow connecting Email Lookup -> Send OTP -> Verify OTP -> Reset Password.
- **Persistent Sessions:** Sessions remain active across page reloads until the user explicitly signs out.
- **Protected Routes:** Users cannot access the Dashboard or Edit Profile pages without an active session.

### 2. Dynamic Profile Dashboard (`profile.html`)
- Displays real-time data for the currently authenticated user.
- **Smart Placeholders:** Automatically handles states where a user has not uploaded an avatar, cover photo, or added skills/projects.
- **Visuals:** Renders custom Base64 encoded Profile Pictures and Cover Banners or loads OAuth provider avatars.

### 3. Advanced Profile Editor (`edit-profile.html`)
- Structured as a professional 3-tab dashboard (General Info, Skills & Projects, Security) using smooth, JavaScript-driven tab switching without page reloads.
- **General Info:**
  - Update Full Name, Username, Location, and Bio.
  - **Dynamic Image Uploads:** Integrated `FileReader` API allows users to upload local image files (JPG, PNG, WEBP), immediately preview them, encode them to Base64, and save them persistently.
- **Skills & Projects:**
  - Dynamically add comma-separated skills and interests.
  - Interactive "+ Add Project" interface allowing users to dynamically build out an array of portfolio projects (Title, Description, Tech Stack) or remove them at will.
- **Security:**
  - Dedicated tab to securely change passwords with active validation against the current stored password.

## 🛠 Technologies Used

- **HTML5:** Semantic and accessible structure.
- **CSS3:** Custom styling utilizing CSS Variables, Flexbox, CSS Grid, and Glassmorphism effects (backdrop-filter). No external CSS frameworks were used.
- **Vanilla JavaScript (ES6+):** Complete logic handling, DOM manipulation, event listening, and state management.
- **Firebase Auth (v10):** Integrated for Google and GitHub third-party logins.
- **Web Storage API:** Extensive use of `localStorage` for permanent user records and `sessionStorage` for temporary states.

## 📥 Local Setup & Installation

1. **Clone or Download the Repository:**
   Download the folder containing the project files to your local machine.

2. **Configure Firebase Authentication:**
   To enable Google and GitHub login, create a `config.js` file in the root directory and add your Firebase API Key:
   ```javascript
   export const FIREBASE_API_KEY = "your_firebase_api_key_here";
   ```

3. **Run the Application:**
   Because the project uses ES6 Modules (for Firebase), you **must** serve the files using a local web server (e.g., VS Code's "Live Server" extension, Python's `http.server`, or Node's `http-server`). Opening the HTML files directly via `file://` will cause CORS/Module errors.

4. **Testing the App:**
   - Sign in using Google/GitHub, or create a new account manually.
   - For manual signup, check the top of the OTP screen for your **Demo OTP** code.
   - Enter the code to verify.
   - Start editing your profile!

## 🚀 Deployment & CI/CD

SYTU is configured for automatic deployment to **Vercel** via GitHub Actions. 
- The deployment pipeline is defined in `.github/workflows/vercel-deploy.yml`.
- Pushes to the `main` branch trigger an automatic build and deployment, ensuring your live site is always up to date.

## 📂 File Structure

```text
├── index.html             # User login page
├── signup.html            # New user registration
├── otp.html               # OTP verification screen
├── forgot-password.html   # Password recovery initiation
├── reset-password.html    # Password reset form
├── profile.html           # Main user dashboard/portfolio
├── edit-profile.html      # 3-tab dashboard for updating user data
├── style.css              # Global styles, layout, and theme
├── script.js              # Core application logic and Web Storage management
├── auth.js                # Firebase OAuth implementation
├── config.js              # Environment configuration for Firebase (Ignored in Git)
└── .github/workflows/     # CI/CD deployment configuration (Vercel)
```

## 📝 Notes on Data Persistence

Because this application does not use a backend database for manual users, most profile data is stored inside your browser. 
- If you clear your browser's history/cache/local storage, your user data and uploaded images will be deleted.
- Data does not sync across different browsers or devices (e.g., an account created in Chrome will not be accessible in Firefox).
