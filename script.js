const DEFAULT_AVATAR = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a1a1aa'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

document.addEventListener('error', function(e) {
    const target = e.target;
    if (target && target.tagName && target.tagName.toLowerCase() === 'img') {
        if (!target.src.includes('data:image')) {
            target.src = DEFAULT_AVATAR;
            target.onerror = null;
        }
    }
}, true);

document.addEventListener('DOMContentLoaded', () => {
    // Local storage utilities
    const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];
    const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
    const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser'));
    const setCurrentUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user));
    const clearSession = () => {
        localStorage.removeItem('currentUser');
        sessionStorage.clear();
    };

    // Smooth transition
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // Logout
    const setupLogout = (id) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                clearSession();
                window.location.href = 'index.html';
            });
        }
    };
    setupLogout('logout-btn');
    setupLogout('edit-logout-btn');

    // Custom Select Dropdowns
    document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
        const select = wrapper.querySelector('.custom-select');
        const trigger = wrapper.querySelector('.custom-select-trigger span');
        const hiddenSelect = wrapper.querySelector('select');
        const options = wrapper.querySelectorAll('.custom-option');

        select.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Remove selected class from all
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                // Update text
                trigger.textContent = this.textContent;
                trigger.style.color = 'var(--text-main)';
                
                // Update hidden select
                hiddenSelect.value = this.dataset.value;
                hiddenSelect.dispatchEvent(new Event('change'));

                // Close dropdown
                select.classList.remove('open');
            });
        });
    });

    // Close all dropdowns when clicking outside
    window.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-select')) {
            document.querySelectorAll('.custom-select').forEach(select => {
                select.classList.remove('open');
            });
        }
    });

    // Page: Signup
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        // If already logged in, redirect to profile
        if (getCurrentUser()) {
            window.location.href = 'profile.html';
            return;
        }

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fname = document.getElementById('signup-fname').value.trim();
            const lname = document.getElementById('signup-lname').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            const role = document.getElementById('signup-role').value;
            const errorDiv = document.getElementById('signup-error');
            
            const users = getUsers();
            if (users.find(u => u.email === email)) {
                errorDiv.textContent = 'Email already exists. Please log in.';
                errorDiv.style.display = 'block';
                return;
            }
            
            const pendingUser = {
                id: Date.now().toString(),
                fname, lname, email, password, role,
                username: (fname + lname).toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000),
                bio: `Hi, I am a ${role}.`,
                location: 'Not specified',
                github: '',
                linkedin: '',
                website: '',
                joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                skills: [],
                projects: []
            };
            
            const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
            sessionStorage.setItem('pendingUser', JSON.stringify(pendingUser));
            sessionStorage.setItem('otp', mockOtp);
            sessionStorage.setItem('otpContext', 'signup');
            
            window.location.href = 'otp.html';
        });
    }

    // Page: Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // If already logged in, redirect to profile
        if (getCurrentUser()) {
            window.location.href = 'profile.html';
            return;
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('login-error');
            
            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                setCurrentUser(user);
                window.location.href = 'profile.html';
            } else {
                errorDiv.textContent = 'Invalid email or password.';
                errorDiv.style.display = 'block';
            }
        });
    }

    // Page: Forgot Password
    const forgotForm = document.getElementById('forgot-password-form');
    if (forgotForm) {
        if (getCurrentUser()) {
            window.location.href = 'profile.html';
            return;
        }

        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value.trim();
            const errorDiv = document.getElementById('forgot-error');
            
            const users = getUsers();
            const user = users.find(u => u.email === email);
            
            if (user) {
                const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
                sessionStorage.setItem('resetEmail', email);
                sessionStorage.setItem('otp', mockOtp);
                sessionStorage.setItem('otpContext', 'forgot');
                window.location.href = 'otp.html';
            } else {
                errorDiv.textContent = 'No account found with that email address.';
                errorDiv.style.display = 'block';
            }
        });
    }

    // Page: OTP
    const otpForm = document.getElementById('otp-form');
    if (otpForm) {
        const otpInputs = document.querySelectorAll('.otp-input');
        const displayDiv = document.getElementById('mock-otp-display');
        const errorDiv = document.getElementById('otp-error');
        const resendBtn = document.getElementById('resend-otp-btn');
        
        let storedOtp = sessionStorage.getItem('otp');
        const context = sessionStorage.getItem('otpContext');

        if (!context) {
            // No context, redirect to login
            window.location.href = 'index.html';
            return;
        }

        const showOtp = (otp) => {
            if (displayDiv) {
                displayDiv.textContent = `Demo OTP: ${otp} (Use this to verify)`;
            }
        };

        if (storedOtp) {
            showOtp(storedOtp);
        }

        // OTP Input navigation
        if (otpInputs.length > 0) {
            otpInputs[0].focus();
            otpInputs.forEach((input, index) => {
                input.addEventListener('input', (e) => {
                    input.value = input.value.replace(/[^0-9]/g, ''); // only allow numbers
                    if (input.value && index < otpInputs.length - 1) {
                        otpInputs[index + 1].focus();
                    }
                });
                
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && !input.value && index > 0) {
                        otpInputs[index - 1].focus();
                    }
                });

                input.addEventListener('paste', (e) => {
                    e.preventDefault();
                    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, otpInputs.length);
                    for (let i = 0; i < pastedData.length; i++) {
                        otpInputs[i].value = pastedData[i];
                        if (i < otpInputs.length - 1) otpInputs[i + 1].focus();
                    }
                });
            });
        }

        if (resendBtn) {
            resendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                storedOtp = Math.floor(100000 + Math.random() * 900000).toString();
                sessionStorage.setItem('otp', storedOtp);
                showOtp(storedOtp);
                errorDiv.style.display = 'none';
                otpInputs.forEach(input => input.value = '');
                otpInputs[0].focus();
            });
        }

        otpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredOtp = Array.from(otpInputs).map(input => input.value).join('');
            
            if (enteredOtp === storedOtp) {
                if (context === 'signup') {
                    const pendingUser = JSON.parse(sessionStorage.getItem('pendingUser'));
                    if (pendingUser) {
                        const users = getUsers();
                        users.push(pendingUser);
                        saveUsers(users);
                        setCurrentUser(pendingUser);
                        sessionStorage.removeItem('pendingUser');
                        sessionStorage.removeItem('otp');
                        sessionStorage.removeItem('otpContext');
                        window.location.href = 'profile.html';
                    } else {
                        window.location.href = 'signup.html';
                    }
                } else if (context === 'forgot') {
                    window.location.href = 'reset-password.html';
                }
            } else {
                errorDiv.textContent = 'Invalid OTP. Please try again.';
                errorDiv.style.display = 'block';
            }
        });
    }

    // Page: Reset Password
    const resetForm = document.getElementById('reset-password-form');
    if (resetForm) {
        const resetEmail = sessionStorage.getItem('resetEmail');
        const context = sessionStorage.getItem('otpContext');
        
        // Ensure user passed OTP verification for forgot password
        if (!resetEmail || context !== 'forgot') {
            window.location.href = 'index.html';
            return;
        }
        
        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = document.getElementById('reset-password').value;
            const confirmPass = document.getElementById('reset-confirm').value;
            const errorDiv = document.getElementById('reset-error');
            
            if (pass !== confirmPass) {
                errorDiv.textContent = 'Passwords do not match.';
                errorDiv.style.display = 'block';
                return;
            }
            
            const users = getUsers();
            const userIndex = users.findIndex(u => u.email === resetEmail);
            
            if (userIndex !== -1) {
                users[userIndex].password = pass;
                saveUsers(users);
                sessionStorage.removeItem('resetEmail');
                sessionStorage.removeItem('otp');
                sessionStorage.removeItem('otpContext');
                alert('Password reset successful! You can now log in.');
                window.location.href = 'index.html';
            } else {
                errorDiv.textContent = 'Error resetting password. Account not found.';
                errorDiv.style.display = 'block';
            }
        });
    }

    // Page: Profile
    if (window.location.pathname.endsWith('profile.html') || document.querySelector('.profile-container')) {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        const setElText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        setElText('profile-name', `${user.fname} ${user.lname}`);
        setElText('profile-username', `@${user.username}`);
        setElText('profile-role', user.role);
        setElText('profile-location', user.location || 'Not specified');
        setElText('profile-bio', user.bio || 'No bio available.');
        
        const defaultCover = "linear-gradient(45deg, rgba(124, 58, 237, 0.6), rgba(34, 211, 238, 0.4))";

        const navAvatar = document.getElementById('nav-avatar');
        if (navAvatar) navAvatar.src = user.avatar || DEFAULT_AVATAR;

        const mainAvatar = document.getElementById('main-profile-avatar');
        if (mainAvatar) mainAvatar.src = user.avatar || DEFAULT_AVATAR;

        const mainCover = document.getElementById('main-profile-cover');
        if (mainCover) mainCover.style.backgroundImage = user.cover ? `url(${user.cover})` : defaultCover;
        
        // Join Date
        const joinedDateEl = document.querySelector('.meta-item:nth-child(2)');
        if (joinedDateEl && user.joined) {
            joinedDateEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Joined ${user.joined}`;
        }
        
        // Social Links
        const updateLink = (id, url, prefix) => {
            const linkEl = document.getElementById(id);
            if (linkEl) {
                if (url) {
                    linkEl.href = url;
                    linkEl.style.display = 'flex';
                    const textEl = document.getElementById(`${id}-text`);
                    if (textEl) {
                        let displayUrl = url.replace(/^https?:\/\/(www\.)?/, '');
                        if (displayUrl.length > 20) displayUrl = displayUrl.substring(0, 20) + '...';
                        textEl.textContent = displayUrl;
                    }
                } else {
                    linkEl.style.display = 'none';
                }
            }
        };

        updateLink('profile-github', user.github, 'github.com/');
        updateLink('profile-linkedin', user.linkedin, 'linkedin.com/in/');
        updateLink('profile-website', user.website, '');

        // Render Skills
        const skillsContainer = document.getElementById('profile-skills');
        if (skillsContainer) {
            skillsContainer.innerHTML = '';
            if (user.skills && user.skills.length > 0) {
                user.skills.forEach(skill => {
                    const span = document.createElement('span');
                    span.className = 'skill-tag';
                    span.textContent = skill;
                    skillsContainer.appendChild(span);
                });
            } else {
                skillsContainer.innerHTML = '<span class="text-muted" style="font-size: 0.9rem; color: var(--text-muted);">No skills added yet.</span>';
            }
        }

        // Render Projects
        const projectsContainer = document.getElementById('profile-projects');
        if (projectsContainer) {
            projectsContainer.innerHTML = '';
            if (user.projects && user.projects.length > 0) {
                user.projects.forEach(proj => {
                    const card = document.createElement('div');
                    card.className = 'project-card';
                    card.innerHTML = `
                        <div class="project-content">
                            <h3 class="project-title">${proj.title}</h3>
                            <p class="project-desc">${proj.description}</p>
                            <div class="project-tech">
                                ${proj.tech ? proj.tech.split(',').map(t => `<span>${t.trim()}</span>`).join(' • ') : ''}
                            </div>
                        </div>
                    `;
                    projectsContainer.appendChild(card);
                });
            } else {
                projectsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 2rem;">No projects added yet.</p>';
            }
        }
    }

    // Page: Edit Profile
    if (document.querySelector('.edit-profile-layout')) {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        // --- Tab Navigation Logic ---
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        const tabTitle = document.getElementById('tab-title');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => {
                    c.classList.remove('active');
                    c.style.display = 'none';
                });
                
                // Add active class to clicked button and target content
                btn.classList.add('active');
                const targetId = btn.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                    targetContent.style.display = 'block';
                    
                    // Update Title
                    tabTitle.textContent = btn.textContent.trim();
                }
            });
        });

        // --- Form 1: General Info ---
        const generalForm = document.getElementById('edit-profile-form');
        if (generalForm) {
            document.getElementById('edit-fullname').value = `${user.fname} ${user.lname}`.trim();
            document.getElementById('edit-username').value = user.username || '';
            document.getElementById('edit-location').value = user.location || '';
            document.getElementById('edit-bio').value = user.bio || '';
            
            const defaultCover = "linear-gradient(45deg, rgba(124, 58, 237, 0.6), rgba(34, 211, 238, 0.4))";
            
            const editNavAvatar = document.getElementById('edit-nav-avatar');
            if (editNavAvatar) editNavAvatar.src = user.avatar || DEFAULT_AVATAR;

            const avatarPreview = document.getElementById('avatar-preview');
            if (avatarPreview) avatarPreview.src = user.avatar || DEFAULT_AVATAR;

            const coverPreview = document.getElementById('cover-preview');
            if (coverPreview) coverPreview.style.backgroundImage = user.cover ? `url(${user.cover})` : defaultCover;

            const handleImageUpload = (inputId, btnId, previewId, isBackground = false) => {
                const input = document.getElementById(inputId);
                const btn = document.getElementById(btnId);
                const preview = document.getElementById(previewId);
                
                if (!input || !btn || !preview) return;

                btn.addEventListener('click', () => input.click());

                input.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
                    if (!validTypes.includes(file.type)) {
                        alert('Please upload a valid image file (JPG, PNG, WEBP).');
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64Str = event.target.result;
                        input.setAttribute('data-base64', base64Str);
                        if (isBackground) {
                            preview.style.backgroundImage = `url(${base64Str})`;
                        } else {
                            preview.src = base64Str;
                        }
                    };
                    reader.readAsDataURL(file);
                });
            };

            handleImageUpload('avatar-input', 'change-avatar-btn', 'avatar-preview', false);
            handleImageUpload('cover-input', 'change-cover-btn', 'cover-preview', true);

            generalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const fullName = document.getElementById('edit-fullname').value.trim();
                const nameParts = fullName.split(' ');
                
                user.fname = nameParts[0] || '';
                user.lname = nameParts.slice(1).join(' ') || '';
                user.username = document.getElementById('edit-username').value.trim();
                user.location = document.getElementById('edit-location').value.trim();
                user.bio = document.getElementById('edit-bio').value.trim();
                
                const avatarInput = document.getElementById('avatar-input');
                if (avatarInput && avatarInput.getAttribute('data-base64')) {
                    user.avatar = avatarInput.getAttribute('data-base64');
                }

                const coverInput = document.getElementById('cover-input');
                if (coverInput && coverInput.getAttribute('data-base64')) {
                    user.cover = coverInput.getAttribute('data-base64');
                }
                
                setCurrentUser(user);
                
                const users = getUsers();
                const userIndex = users.findIndex(u => u.id === user.id);
                if (userIndex !== -1) {
                    users[userIndex] = user;
                    saveUsers(users);
                }
                
                if (editNavAvatar) editNavAvatar.src = user.avatar || defaultAvatar;

                const successDiv = document.getElementById('edit-success');
                successDiv.style.display = 'block';
                successDiv.textContent = 'General Info updated successfully!';
                setTimeout(() => { successDiv.style.display = 'none'; }, 3000);
            });
        }

        // --- Form 2: Skills & Projects ---
        const skillsForm = document.getElementById('edit-skills-form');
        if (skillsForm) {
            document.getElementById('edit-github').value = user.github || '';
            document.getElementById('edit-linkedin').value = user.linkedin || '';
            document.getElementById('edit-website').value = user.website || '';
            
            const editSkills = document.getElementById('edit-skills');
            if (editSkills) editSkills.value = (user.skills || []).join(', ');
            
            const editInterests = document.getElementById('edit-interests');
            if (editInterests) editInterests.value = (user.interests || []).join(', ');

            const projectsContainer = document.getElementById('edit-projects-container');
            let projects = user.projects || [];
            
            const renderProjectForms = () => {
                if (!projectsContainer) return;
                projectsContainer.innerHTML = '';
                projects.forEach((proj, index) => {
                    const div = document.createElement('div');
                    div.style.marginBottom = '1.5rem';
                    div.style.padding = '1.5rem';
                    div.style.background = 'var(--input-bg)';
                    div.style.border = '1px solid var(--glass-border)';
                    div.style.borderRadius = '12px';
                    div.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h4 style="margin: 0; color: var(--text-main);">Project ${index + 1}</h4>
                            <button type="button" class="btn btn-secondary remove-project-btn" data-index="${index}" style="width: auto; padding: 0.3rem 0.8rem; color: #ef4444; border-color: transparent;">Remove</button>
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <input type="text" class="form-input project-title" placeholder="Project Title" value="${proj.title}" required>
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <textarea class="form-input project-desc" placeholder="Project Description" style="min-height: 80px;" required>${proj.description}</textarea>
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <input type="text" class="form-input project-tech" placeholder="Tech Stack (comma separated)" value="${proj.tech}">
                        </div>
                    `;
                    projectsContainer.appendChild(div);
                });

                document.querySelectorAll('.remove-project-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                        projects.splice(idx, 1);
                        renderProjectForms();
                    });
                });
            };

            renderProjectForms();

            const addProjectBtn = document.getElementById('add-project-btn');
            if (addProjectBtn) {
                addProjectBtn.addEventListener('click', () => {
                    projects.push({ title: '', description: '', tech: '' });
                    renderProjectForms();
                });
            }
            
            skillsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                user.github = document.getElementById('edit-github').value.trim();
                user.linkedin = document.getElementById('edit-linkedin').value.trim();
                user.website = document.getElementById('edit-website').value.trim();
                
                const skillsInput = document.getElementById('edit-skills').value;
                user.skills = skillsInput.split(',').map(s => s.trim()).filter(s => s);
                
                const interestsInput = document.getElementById('edit-interests').value;
                user.interests = interestsInput.split(',').map(s => s.trim()).filter(s => s);

                const newProjects = [];
                if (projectsContainer) {
                    const projectForms = projectsContainer.querySelectorAll('div[style*="background"]');
                    projectForms.forEach(form => {
                        const title = form.querySelector('.project-title').value.trim();
                        const description = form.querySelector('.project-desc').value.trim();
                        const tech = form.querySelector('.project-tech').value.trim();
                        if (title) {
                            newProjects.push({ title, description, tech });
                        }
                    });
                }
                user.projects = newProjects;
                
                setCurrentUser(user);
                
                const users = getUsers();
                const userIndex = users.findIndex(u => u.id === user.id);
                if (userIndex !== -1) {
                    users[userIndex] = user;
                    saveUsers(users);
                }
                
                const successDiv = document.getElementById('skills-success');
                successDiv.style.display = 'block';
                successDiv.textContent = 'Skills & Projects updated successfully!';
                setTimeout(() => { successDiv.style.display = 'none'; }, 3000);
            });
        }

        // --- Form 3: Security ---
        const securityForm = document.getElementById('edit-security-form');
        if (securityForm) {
            securityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const currentPass = document.getElementById('security-current').value;
                const newPass = document.getElementById('security-new').value;
                const confirmPass = document.getElementById('security-confirm').value;
                const errorDiv = document.getElementById('security-error');
                const successDiv = document.getElementById('security-success');
                
                errorDiv.style.display = 'none';
                successDiv.style.display = 'none';
                
                if (currentPass !== user.password) {
                    errorDiv.textContent = 'Current password is incorrect.';
                    errorDiv.style.display = 'block';
                    return;
                }
                
                if (newPass !== confirmPass) {
                    errorDiv.textContent = 'New passwords do not match.';
                    errorDiv.style.display = 'block';
                    return;
                }
                
                // Update password
                user.password = newPass;
                setCurrentUser(user);
                
                const users = getUsers();
                const userIndex = users.findIndex(u => u.id === user.id);
                if (userIndex !== -1) {
                    users[userIndex] = user;
                    saveUsers(users);
                }
                
                successDiv.style.display = 'block';
                document.getElementById('security-current').value = '';
                document.getElementById('security-new').value = '';
                document.getElementById('security-confirm').value = '';
                
                setTimeout(() => { successDiv.style.display = 'none'; }, 3000);
            });
        }
    }

    // Password Visibility Toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.previousElementSibling;
            if (input && (input.tagName === 'INPUT')) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                
                // Toggle SVG icons
                if (type === 'text') {
                    // Eye-off icon
                    this.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
                } else {
                    // Eye icon
                    this.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
                }
            }
        });
    });
});