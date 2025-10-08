document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const teamSection = document.getElementById('team');
    const sections = document.querySelectorAll('.content-area > *[id]');
    const navLinks = document.querySelectorAll('.sidebar__nav a');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(l => l.classList.remove('active'));
                
                const link = document.querySelector(`.sidebar__nav a[href="#${id}"]`);
                if (link) {
                    link.classList.add('active');
                }
            }
        });
    }, { rootMargin: '0px 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));

    const toggleSidebar = () => {
        const teamRect = teamSection.getBoundingClientRect();

        if (teamRect.top <= 100) { 
            sidebar.style.opacity = '1';
            sidebar.style.visibility = 'visible';
        } else {
            sidebar.style.opacity = '0';
            sidebar.style.visibility = 'hidden';
        }
    };

    window.addEventListener('scroll', toggleSidebar);
    toggleSidebar();

});




document.addEventListener('DOMContentLoaded', function() {

    const gridViewBtn = document.getElementById('view-grid');
    const listViewBtn = document.getElementById('view-list');
    const photosContainer = document.querySelector('.photos__container');

    const switchView = (viewType) => {
        if (viewType === 'list') {
            photosContainer.classList.add('list-view');
        } else {
            photosContainer.classList.remove('list-view');
        }
        gridViewBtn.classList.remove('active-view');
        listViewBtn.classList.remove('active-view');

        if (viewType === 'list') {
            listViewBtn.classList.add('active-view');
        } else {
            gridViewBtn.classList.add('active-view');
        }
    };

    gridViewBtn.addEventListener('click', () => switchView('grid'));
    listViewBtn.addEventListener('click', () => switchView('list'));
    
});