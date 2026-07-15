document.addEventListener('DOMContentLoaded', () => {

    // ===================================================
    // 1. ESTADO DE DATOS (LOCALSTORAGE)
    // ===================================================
    const DEFAULT_USERS = [
        { id: 1, name: 'Andrés Delgado', email: 'andres@convive.com', role: 'Admin', status: 'Activo' },
        { id: 2, name: 'María Camila', email: 'maria@convive.com', role: 'Moderador', status: 'Activo' }
    ];

    let users = JSON.parse(localStorage.getItem('users')) || DEFAULT_USERS;

    const saveToLocalStorage = () => {
        localStorage.setItem('users', JSON.stringify(users));
    };

    // ===================================================
    // 2. RENDERIZAR TABLA DINÁMICAMENTE
    // ===================================================
    const tableBody = document.querySelector('.users-table tbody');

    const renderTable = (usersToRender) => {
        if (!tableBody) return;
        tableBody.innerHTML = ''; 

        if (usersToRender.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 30px; color: var(--secondary-color);">
                        No se encontraron usuarios que coincidan con la búsqueda.
                    </td>
                </tr>
            `;
            return;
        }

        usersToRender.forEach(user => {
            const tr = document.createElement('tr');
            const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
            const roleClass = user.role === 'Admin' ? 'badge-admin' : 'badge-moderator';
            const statusClass = user.status === 'Activo' ? 'status-active' : 'status-inactive';

            tr.innerHTML = `
                <td data-label="Nombre">
                    <div class="user-cell">
                        <div class="user-avatar-small">${initial}</div>
                        <span>${user.name}</span>
                    </div>
                </td>
                <td data-label="Email">${user.email}</td>
                <td data-label="Rol"><span class="badge ${roleClass}">${user.role}</span></td>
                <td data-label="Estado"><span class="${statusClass}">${user.status}</span></td>
                <td data-label="Acciones">
                    <div class="table-actions">
                        <button class="btn-icon btn-edit" data-id="${user.id}">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-icon btn-danger btn-delete" data-id="${user.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        attachActionEvents();
    };

    // ===================================================
    // 3. BARRA DE BÚSQUEDA
    // ===================================================
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filteredUsers = users.filter(user => 
                user.name.toLowerCase().includes(query) || 
                user.email.toLowerCase().includes(query)
            );
            renderTable(filteredUsers);
        });
    }

    // ===================================================
    // 4. CONTROL DE VENTANA MODAL (CREAR / EDITAR)
    // ===================================================
    const userModal = document.getElementById('userModal');
    const btnNewUser = document.querySelector('.btn-primary'); 
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const userForm = document.getElementById('userForm');

    // Elementos del formulario (Capturados de forma segura)
    const userIdInput = document.getElementById('userId');
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');
    const userRoleSelect = document.getElementById('userRole');
    const userStatusSelect = document.getElementById('userStatus');
    const modalTitle = document.getElementById('modalTitle');

    const openModal = (title = 'Nuevo Usuario') => {
        if (!userModal) return;
        modalTitle.textContent = title;
        userModal.classList.add('active');
    };

    const closeModal = () => {
        if (!userModal) return;
        userModal.classList.remove('active');
        userForm.reset();
        userIdInput.value = ''; // Limpieza total del ID de edición
    };

    if (btnNewUser) {
        btnNewUser.addEventListener('click', () => {
            closeModal(); // Reseteamos cualquier residuo previo
            openModal('Nuevo Usuario');
        });
    }
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    // Close modal clicking outside
    if (userModal) {
        userModal.addEventListener('click', (e) => {
            if (e.target === userModal) closeModal();
        });
    }

    // ===================================================
    // 5. EVENTO DE GUARDAR (CREAR O EDITAR)
    // ===================================================
    if (userForm) {
        // MUY IMPORTANTE: Quitamos cualquier listener previo para evitar duplicaciones
        userForm.removeAttribute('onsubmit'); 
        
        userForm.onsubmit = (e) => {
            e.preventDefault();

            // Captura directa y limpia de los valores actuales
            const idVal = userIdInput.value ? userIdInput.value.trim() : ''; 
            const name = userNameInput.value ? userNameInput.value.trim() : '';
            const email = userEmailInput.value ? userEmailInput.value.trim() : '';
            const role = userRoleSelect.value;
            const status = userStatusSelect.value;

            // Validación estricta: Solo alerta si realmente están vacíos
            if (name === '' || email === '') {
                alert('Por favor, completa todos los campos obligatorios (Nombre y Correo).');
                return; // Aquí se detiene si falta información
            }

            if (idVal !== '') {
                // Modo Edición
                const targetId = parseInt(idVal);
                users = users.map(user => {
                    if (user.id === targetId) {
                        return { id: targetId, name, email, role, status };
                    }
                    return user;
                });
                console.log('Usuario actualizado con éxito');
            } else {
                // Modo Registro Nuevo
                const newUser = {
                    id: Date.now(),
                    name,
                    email,
                    role,
                    status
                };
                users.push(newUser);
                console.log('Usuario creado con éxito');
            }

            saveToLocalStorage();
            renderTable(users);
            closeModal();

            if (searchInput) searchInput.value = ''; // Limpiar buscador
        };
    }

    // ===================================================
    // 6. ACCIONES: EDITAR Y ELIMINAR
    // ===================================================
    function attachActionEvents() {
        // Evento para Editar
        document.querySelectorAll('.btn-edit').forEach(button => {
            // Reemplazamos el listener viejo clonando el botón o usandoonclick directo
            button.onclick = (e) => {
                e.preventDefault();
                const id = parseInt(button.getAttribute('data-id'));
                const userToEdit = users.find(u => u.id === id);

                if (userToEdit) {
                    userIdInput.value = userToEdit.id;
                    userNameInput.value = userToEdit.name;
                    userEmailInput.value = userToEdit.email;
                    userRoleSelect.value = userToEdit.role;
                    userStatusSelect.value = userToEdit.status;

                    openModal('Editar Usuario');
                }
            };
        });

        // Evento para Eliminar
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.onclick = (e) => {
                e.preventDefault();
                const id = parseInt(button.getAttribute('data-id'));
                const userToDelete = users.find(u => u.id === id);

                if (userToDelete) {
                    const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar al usuario "${userToDelete.name}"?`);
                    if (confirmDelete) {
                        users = users.filter(u => u.id !== id);
                        saveToLocalStorage();
                        renderTable(users);
                    }
                }
            };
        });
    }

    // ===================================================
    // 7. MENÚS (HAMBURGUESA Y PERFIL)
    // ===================================================
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (hamburgerBtn && sidebar && sidebarOverlay) {
        hamburgerBtn.onclick = () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        };
    }

    const closeMenu = () => {
        if (sidebar && sidebarOverlay) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    };

    if (closeSidebarBtn) closeSidebarBtn.onclick = closeMenu;
    if (sidebarOverlay) sidebarOverlay.onclick = closeMenu;

    // Menú de Perfil
    const profileTrigger = document.getElementById('profileTrigger');
    const profileDropdown = document.getElementById('profileDropdown');
    const logoutBtn = document.getElementById('logoutBtn');

    if (profileTrigger && profileDropdown) {
        profileTrigger.onclick = (e) => {
            e.stopPropagation();
            profileTrigger.classList.toggle('active');
            profileDropdown.classList.toggle('active');
        };

        document.onclick = () => {
            profileTrigger.classList.remove('active');
            profileDropdown.classList.remove('active');
        };

        profileDropdown.onclick = (e) => {
            e.stopPropagation();
        };
    }

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            window.location.href = "/src/views/aut/login.html"; 
        }
        });

    // ===================================================
    // 8. RENDER INICIAL
    // ===================================================
    renderTable(users);

});