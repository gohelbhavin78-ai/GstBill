/**
 * BG Invoice Pro - Authentication System Framework
 * Clean implementation designed for future Google Apps Script API abstraction layer.
 */

document.addEventListener('DOMContentLoaded', () => {
    AuthApp.init();
});

const AuthApp = {
    // Mimics backend response structure for instant drop-in integration later
    mockUser: {
        username: "admin",
        password: "password123",
        fullName: "Administrator",
        role: "Owner"
    },

    init() {
        this.loginForm = document.getElementById('loginForm');
        this.togglePasswordBtn = document.getElementById('togglePassword');
        this.passwordInput = document.getElementById('password');
        this.passwordIcon = document.getElementById('passwordIcon');
        this.rememberMeCheckbox = document.getElementById('rememberMe');

        if (this.loginForm) {
            this.checkRememberedUser();
            this.bindEvents();
        }
    },

    bindEvents() {
        // Form Submission handling
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLoginSubmit();
        });

        // Interactive View Password Functionality
        if (this.togglePasswordBtn) {
            this.togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());
        }

        // Forgot password utility mock handler
        const forgotLink = document.getElementById('forgotPasswordLink');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                alert("Password reset sequence is managed by organization admin. Please reach out to your technical coordinator.");
            });
        }
    },

    togglePasswordVisibility() {
        if (this.passwordInput.type === 'password') {
            this.passwordInput.type = 'text';
            this.passwordIcon.classList.remove('fa-eye');
            this.passwordIcon.classList.add('fa-eye-slash');
        } else {
            this.passwordInput.type = 'password';
            this.passwordIcon.classList.remove('fa-eye-slash');
            this.passwordIcon.classList.add('fa-eye');
        }
    },

    async handleLoginSubmit() {
        const usernameInput = document.getElementById('username');
        const alertBox = document.getElementById('authAlert');
        const alertText = document.getElementById('authAlertText');

        alertBox.classList.add('d-none');
        
        // Execute Bootstrap Validation state engine
        if (!this.loginForm.checkValidity()) {
            this.loginForm.classList.add('was-validated');
            return;
        }

        const user = usernameInput.value.trim();
        const pass = this.passwordInput.value;

        this.setLoadingState(true);

        // Native API network simulation (allows loading indicators to safely display UI states)
        setTimeout(() => {
            const isValid = this.validateLogin(user, pass);

            if (isValid) {
                this.rememberUser(user);
                // Establish application session context
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userData', JSON.stringify({
                    name: this.mockUser.fullName,
                    role: this.mockUser.role,
                    loginTime: new Date().toISOString()
                }));
                window.location.href = 'dashboard.html';
            } else {
                this.setLoadingState(false);
                alertText.textContent = "Invalid username or password credentials provided.";
                alertBox.classList.remove('d-none');
            }
        }, 1200); 
    },

    validateLogin(username, password) {
        // Decoupled logic ready to swap with a fetch() call to Google Apps Script
        return (username === this.mockUser.username && password === this.mockUser.password);
    },

    rememberUser(username) {
        if (this.rememberMeCheckbox && this.rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedInvoiceUser', username);
        } else {
            localStorage.removeItem('rememberedInvoiceUser');
        }
    },

    checkRememberedUser() {
        const savedUser = localStorage.getItem('rememberedInvoiceUser');
        if (savedUser && document.getElementById('username')) {
            document.getElementById('username').value = savedUser;
            if (this.rememberMeCheckbox) this.rememberMeCheckbox.checked = true;
        }
    },

    setLoadingState(isLoading) {
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');
        const loginBtn = document.getElementById('loginBtn');

        if (isLoading) {
            btnText.textContent = "Verifying...";
            btnSpinner.classList.remove('d-none');
            loginBtn.disabled = true;
        } else {
            btnText.textContent = "Sign In";
            btnSpinner.classList.add('d-none');
            loginBtn.disabled = false;
        }
    },

    logout() {
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
};