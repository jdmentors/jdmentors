import { useEffect } from 'react';

const SITE_NAME = 'JD Mentors';
const DEFAULT_DESCRIPTION = "Get expert 1-on-1 law school admissions. We help you craft standout personal statements, addendums, and application strategies. Book a consultation today.";

function setMeta(attr, key, content) {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function setCanonical(href) {
    let el = document.querySelector('link[rel="canonical"]');
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

function applySEO(title, description) {
    document.title = title;
    setMeta('property', 'og:title', title);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'description', description);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:description', description);
}

export default function useSEO({ title, description } = {}) {
    useEffect(() => {
        const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
        applySEO(fullTitle, description || DEFAULT_DESCRIPTION);

        let path = window.location.pathname;
        if (path.startsWith('/blogs/') && !path.endsWith('/')) path += '/';
        if (path !== '/' && path.endsWith('/') && !path.startsWith('/blogs/')) path = path.slice(0, -1);
        setCanonical(`https://www.jdmentors.com${path}`);

        return () => {
            applySEO(SITE_NAME, DEFAULT_DESCRIPTION);
        };
    }, [title, description]);
}
