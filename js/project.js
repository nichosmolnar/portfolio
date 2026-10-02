function setExternalLink(linkEl, url, label) {
    if (!linkEl) return false;

    if (url) {
        linkEl.href = url;
        linkEl.textContent = label;
        linkEl.style.display = '';
        return true;
    }

    linkEl.style.display = 'none';
    return false;
}

function projectIdFromLocation() {
    const match = location.pathname.match(/\/content\/([^/]+)\.html$/);
    return match ? decodeURIComponent(match[1]) : '';
}

function initProject() {
    const projectId = projectIdFromLocation();
    const detail = document.querySelector('.project-detail');
    if (!projectId || !detail) {
        return Promise.resolve();
    }

    return window.loadProjects()
        .then(projects => {
            if (!detail.isConnected) {
                return;
            }

            const project = projects.find(item => item.id === projectId);

            if (!project) {
                detail.innerHTML = '<p>Project not found.</p>';
                return;
            }

            document.title = `${project.Title} - Nichos Molnar`;

            const titleEl = detail.querySelector('.project-title');
            const heroImage = detail.querySelector('.project-hero-image');
            const descriptionEl = detail.querySelector('.project-description');
            const liveLink = detail.querySelector('.project-live-link');
            const repoLink = detail.querySelector('.project-repo-link');
            const separator = detail.querySelector('.project-links-separator');
            const linksContainer = detail.querySelector('.project-links');

            if (titleEl) {
                titleEl.textContent = project.Title;
            }

            if (heroImage && project.image_path) {
                heroImage.src = new URL(project.image_path, window.siteRoot()).href;
                heroImage.alt = project.Title;
            }

            if (descriptionEl && !descriptionEl.innerHTML.trim()) {
                descriptionEl.textContent = project.description;
            }

            const hasLiveLink = setExternalLink(liveLink, project.website_link, 'Live Project');
            const hasRepoLink = setExternalLink(repoLink, project.repository_link, 'GitHub Repository');

            if (separator) {
                separator.style.display = hasLiveLink && hasRepoLink ? '' : 'none';
            }

            if (linksContainer && !hasLiveLink && !hasRepoLink) {
                linksContainer.style.display = 'none';
            }
        })
        .catch(error => console.error('Error loading project:', error));
}

window.initProject = initProject;
