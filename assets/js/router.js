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

    const MANUAL_INSTALLATION_HTML = `
        <div class="install-guide">
            <div class="install-header">
                <span class="install-eyebrow">LexO-server deployment</span>
                <h2>Manual Installation</h2>
                <p class="install-lead">Install GraphDB, Tomcat, and LexO-server as separate local components, without Docker.</p>
            </div>

            <div class="install-note">
                Commands below are for macOS/Linux. On Windows, use the corresponding <code>.cmd</code> or <code>.bat</code> scripts where indicated.
            </div>

            <div class="install-section" style="margin-top:0;padding-top:0;border-top:0;">
                <span class="install-eyebrow">01 · Prerequisites</span>
                <h3>Install the prerequisites</h3>
                <div class="install-requirements">
                    <span class="install-requirement">JDK 17 recommended</span>
                    <span class="install-requirement">Apache Maven 3.8+</span>
                    <span class="install-requirement">GraphDB Free 10.8.x</span>
                    <span class="install-requirement">Apache Tomcat 9</span>
                </div>
                <p>GraphDB 10.8 requires Java 11 or later. Do not use Tomcat 10: LexO-server currently uses the <code>javax.*</code> APIs.</p>
                <div class="install-links">
                    <div class="install-link-card"><span>Maven</span><a href="https://maven.apache.org/install" target="_blank" rel="noopener noreferrer">Installation guide</a></div>
                    <div class="install-link-card"><span>Apache Tomcat 9</span><a href="https://tomcat.apache.org/download-90.cgi" target="_blank" rel="noopener noreferrer">Download Tomcat 9</a></div>
                </div>
                <p>Verify Java and Maven:</p>
                <pre class="install-command"><code>java -version
mvn -version</code></pre>
            </div>

            <div class="install-section">
                <span class="install-eyebrow">02 · GraphDB</span>
                <h3>Start GraphDB</h3>
                <p>Download and unpack GraphDB Free, then run it in the foreground:</p>
                <pre class="install-command"><code>export GRAPHDB_DIST=/absolute/path/to/graphdb-10.8.x
"$GRAPHDB_DIST/bin/graphdb"</code></pre>
                <p>On Windows run <code>bin\\graphdb.cmd</code>. Open GraphDB to verify that the service is ready.</p>
                <div class="install-links">
                    <div class="install-link-card"><span>GraphDB</span><a href="http://localhost:7200/" target="_blank" rel="noopener noreferrer">localhost:7200</a></div>
                    <div class="install-link-card"><span>Documentation</span><a href="https://graphdb.ontotext.com/documentation/10.8/pdf/GraphDB.pdf" target="_blank" rel="noopener noreferrer">GraphDB 10.8 documentation</a></div>
                </div>
                <div class="install-note">
                    Do not create <code>LexOLexica</code> or <code>LexOTexts</code> manually: LexO-server's bootstrap creates and configures both repositories.
                </div>
                <p>Stop a foreground GraphDB process with <code>Ctrl+C</code>.</p>
            </div>

            <div class="install-section">
                <span class="install-eyebrow">03 · Runtime configuration</span>
                <h3>Create the LexO runtime configuration</h3>
                <p>Create writable directories for configuration, application data, and logs:</p>
                <pre class="install-command"><code>export LEXO_RUNTIME_DIR=/absolute/path/to/lexo-runtime
mkdir -p "$LEXO_RUNTIME_DIR/conf" "$LEXO_RUNTIME_DIR/data/texts" \\
  "$LEXO_RUNTIME_DIR/data/legacy" "$LEXO_RUNTIME_DIR/logs"</code></pre>
                <p>Create <code>$LEXO_RUNTIME_DIR/conf/lexo-server.properties</code> with:</p>
                <pre class="install-command"><code>GraphDb.url=http://localhost:7200
GraphDb.repository=LexOLexica
TextGraphDb.url=http://localhost:7200
TextGraphDb.repository=LexOTexts
lexo.text.storage.dir=/absolute/path/to/lexo-runtime/data/texts
lexo.legacy.storage.dir=/absolute/path/to/lexo-runtime/data/legacy
Bootstrap.enabled=true
Bootstrap.required=true</code></pre>
                <div class="install-note">Replace every example path with an absolute path on the local machine.</div>
            </div>

            <div class="install-section">
                <span class="install-eyebrow">04 · Build</span>
                <h3>Build the WAR</h3>
                <p>From the LexO-server repository:</p>
                <pre class="install-command"><code>mvn clean package</code></pre>
                <p>The deployable file is <code>target/LexO-server.war</code>. This step can be skipped when a prebuilt WAR is supplied.</p>
            </div>

            <div class="install-section">
                <span class="install-eyebrow">05 · Tomcat</span>
                <h3>Configure Tomcat and deploy LexO-server</h3>
                <p>Set the Tomcat paths. For a simple single-instance installation, <code>CATALINA_BASE</code> and <code>CATALINA_HOME</code> can be the same directory:</p>
                <pre class="install-command"><code>export CATALINA_HOME=/absolute/path/to/apache-tomcat-9.x
export CATALINA_BASE="$CATALINA_HOME"</code></pre>
                <p>Create <code>$CATALINA_BASE/bin/setenv.sh</code> containing:</p>
                <pre class="install-command"><code>export CATALINA_OPTS="$CATALINA_OPTS -Dlexo.config.file=/absolute/path/to/lexo-runtime/conf/lexo-server.properties -Dlexo.log.dir=/absolute/path/to/lexo-runtime/logs -Dfile.encoding=UTF-8"</code></pre>
                <p>Make it executable, copy the WAR, and start Tomcat:</p>
                <pre class="install-command"><code>chmod +x "$CATALINA_BASE/bin/setenv.sh"
cp target/LexO-server.war "$CATALINA_BASE/webapps/LexO-server.war"
"$CATALINA_HOME/bin/startup.sh"</code></pre>
                <p>On Windows create <code>bin\\setenv.bat</code>, set the same JVM properties with <code>CATALINA_OPTS</code>, copy the WAR into <code>webapps</code>, and run <code>bin\\startup.bat</code>.</p>
                <div class="install-note">The first startup may take longer because LexO-server creates the repositories, loads the schemas, and creates the indexes.</div>
                <p>Check the running services:</p>
                <div class="install-links">
                    <div class="install-link-card"><span>LexO / Swagger</span><a href="http://localhost:8080/LexO-server/" target="_blank" rel="noopener noreferrer">localhost:8080/LexO-server/</a></div>
                    <div class="install-link-card"><span>Readiness</span><a href="http://localhost:8080/LexO-server/service/health/ready" target="_blank" rel="noopener noreferrer">/service/health/ready</a></div>
                    <div class="install-link-card"><span>GraphDB</span><a href="http://localhost:7200/" target="_blank" rel="noopener noreferrer">localhost:7200</a></div>
                </div>
                <p>If startup fails, inspect <code>$CATALINA_BASE/logs/catalina.out</code> and the configured LexO log directory. A successful readiness response has status <code>UP</code>.</p>
            </div>

            <div class="install-section">
                <span class="install-eyebrow">06 · Daily operations</span>
                <h3>Start and stop the installation</h3>
                <p>Start GraphDB first, then Tomcat. Stop them in the reverse order:</p>
                <pre class="install-command"><code>"$CATALINA_HOME/bin/shutdown.sh"
"$CATALINA_HOME/bin/startup.sh"</code></pre>
                <p>Use <code>shutdown.bat</code> and <code>startup.bat</code> on Windows. Stop GraphDB only after Tomcat has stopped.</p>
            </div>

            <div class="install-section">
                <span class="install-eyebrow">07 · Upgrade</span>
                <h3>Install a new LexO-server WAR</h3>
                <p>The repositories and application data must remain in their existing locations. Before an update, back up the GraphDB data directory and the LexO runtime data.</p>
                <ol class="install-process">
                    <li>Stop Tomcat with <code>shutdown.sh</code> or <code>shutdown.bat</code>.</li>
                    <li>Save a copy of the current <code>webapps/LexO-server.war</code>.</li>
                    <li>Copy the new WAR over <code>webapps/LexO-server.war</code>, keeping the same name.</li>
                    <li>Start Tomcat and wait for bootstrap to finish.</li>
                    <li>Verify the readiness URL, Swagger, and the logs.</li>
                </ol>
                <p>With Tomcat's default deployment settings, the newer WAR replaces the expanded application automatically. If custom deployment settings are used, also move the old <code>webapps/LexO-server</code> expanded directory to a backup location while Tomcat is stopped.</p>
                <div class="install-note">Do not replace the WAR while requests are being served.</div>
                <p>To roll back, stop Tomcat, restore the previous WAR, and restart it. Restore the data backup as well if the new version performed incompatible data migrations.</p>
                <div class="install-links">
                    <div class="install-link-card"><span>Tomcat documentation</span><a href="https://tomcat.apache.org/tomcat-9.0-doc/deployer-howto.html" target="_blank" rel="noopener noreferrer">Tomcat 9 deployment guide</a></div>
                </div>
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
                html: MANUAL_INSTALLATION_HTML
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
