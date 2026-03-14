// =============================================
// FOTO DE PERFIL EN DASHBOARD - GIGANTE VIAJERO
// Aplica la foto del admin al sidebar y al header
// =============================================

(function () {

    function applyAdminPhoto() {
        // Obtener foto: primero caché de photoSync, luego photoURL del user
        let photoURL = null;

        if (typeof photoSync !== 'undefined') {
            photoURL = photoSync.getPhoto();
        }

        if (!photoURL && typeof authAPI !== 'undefined') {
            const user = authAPI.getUser();
            photoURL = user?.photoURL || user?.avatar || null;
        }

        if (!photoURL) {
            // Sin foto: dejar iniciales como están
            return;
        }

        // ── 1. Avatar del sidebar (.admin-avatar) ─────────────────────
        const sidebarAvatar = document.querySelector('.sidebar-footer .admin-avatar');
        if (sidebarAvatar) {
            sidebarAvatar.style.cssText = `
                background: transparent;
                padding: 0;
                overflow: hidden;
                border-radius: 50%;
            `;
            sidebarAvatar.innerHTML = `<img src="${photoURL}" alt="Foto"
                style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;"
                onerror="this.parentElement.textContent='${sidebarAvatar.textContent || 'AD'}';
                         this.parentElement.style.cssText='background:linear-gradient(135deg,#195C33,#0d3d20);color:white;display:flex;align-items:center;justify-content:center;'">`;
        }

        // ── 2. Avatar del header (.user-avatar) ───────────────────────
        const headerAvatar = document.querySelector('.user-menu .user-avatar');
        if (headerAvatar) {
            const initials = headerAvatar.textContent || 'AD';
            headerAvatar.style.cssText = `
                background: transparent;
                padding: 0;
                overflow: hidden;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                flex-shrink: 0;
            `;
            headerAvatar.innerHTML = `<img src="${photoURL}" alt="Foto"
                style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;"
                onerror="this.parentElement.textContent='${initials}';
                         this.parentElement.style.cssText='background:linear-gradient(135deg,#195C33,#0d3d20);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;'">`;
        }
    }

    // Ejecutar al cargar y con pequeño delay para asegurar que photoSync esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(applyAdminPhoto, 400));
    } else {
        setTimeout(applyAdminPhoto, 400);
    }

    // Re-aplicar si el storage cambia (ej: foto actualizada desde otra pestaña)
    window.addEventListener('storage', function (e) {
        if (e.key && (e.key.startsWith('gigante_photo_') || e.key === 'techstore-user-data')) {
            setTimeout(applyAdminPhoto, 200);
        }
    });

    // Exponer función por si se necesita llamar manualmente
    window.applyAdminPhoto = applyAdminPhoto;

})();