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

        return () => {
            applySEO(SITE_NAME, DEFAULT_DESCRIPTION);
        };
    }, [title, description]);
}
