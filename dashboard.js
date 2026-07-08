/**
 * BG Invoice Pro - Dashboard Application Workspace Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    DashboardApp.init();
});

const DashboardApp = {
    init() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarCollapseBtn = document.getElementById('sidebarCollapse');
        this.sidebarCollapseCloseBtn = document.getElementById('sidebarCollapseClose');
        this.logoutBtnTop = document.getElementById('logoutBtnTop');

        this.hydrateUserContext();
        this.bindEvents();
    },

    bindEvents() {
        // Toggle Sidebar state engine on desktop click event
        if (this.sidebarCollapseBtn) {
            this.sidebarCollapseBtn.addEventListener('click', () => {
                this.sidebar.classList.toggle('active');
            });
        }

        // Dedicated Mobile Panel close out toggle view execution
        if (this.sidebarCollapseCloseBtn) {
            this.sidebarCollapseCloseBtn.addEventListener('click', () => {
                this.sidebar.classList.remove('active');
            });
        }

        // Global sign-out click action trigger configuration
        if (this.logoutBtnTop) {
            this.logoutBtnTop.addEventListener('click', (e) => {
                e.preventDefault();
                if(typeof AuthApp !== 'undefined') {
                    AuthApp.logout();
                } else {
                    sessionStorage.clear();
                    window.location.href = 'login.html';
                }
            });
        }

        // Responsive handling optimization auto-closures
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                if (this.sidebar && !this.sidebar.classList.contains('active')) {
                    this.sidebar.classList.add('active');
                }
            } else {
                if (this.sidebar && this.sidebar.classList.contains('active')) {
                    this.sidebar.classList.remove('active');
                }
            }
        });
    },

    hydrateUserContext() {
        const rawUserData = sessionStorage.getItem('userData');
        if (rawUserData) {
            try {
                const userData = JSON.parse(rawUserData);
                
                // Hydrate Name strings fields safely
                const displayField = document.getElementById('userDropdownName');
                if (displayField && userData.name) {
                    displayField.textContent = userData.name;
                }

                // Parse out matching dynamic initial avatar letter
                const avatarBlock = document.getElementById('userAvatar');
                if (avatarBlock && userData.name) {
                    avatarBlock.textContent = userData.name.charAt(0).toUpperCase();
                }
            } catch (e) {
                console.error("Context processing breakdown reading Session Context Storage vectors: ", e);
            }
        }
    }
};