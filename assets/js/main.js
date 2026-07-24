const CORPUS_API_HTML = `
<div class="content-block">
    <div class="corpus-api-header">
        <span class="api-eyebrow">LexOTexts REST services</span>
        <h2>Corpus and Text Services Documentation</h2>
        <p class="api-lead">These services import, convert, manage, and retrieve corpora and textual resources represented as RDF/NIF graphs in LexOTexts.</p>
    </div>

    <div class="corpus-input-grid" aria-label="Accepted input files">
        <article class="corpus-input-card">
            <span class="input-card-number">01</span>
            <div>
                <h3>Corpus descriptor</h3>
                <p>A metadata-only file defines a corpus. Its front matter supplies the corpus identifier and descriptive metadata.</p>
            </div>
        </article>
        <article class="corpus-input-card">
            <span class="input-card-number">02</span>
            <div>
                <h3>Text document</h3>
                <p>A plain-text <code>.txt</code> file or a CommonMark <code>.md</code>/<code>.markdown</code> file defines a text.</p>
            </div>
        </article>
    </div>

    <div class="frontmatter-panel">
        <div class="frontmatter-copy">
            <span class="api-eyebrow">Supported metadata</span>
            <h3>Front matter</h3>
            <p>Importable files accept the following metadata fields, including multi-valued fields, in a front matter block delimited by <code>---</code>.</p>
            <p>Text files may optionally be accompanied by a CoNLL-U file that specifies tokenization. When no CoNLL-U file is supplied, the server applies an internal, language-independent, whitespace-based tokenizer.</p>
        </div>
        <pre class="frontmatter-code"><code>---
id: &lt;https://lexo.ilc.cnr.it/texts/doc-001&gt;
title: Storia della lessicografia
author:
  - Mario Rossi
  - Giulio Bianchi
date: 2026-07-24
language:
  - it
  - &lt;https://id.loc.gov/vocabulary/iso639-2/ita&gt;
format: text/plain
corpus: &lt;https://lexo.ilc.cnr.it/corpora/corpus-001&gt;
---</code></pre>
    </div>

    <div class="frontmatter-panel">
        <div class="frontmatter-copy">
            <span class="api-eyebrow">Document structure</span>
            <h3>Structured CommonMark</h3>
            <p>CommonMark files can also encode the internal hierarchy of a document. Markdown heading levels are interpreted as structural units: a level-one heading can introduce a chapter, a level-two heading can introduce a section, and lower levels can represent further subdivisions.</p>
            <p>A stable identifier may be placed in square brackets at the beginning of a heading. This allows each structural unit to be referenced unambiguously in the generated NIF representation. Paragraphs following a heading belong to that unit until the next heading at the same or a higher level.</p>
        </div>
        <pre class="frontmatter-code"><code># [id=cap1] Chapter One

First paragraph.

## [id=sec1] Section

Text.</code></pre>
    </div>

    <div class="api-service-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Text lifecycle</span>
                <h3>Text services</h3>
            </div>
            <span class="service-count">11 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/upload</code></td><td>Uploads a <code>.txt</code>, <code>.md</code>, or <code>.markdown</code> file and, optionally, an associated CoNLL-U file. The service stores the files in the upload area without converting them and returns a <code>fileId</code> for subsequent calls.</td></tr>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/{fileId}/convert</code><code class="endpoint-code endpoint-variant">?corpusId={corpusId}</code></td><td>Starts asynchronous conversion to RDF/NIF. It recognizes plain text or controlled CommonMark, optionally applies CoNLL-U segmentation, and stores the NIF graph in LexOTexts. The optional <code>corpusId</code> query parameter immediately associates the text with an existing corpus.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/status</code></td><td>Returns the status of the asynchronous conversion process, including progress, messages, validation issues, and the final state: <code>PENDING</code>, <code>RUNNING</code>, <code>COMPLETED</code>, <code>FAILED</code>, or <code>CANCELLED</code>.</td></tr>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/{fileId}/cancel</code></td><td>Requests cancellation of a conversion that is still running. The request body is optional; when supplied, the operation type must be <code>CONVERT</code>.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}</code></td><td>Returns the converted text record as JSON, including the document URI, metadata, original files, corpus membership, segmentation method, and chapter, paragraph, sentence, and token counts.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/nif</code></td><td>Downloads the document's NIF named graph in Turtle, including canonical text, structure, metadata, offsets, sentences, tokens, and corpus membership.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/canonical</code></td><td>Returns the canonical text corresponding to <code>nif:isString</code>. All <code>nif:beginIndex</code> and <code>nif:endIndex</code> values are calculated against this normalized representation, which should therefore be used as the reference for annotations and attestations.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/original</code></td><td>Downloads exactly the TXT or CommonMark file originally uploaded. The file is retrieved from the server filesystem rather than from the GraphDB repository.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/conllu</code></td><td>Downloads the CoNLL-U file associated with the text, when one was supplied during upload. Otherwise, the service reports that the artifact is unavailable.</td></tr>
                    <tr><td><span class="method delete">DELETE</span></td><td><code class="endpoint-code">/texts/{fileId}</code></td><td>Completely deletes a text: the NIF named graph and operational record are removed from LexOTexts, corpus links are cleared, and the original and optional CoNLL-U files are deleted from the filesystem.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts?corpusId=CORPUS_ID</code></td><td>Lists texts in the repository, optionally filtering by corpus. For each text, the response includes its name, size, available sentence and token counts, the number of attestations targeting it, and all available metadata.</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="api-service-group corpus-services-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Corpus lifecycle</span>
                <h3>Corpus services</h3>
            </div>
            <span class="service-count">5 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/corpora</code></td><td>Creates an initially empty corpus from a <code>.txt</code> file containing only a metadata header delimited by <code>---</code>. The corpus is represented by its own NIF named graph in LexOTexts, while the original descriptor is preserved in the filesystem.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/corpora/{corpusId}</code></td><td>Returns the corpus record as JSON, including its URI, metadata, and the current list of member documents. Membership relations are derived from NIF through <code>dcterms:hasPart</code> and <code>dcterms:isPartOf</code>.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/corpora/{corpusId}/nif</code></td><td>Downloads the corpus NIF named graph in Turtle. The graph contains no textual content; it describes the corpus, its metadata, and references to its member texts.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/corpora/{corpusId}/original</code></td><td>Downloads the original TXT descriptor containing the metadata used to create the corpus. The descriptor is read from the server filesystem.</td></tr>
                    <tr><td><span class="method delete">DELETE</span></td><td><code class="endpoint-code">/texts/corpora/{corpusId}</code></td><td>Deletes the corpus named graph, operational record, and original descriptor. Member texts are not deleted: they remain in the triple store but are detached from the removed corpus.</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>`;

$(document).ready(function () {
    const $trigger = $('#services-trigger');
    const $menu = $('.dropdown-menu');

    $trigger.on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const isOpen = $menu.is(':visible');
        $menu.toggle(!isOpen);
        $trigger.attr('aria-expanded', String(!isOpen));
    });

    $(document).on('click', function () {
        $menu.hide();
        $trigger.attr('aria-expanded', 'false');
    });

    $('.feature-card').on('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            $(this).trigger('click');
        }
    });

    setupCorpusApi();
    setupProjectIcons();
});

function setupCorpusApi() {
    if (!$('link[href="assets/css/corpus-api.css"]').length) {
        $('<link>', {
            rel: 'stylesheet',
            href: 'assets/css/corpus-api.css'
        }).appendTo('head');
    }

    $('.dropdown-menu').html(`
        <li><a onclick="navigate('api-lexicon')">Lexicon API</a></li>
        <li><a onclick="navigate('api-dictionary')">Dictionary API</a></li>
        <li><a onclick="navigate('api-ecd')">Explanatory Combinatorial Dictionary API</a></li>
        <li><a onclick="navigate('api-corpus')">Corpus API</a></li>
    `);

    if (!$('#api-corpus').length) {
        const $section = $('<section>', {
            id: 'api-corpus',
            class: 'corpus-api',
            html: CORPUS_API_HTML
        });

        const $ecdSection = $('#api-ecd');
        if ($ecdSection.length) {
            $section.insertAfter($ecdSection);
        } else {
            $('main').append($section);
        }
    }
}

function setupProjectIcons() {
    const projectIcons = [
        { file: 'vocabo-icon.png', alt: 'VocaBO project icon' },
        { file: 'ownw-icon.jpg', alt: 'OWNW project icon' },
        { file: 'itant-icon.jpg', alt: 'ItAnt project icon' },
        { file: 'ditmao-icon.jpg', alt: 'DiTMAO project icon' }
    ];

    $('#projects .project-row').each(function (index) {
        const icon = projectIcons[index];
        if (!icon) {
            return;
        }

        $(this).find('.project-icon')
            .attr({
                src: `assets/images/${icon.file}`,
                alt: icon.alt
            })
            .css({
                width: '70px',
                height: '70px',
                padding: '4px',
                boxSizing: 'border-box',
                objectFit: 'contain',
                alignSelf: 'center'
            });

        $(this).find('.project-title-col').css('align-self', 'center');
    });
}

function navigate(sectionId) {
    $('section').removeClass('active');
    $('#' + sectionId).addClass('active');
    $('main').scrollTop(0);
}
