function resolveUrls(root, base) {
    if (!root) return;

    root.querySelectorAll('[href], [src]').forEach(element => {
        ['href', 'src'].forEach(attr => {
            const value = element.getAttribute(attr);
            if (!value || /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(value)) {
                return;
            }
            element.setAttribute(attr, new URL(value, base).href);
        });
    });
}

function initForLocation() {
    if (/\/content\/[^/]+\.html$/.test(location.pathname)) {
        return window.initProject();
    }

    if (document.getElementById('portfolioGrid')) {
        return window.initHome();
    }

    return Promise.resolve();
}

let requestId = 0;

async function navigate(url, { push = true, scrollY = 0 } = {}) {
    const id = ++requestId;

    let response;
    try {
        response = await fetch(url);
        if (!response.ok) {
            throw new Error(String(response.status));
        }
    } catch (error) {
        if (id !== requestId) return;
        location.assign(url);
        return;
    }

    if (id !== requestId) return;

    const html = await response.text();
    if (id !== requestId) return;

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const newMain = doc.querySelector('main');
    const currentMain = document.querySelector('main');
    if (!newMain || !currentMain) {
        location.assign(url);
        return;
    }

    resolveUrls(newMain, response.url);

    if (push) {
        history.replaceState({ y: window.scrollY }, '');
        history.pushState({ y: 0 }, '', url);
        window.scrollTo(0, 0);
    }

    currentMain.replaceWith(newMain);

    if (doc.title) {
        document.title = doc.title;
    }

    await initForLocation();

    if (id !== requestId) return;

    if (!push) {
        window.scrollTo(0, scrollY);
    }
}

function internalUrl(event, link) {
    if (event.defaultPrevented || event.button !== 0) return null;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
    if (link.target && link.target !== '_self') return null;
    if (link.hasAttribute('download')) return null;

    const url = new URL(link.href);
    if (url.origin !== location.origin) return null;
    return url;
}

document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const url = internalUrl(event, link);
    if (!url) return;

    if (url.pathname === location.pathname && url.search === location.search) {
        if (url.hash) return;
        event.preventDefault();
        window.scrollTo(0, 0);
        return;
    }

    event.preventDefault();
    navigate(url);
});

window.addEventListener('popstate', event => {
    const scrollY = event.state && typeof event.state.y === 'number' ? event.state.y : 0;
    navigate(new URL(location.href), { push: false, scrollY });
});

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

resolveUrls(document.querySelector('.website-header'), document.baseURI);
history.replaceState({ y: window.scrollY }, '');
initForLocation();
