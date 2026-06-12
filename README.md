# SYTU - Professional Portfolio & Networking Dashboard

SYTU is a modern, responsive, and purely frontend-driven web application designed to act as a professional portfolio, resume, and networking dashboard. 

The application utilizes a dark-mode "glassmorphism" aesthetic and relies entirely on HTML, CSS, and Vanilla JavaScript. It simulates a complete backend environment (authentication, data persistence, and profile management) using the browser's `localStorage` and `sessionStorage` APIs.

## 🚀 Features

### 1. Robust Authentication Flow
- **Signup:** Users can create an account. Data is securely formatted and temporarily stored in session.
- **OTP Verification:** Simulates an email OTP flow. A mock 6-digit code is generated and displayed on-screen for the user to copy and verify before the account is finalized.
- **Login:** Secure session creation validated against stored local data.
- **Forgot Password:** Complete recovery flow connecting Email Lookup -> Send OTP -> Verify OTP -> Reset Password.
- **Persistent Sessions:** Sessions remain active across page reloads until the user explicitly signs out.
- **Protected Routes:** Users cannot access the Dashboard or Edit Profile pages without an active session.

### 2. Dynamic Profile Dashboard (`profile.html`)
- Displays real-time data for the currently authenticated user.
- **Smart Placeholders:** Automatically handles states where a user has not uploaded an avatar, cover photo, or added skills/projects.
- **Visuals:** Renders custom Base64 encoded Profile Pictures and Cover Banners.

### 3. Advanced Profile Editor (`edit-profile.html`)
- Structured as a professional 3-tab dashboard (General Info, Skills & Projects, Security) using smooth, JavaScript-driven tab switching without page reloads.
- **General Info:**
  - Update Full Name, Username, Location, and Bio.
  - **Dynamic Image Uploads:** Integrated `FileReader` API allows users to upload local image files (JPG, PNG, WEBP), immediately preview them, encode them to Base64, and save them persistently.
- **Skills & Projects:**
  - dynamically add comma-separated skills and interests.
  - Interactive "+ Add Project" interface allowing users to dynamically build out an array of portfolio projects (Title, Description, Tech Stack) or remove them at will.
- **Security:**
  - Dedicated tab to securely change passwords with active validation against the current stored password.

## 🛠 Technologies Used

- **HTML5:** Semantic and accessible structure.
- **CSS3:** Custom styling utilizing CSS Variables, Flexbox, CSS Grid, and Glassmorphism effects (backdrop-filter). No external CSS frameworks (like Bootstrap or Tailwind) were used.
- **Vanilla JavaScript (ES6+):** Complete logic handling, DOM manipulation, event listening, and state management.
- **Web Storage API:** Extensive use of `localStorage` for permanent user records and `sessionStorage` for temporary states (like OTP verification phases).

## 📥 Local Setup & Installation

Since SYTU is a pure frontend application, no backend server or build steps (like Webpack or Node.js) are required to run it!

1. **Clone or Download the Repository:**
   Download the folder containing the project files to your local machine.

2. **Run the Application:**
   Simply double-click the `index.html` (or `signup.html`) file to open it directly in any modern web browser (Chrome, Firefox, Safari, Edge).
   
   *(Optional)* If you prefer, you can serve it via a simple local server like VS Code's "Live Server" extension for a better development experience.

3. **Testing the App:**
   - Create a new account on the Signup page.
   - You will be redirected to the OTP page. Look at the text at the top of the screen to find your **Demo OTP** code.
   - Enter the code to verify.
   - Start editing your profile!

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
└── script.js              # Core application logic and Web Storage management
```

## 📝 Notes on Data Persistence

Because this application does not use a database, all data is stored inside your browser. 
- If you clear your browser's history/cache/local storage, your user data and uploaded images will be deleted.
- Data does not sync across different browsers or devices (e.g., an account created in Chrome will not be accessible in Firefox).