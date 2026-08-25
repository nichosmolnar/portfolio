const projectId = document.body.dataset.projectId;

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

fetch('../data/projects.json')
    .then(response => response.json())
    .then(projects => {
        const project = projects.find(p => p.id === projectId);

        if (!project) {
            const detail = document.querySelector('.project-detail');
            if (detail) {
                detail.innerHTML = '<p>Project not found.</p>';
            }
            return;
        }

        document.title = `${project.Title} - Nichos Molnar`;

        const titleEl = document.querySelector('.project-title');
        const heroImage = document.querySelector('.project-hero-image');
        const descriptionEl = document.querySelector('.project-description');
        const liveLink = document.querySelector('.project-live-link');
        const repoLink = document.querySelector('.project-repo-link');
        const separator = document.querySelector('.project-links-separator');
        const linksContainer = document.querySelector('.project-links');

        if (titleEl) {
            titleEl.textContent = project.Title;
        }

        if (heroImage && project.image_path) {
            heroImage.src = `../${project.image_path}`;
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
