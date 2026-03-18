// ================== LOGIN ==================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const payload = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            payload.append(key, value);
        }

        try {
            const response = await fetch('/auth/token', {
                method: 'POST',
                body: payload.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: 'include' // <- envía la cookie automáticamente
            });

            if (response.redirected) {
                window.location.href = response.url;
            } else {
                const data = await response.json();
                alert(`Error: ${data.detail}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred. Please try again.');
        }
    });
}

// ================== REGISTER ==================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        if (data.password !== data.password2) {
            alert("Passwords do not match");
            return;
        }

        const payload = {
            email: data.email,
            username: data.username,
            first_name: data.firstname,
            last_name: data.lastname,
            role: data.role,
            phone_number: data.phone_number,
            password: data.password
        };

        try {
            const response = await fetch('/auth', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                window.location.href = '/auth/login-page';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || errorData.detail}`);
            }
        } catch (error) {
            console.error('Register error:', error);
            alert('An error occurred during registration.');
        }
    });
}

// Add Todo
const todoForm = document.getElementById('todoForm');
if (todoForm) {
    todoForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(todoForm).entries());
        const payload = {
            title: data.title,
            description: data.description,
            priority: parseInt(data.priority),
            complete: false
        };

        try {
            const response = await fetch('/todos/todo', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
                credentials: 'include' // <- envía cookie automáticamente
            });

            if (response.ok) {
                form.reset();
                window.location.href = '/todos/todo-page';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.detail}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred. Please try again.');
        }
    });
}

// Edit Todo
const editTodoForm = document.getElementById('editTodoForm');
if (editTodoForm) {
    editTodoForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(editTodoForm).entries());
        const todoId = window.location.pathname.split("/").pop();

        const payload = {
            title: data.title,
            description: data.description,
            priority: parseInt(data.priority),
            complete: data.complete === "on"
        };

        try {
            const response = await fetch(`/todos/todo/${todoId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
                credentials: 'include' // <- envía cookie automáticamente
            });

            if (response.ok) {
                window.location.href = '/todos/todo-page';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.detail}`);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred. Please try again.');
        }
    });
}

// ================== LOGOUT ==================
function logout() {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    window.location.href = '/auth/login-page';
}