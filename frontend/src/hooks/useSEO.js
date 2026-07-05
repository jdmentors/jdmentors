import { useEffect } from 'react';

const SITE_NAME = 'JD Mentors';

function setMeta(attr, key, content) {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

export default function useSEO({ title, description } = {}) {
    useEffect(() => {
        const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

        document.title = fullTitle;
        setMeta('property', 'og:title', fullTitle);
        setMeta('name', 'twitter:title', fullTitle);

        if (description) {
            setMeta('name', 'description', description);
            setMeta('property', 'og:description', description);
            setMeta('name', 'twitter:description', description);
        }
    }, [title, description]);
}
