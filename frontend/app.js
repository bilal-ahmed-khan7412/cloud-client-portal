// API Configuration
const API_URL = 'https://0m7fm886w1.execute-api.eu-north-1.amazonaws.com/default/ClientPortalFunction';

// Client Portal Frontend Loaded
document.addEventListener('DOMContentLoaded', async () => {

    // --- 1. Dashboard Logic ---
    if (window.location.pathname.endsWith('dashboard.html')) {
        // Authenticate check
        try {
            const isAuth = await window.Auth.isAuthenticated();
            if (!isAuth) {
                window.location.href = 'login.html';
                return;
            }

            // Setup User Profile
            const user = window.Auth.getCurrentUser();
            if (user) {
                document.getElementById('userEmail').textContent = user.getUsername();
            }

            // Logout Button
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    window.Auth.signOut();
                });
            }

            // Load Data
            loadClients();

            // Modal Logic
            const modal = document.getElementById('clientModal');
            const addBtn = document.getElementById('addClientBtn');
            if (addBtn && modal) {
                addBtn.addEventListener('click', () => {
                    modal.style.display = 'flex';
                });
            }

            const addForm = document.getElementById('addClientForm');
            if (addForm) {
                addForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await createClient();
                });
            }

        } catch (e) {
            console.error(e);
            // Only redirect if it's definitely an auth error
            if (e === 'No current user' || e.message === 'No current user') {
                window.location.href = 'login.html';
            } else {
                alert('An error occurred: ' + JSON.stringify(e.message || e));
            }
        }
    }

    // --- 2. Login Logic ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const toggleAuth = document.getElementById('toggleAuth');
        const formTitle = document.getElementById('formTitle');
        const formDesc = document.getElementById('formDesc');
        const submitBtn = document.getElementById('submitBtn');
        const toggleText = document.getElementById('toggleText');

        let isLogin = true;

        if (toggleAuth) {
            toggleAuth.addEventListener('click', (e) => {
                e.preventDefault();
                isLogin = !isLogin;
                if (isLogin) {
                    formTitle.textContent = 'Welcome Back';
                    formDesc.textContent = 'Sign in to manage your clients';
                    submitBtn.textContent = 'Sign In';
                    toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggleAuth" style="color: var(--primary-color); font-weight: 500;">Sign Up</a>';
                } else {
                    formTitle.textContent = 'Create Account';
                    formDesc.textContent = 'Start managing your clients for free';
                    submitBtn.textContent = 'Create Account';
                    toggleText.innerHTML = 'Already have an account? <a href="#" id="toggleAuth" style="color: var(--primary-color); font-weight: 500;">Log In</a>';
                }
                // Re-attach listener to new element
                document.getElementById('toggleAuth').addEventListener('click', (e) => toggleAuth.click());
            });
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const messageDiv = document.getElementById('message');

            try {
                messageDiv.textContent = 'Processing...';
                messageDiv.style.color = 'black';

                if (isLogin) {
                    await window.Auth.signIn(email, password);
                    messageDiv.textContent = 'Success! Redirecting...';
                    messageDiv.style.color = 'green';
                    setTimeout(() => window.location.href = 'dashboard.html', 1000); // Redirect to dashboard
                } else {
                    const user = await window.Auth.signUp(email, password);
                    console.log(user);
                    const code = prompt('Account created! Please enter the verification code sent to ' + email);
                    if (code) {
                        await window.Auth.confirm(email, code);
                        alert('Account verified! Please log in.');
                        window.location.reload();
                    }
                }
            } catch (err) {
                console.error(err);
                messageDiv.textContent = err.message || JSON.stringify(err);
                messageDiv.style.color = 'red';
            }
        });
    }
});

// --- API Functions ---

async function loadClients() {
    try {
        const res = await fetch(API_URL);
        const clients = await res.json();

        document.getElementById('totalClients').textContent = clients.length;
        const tbody = document.getElementById('clientsTableBody');
        tbody.innerHTML = '';

        clients.forEach(client => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><div style="font-weight: 500;">${client.name}</div></td>
                <td>${client.company}</td>
                <td>${client.email}</td>
                <td><span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 99px; font-size: 12px;">${client.status}</span></td>
                <td>
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="deleteClient('${client.clientId}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('API Error:', err);
    }
}

async function createClient() {
    const name = document.getElementById('clientName').value;
    const company = document.getElementById('clientCompany').value;
    const email = document.getElementById('clientEmail').value;
    const btn = document.querySelector('#addClientForm button[type="submit"]');

    try {
        btn.textContent = 'Saving...';
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, company, email })
        });

        document.getElementById('clientModal').style.display = 'none';
        document.getElementById('addClientForm').reset();
        loadClients(); // Refresh list
    } catch (err) {
        console.error(err);
        alert('Failed to save client');
    } finally {
        btn.textContent = 'Save Client';
    }
}

// Expose delete function to window so HTML onclick works
window.deleteClient = async (id) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadClients();
    } catch (err) {
        console.error(err);
        alert('Failed to delete');
    }
};
