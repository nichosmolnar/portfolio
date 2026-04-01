// Fetch and display portfolio projects
fetch('data/projects.json')
    .then(response => response.json())
    .then(projects => {
        const portfolioGrid = document.getElementById('portfolioGrid');
        
        projects.forEach(project => {
            const container = document.createElement('div');
            container.className = 'portfolio-container';
            
            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.innerHTML = `
                <div class="portfolio-content">
                    <h3>${project.Title}</h3>
                    <p class="category">${project.category}</p>
                </div>
            `;
            
            const description = document.createElement('p');
            description.className = 'portfolio-description';
            description.textContent = project.description;
            
            container.appendChild(item);
            container.appendChild(description);
            portfolioGrid.appendChild(container);
        });
    })
    .catch(error => console.error('Error loading projects:', error));

