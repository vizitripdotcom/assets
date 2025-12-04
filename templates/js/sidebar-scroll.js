// Auto-scroll sidebar to active menu item
window.addEventListener('load', function() {
    const activeMenuLink = document.querySelector('.sidebar-menu .menu-link.active');
    if (activeMenuLink) {
        const sidebarMenu = document.querySelector('.sidebar-menu');
        const offset = activeMenuLink.offsetTop - (sidebarMenu.clientHeight / 2) + (activeMenuLink.clientHeight / 2);
        sidebarMenu.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    }
});
