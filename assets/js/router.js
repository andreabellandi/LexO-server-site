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
        'install-docker': '/install/docker',
        'install-manual': '/install/manual',
        projects: '/projects',
        papers: '/papers'
    };

    const SECTIONS_BY_ROUTE = Object.fromEntries(
        Object.entries(ROUTES).map(([sectionId, route]) => [route, sectionId])
    );

    const originalNavigate = window.navigate;

    const DOCKER_INSTALLATION_HTML = `
        <div class="install-guide">
            <div class="install-header">
                <span class="install-eyebrow">LexO-server deployment</span>
                <h2>Docker Installation</h2>
                <p class="install-lead">Run LexO-server/Tomcat and GraphDB as two coordinated containers using Docker Compose.</p>
            </div>

            <div class="install-section" style="margin-top:0;padding-top:0;border-top:0;">
                <span class="install-eyebrow">First step</span>
                <h3>Download LexO-server</h3>
                <p>First, download or clone the LexO-server project from GitHub.</p>
                <a class="github-repo-chip" href="https://github.com/andreabellandi/LexO-server.git" target="_blank" rel="noopener noreferrer" aria-label="Open the LexO-server repository on GitHub">
                    <svg class="github-repo-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.16c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.29-5.27-1.29-5.27-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.16 1.18a10.95 10.95 0 0 1 5.76 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.41-2.71 5.4-5.29 5.69.42.36.78 1.08.78 2.18v3.23c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .7Z"/></svg>
                    <span class="github-repo-copy"><strong>LexO-server on GitHub</strong><span>andreabellandi/LexO-server</span></span>
                    <span class="github-repo-arrow" aria-hidden="true">↗</span>
                </a>
                <pre class="install-command"><code>git clone https://github.com/andreabellandi/LexO-server.git</code></pre>
            </div>

            <div class="install-note">
                <strong>Important:</strong> do not click <strong>Run</strong> on the LexO image alone in Docker Desktop. Without the GraphDB service and the Compose environment, LexO cannot complete its startup.
            </div>

            <div class="install-section" style="margin-top:0;padding-top:0;border-top:0;">
                <span class="install-eyebrow">Before you start</span>
                <h3>Requirements</h3>
                <div class="install-requirements">
                    <span class="install-requirement">Docker Desktop or Docker Engine</span>
                    <span class="install-requirement">Docker Compose v2</span>
                    <span class="install-requirement">A copy of the LexO-server repository</span>
                </div>
            </div>

            <div class="install-section">
                <span class="install-eyebrow">01 · Initial setup</span>
                <h3>First start</h3>
                <p>From the repository root, create the local environment file and start the complete stack:</p>
                <pre class="install-command"><code>cp -n .env.example .env
docker compose up -d --build</code></pre>
                <p>This builds the LexO image and starts both the <code>graphdb</code> and <code>lexo</code> containers. Check their status and follow the LexO logs with:</p>
                <pre class="install-command"><code>docker compose ps
docker compose logs -f lexo</code></pre>
                <p>Wait until both services are <code>healthy</code>, then open:</p>
                <div class="install-links">
                    <div class="install-link-card"><span>LexO / Swagger</span><a href="http://localhost:8080/LexO-server/" target="_blank" rel="noopener noreferrer">localhost:8080/LexO-server/</a></div>
                    <div class="install-link-card"><span>Health check</span><a href="http://localhost:8080/LexO-server/service/health/ready" target="_blank" rel="noopener noreferrer">/service/health/ready</a></div>
                    <div class="install-link-card"><span>GraphDB</span><a href="http://localhost:7200/" target="_blank" rel="noopener noreferrer">localhost:7200</a></div>
                </div>
                <p>If you already have a versioned image such as <code>lexo-server:1.2.2</code>, always run it through Compose:</p>
                <pre class="install-command"><code>LEXO_VERSION=1.2.2 docker compose up -d</code></pre>
            </div>

            <div class="install-section">
                <span class="install-eyebrow">02 · Daily operations</span>
                <h3>Stop, restart, and remove containers</h3>
                <pre class="install-command"><code># Stop the containers without removing them
docker compose stop

# Restart the existing containers
docker compose up -d

# Remove the containers and network while preserving all data
docker compose down</code></pre>
                <div class="install-note">
                    Do not use <code>docker compose down --volumes</code>: it would delete the persistent volumes containing the GraphDB repositories and LexO files.
                </div>
            </div>

            <div class="install-section">
                <span class="install-eyebrow">03 · Upgrade</span>
                <h3>Update LexO with a new WAR</h3>
                <p>Do not copy a WAR into a running container. Build a new image with a unique tag and update LexO:</p>
                <pre class="install-command"><code>./docker/build-war-image.sh /path/to/LexO-server.war 1.2.2
./docker/update.sh 1.2.2</code></pre>
                <p>The update process:</p>
                <ol class="install-process">
                    <li>creates a backup automatically;</li>
                    <li>replaces only the LexO container;</li>
                    <li>preserves GraphDB and the application volumes;</li>
                    <li>waits until the new LexO container is <code>healthy</code>.</li>
                </ol>
                <p>To return to the previous version, provided it is compatible with the current data:</p>
                <pre class="install-command"><code>./docker/update.sh 1.2.1</code></pre>
            </div>
        </div>`;

    function setupInstallationDocs() {
        if (!$('link[href="assets/css/install.css"]').length) {
            $('<link>', {
                rel: 'stylesheet',
                href: 'assets/css/install.css'
            }).appendTo('head');
        }

        const $currentInstallItem = $('nav a[href="https://github.com/ilc-cnr/LexO-server"]').parent();
        if ($currentInstallItem.length && !$('#install-trigger').length) {
            $currentInstallItem.replaceWith(`
                <li class="dropdown install-dropdown">
                    <a id="install-trigger" aria-haspopup="true" aria-expanded="false">How to Install ▾</a>
                    <ul class="install-menu">
                        <li><a onclick="navigate('install-docker')">Docker Installation</a></li>
                        <li><a onclick="navigate('install-manual')">Manual Installation</a></li>
                    </ul>
                </li>
            `);
        }

        if (!$('#install-docker').length) {
            $('<section>', {
                id: 'install-docker',
                html: DOCKER_INSTALLATION_HTML
            }).insertBefore('#papers');
        }

        if (!$('#install-manual').length) {
            $('<section>', {
                id: 'install-manual',
                html: '<div class="content-block"></div>'
            }).insertBefore('#papers');
        }

        const $installTrigger = $('#install-trigger');
        const $installMenu = $('.install-menu');
        const $servicesTrigger = $('#services-trigger');
        const $servicesMenu = $('.dropdown-menu');

        $installTrigger.on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            const isOpen = $installMenu.is(':visible');
            $installMenu.toggle(!isOpen);
            $installTrigger.attr('aria-expanded', String(!isOpen));
            $servicesMenu.hide();
            $servicesTrigger.attr('aria-expanded', 'false');
        });

        $servicesTrigger.on('click', function () {
            $installMenu.hide();
            $installTrigger.attr('aria-expanded', 'false');
        });

        $(document).on('click', function () {
            $installMenu.hide();
            $installTrigger.attr('aria-expanded', 'false');
        });
    }

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
        setupInstallationDocs();
        renderCurrentRoute();
        window.addEventListener('hashchange', renderCurrentRoute);
    });
}());
