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
    link.href = `content/${project.id}.html`;

    const container = document.createElement('div');
    container.className = 'portfolio-container';

    const item = document.createElement('div');
    item.className = 'portfolio-item';

    if (project.image_path) {
        const img = document.createElement('img');
        img.className = 'portfolio-image';
        img.alt = project.Title;
        img.dataset.src = project.image_path;
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

fetch('data/projects.json')
    .then(response => response.json())
    .then(projects => {
        const portfolioGrid = document.getElementById('portfolioGrid');
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
    .catch(error => console.error('Error loading projects:', error));
