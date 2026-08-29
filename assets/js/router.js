(function () {
    const ROUTES = {
        home: '/home',
        models: '/linguistic-data-models',
        othermodels: '/other-data-models',
        types: '/resource-types',
        'api-lexicon': '/services/lexicon-api',
        'api-wordnet': '/services/wordnet-api',
        'api-attestation': '/services/attestation-api',
        'api-dictionary': '/services/dictionary-api',
        'api-ecd': '/services/explanatory-combinatorial-dictionary-api',
        'api-corpus': '/services/corpus-api',
        projects: '/projects',
        papers: '/papers'
    };

    const SECTIONS_BY_ROUTE = Object.fromEntries(
        Object.entries(ROUTES).map(([sectionId, route]) => [route, sectionId])
    );

    const originalNavigate = window.navigate;

    function sectionFromLocation() {
        const rawHash = decodeURIComponent(window.location.hash.replace(/^#/, ''));

        if (!rawHash) {
            return 'home';
        }

        if (SECTIONS_BY_ROUTE[rawHash]) {
            return SECTIONS_BY_ROUTE[rawHash];
        }

        // Backwards-compatible support for hashes based directly on section IDs.
        const legacySectionId = rawHash.replace(/^\//, '');
        if (ROUTES[legacySectionId]) {
            return legacySectionId;
        }

        return 'home';
    }

    function renderCurrentRoute() {
        originalNavigate(sectionFromLocation());
    }

    window.navigate = function (sectionId) {
        const route = ROUTES[sectionId];

        if (!route) {
            originalNavigate(sectionId);
            return;
        }

        const targetHash = '#' + route;
        if (window.location.hash === targetHash) {
            originalNavigate(sectionId);
            return;
        }

        window.location.hash = route;
    };

    $(document).ready(function () {
        renderCurrentRoute();
        window.addEventListener('hashchange', renderCurrentRoute);
    });
}());
