function siteRoot() {
    if (!window.__siteRoot) {
        const inContent = /\/content\//.test(location.pathname);
        window.__siteRoot = new URL(inContent ? '../' : './', document.baseURI).href;
    }
    return window.__siteRoot;
}

siteRoot();

let projectsPromise;

function loadProjects() {
    if (!projectsPromise) {
        projectsPromise = fetch(new URL('data/projects.json', siteRoot()))
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load projects');
                }
                return response.json();
            })
            .catch(error => {
                projectsPromise = null;
                throw error;
            });
    }
    return projectsPromise;
}

function loadPortfolioImage(img, item) {
    const src = img.dataset.src;
    if (!src) {
        item.classList.add('image-loaded');
        return;
    }

    img.addEventListener('load', () => {
        img.classList.add('is-loaded');
        item.classList.add('image-loaded');
    }, { once: true });

    img.addEventListener('error', () => {
        item.classList.add('image-loaded');
    }, { once: true });

    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = src;
}

function createProjectCard(project) {
    const link = document.createElement('a');
    link.className = 'portfolio-link';
    link.href = new URL(`content/${project.id}.html`, siteRoot()).href;

    const container = document.createElement('div');
    container.className = 'portfolio-container';

    const item = document.createElement('div');
    item.className = 'portfolio-item';

    if (project.image_path) {
        const img = document.createElement('img');
        img.className = 'portfolio-image';
        img.alt = project.Title;
        img.dataset.src = new URL(project.image_path, siteRoot()).href;
        item.appendChild(img);
    } else {
        item.classList.add('image-loaded');
    }

    const content = document.createElement('div');
    content.className = 'portfolio-content';

    const title = document.createElement('h3');
    title.textContent = project.Title;

    const category = document.createElement('p');
    category.className = 'category';
    category.textContent = project.category;

    content.appendChild(title);
    content.appendChild(category);
    item.appendChild(content);

    const description = document.createElement('p');
    description.className = 'portfolio-description';
    description.textContent = project.description;

    container.appendChild(item);
    container.appendChild(description);
    link.appendChild(container);

    return { container: link, item };
}

function initHome() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    if (!portfolioGrid || portfolioGrid.dataset.loading === 'true') {
        return Promise.resolve();
    }

    portfolioGrid.dataset.loading = 'true';

    return loadProjects()
        .then(projects => {
            if (!portfolioGrid.isConnected) {
                return;
            }

            const cards = projects.map(project => {
                const card = createProjectCard(project);
                portfolioGrid.appendChild(card.container);
                return card;
            });

            cards.forEach(({ item }) => {
                const img = item.querySelector('.portfolio-image');
                if (img) {
                    loadPortfolioImage(img, item);
                }
            });
        })
        .catch(error => {
            if (portfolioGrid.isConnected) {
                delete portfolioGrid.dataset.loading;
            }
            console.error('Error loading projects:', error);
        });
}

window.siteRoot = siteRoot;
window.loadProjects = loadProjects;
window.initHome = initHome;
