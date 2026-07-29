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
                <span class="api-eyebrow">Single-document lifecycle</span>
                <h3>Text management</h3>
            </div>
            <span class="service-count">11 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts</code></td><td>Returns the catalogue of texts stored in LexOTexts, including each text's name, size, sentence and token counts, metadata, attestations, and annotations. The optional <code>corpusId</code> query parameter restricts the result to texts belonging to a specific corpus.</td></tr>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/upload</code></td><td>Uploads a single <code>.txt</code>, <code>.md</code>, or <code>.markdown</code> file together with a required ISO 639 language code and, optionally, an associated CoNLL-U file. The service temporarily stores the original artifacts and returns a <code>fileId</code>; conversion must be started separately.</td></tr>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/{fileId}/convert</code><code class="endpoint-code endpoint-variant">?corpusId={corpusId}</code></td><td>Asynchronously converts a previously uploaded text. It parses TXT or CommonMark, applies optional CoNLL-U segmentation, generates the NIF model, and may add the document to the corpus identified by the optional <code>corpusId</code> parameter.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/status</code></td><td>Returns the state of the asynchronous conversion job: <code>PENDING</code>, <code>RUNNING</code>, <code>COMPLETED</code>, <code>FAILED</code>, or <code>CANCELLED</code>. The response includes progress, a status message, the result, and any validation issues.</td></tr>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/{fileId}/cancel</code></td><td>Requests cancellation of the asynchronous conversion associated with the text. The request body is optional; when a job type is specified, it must be <code>CONVERT</code>.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}</code></td><td>Returns the record persisted after conversion, including the document URI, corpus membership, original file names, segmentation method, structural counts, metadata, and warnings.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/nif</code></td><td>Downloads the document's NIF named graph serialized as Turtle. The graph includes canonical text, document structure, linguistic segmentation, metadata, and the link to an optional corpus.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/original</code></td><td>Returns the TXT or CommonMark file originally uploaded. The original file remains available after a successful conversion.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/canonical</code></td><td>Returns the normalized text used as <code>nif:isString</code>. This is the reference representation against which the Unicode offsets of segments, attestations, and annotations are calculated.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/conllu</code></td><td>Returns the CoNLL-U file associated with the text when one was supplied during single-document upload. If no CoNLL-U artifact is available, the service responds with <code>404 Not Found</code>.</td></tr>
                    <tr><td><span class="method delete">DELETE</span></td><td><code class="endpoint-code">/texts/{fileId}</code></td><td>Deletes the document's NIF graph and record, its persisted original artifacts, and any related jobs or temporary uploads. It also detaches the document from its corpus and removes the corresponding attestation and annotation named graphs.</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="api-service-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Multiple documents</span>
                <h3>Bulk import</h3>
            </div>
            <span class="service-count">2 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/bulk</code></td><td>Accepts multiple <code>.txt</code>, <code>.md</code>, or <code>.markdown</code> files and one required ISO 639 language code shared by all documents. The optional <code>corpusId</code> is also shared by the complete batch. The service validates the entire request and then automatically starts an independent conversion for every document. CoNLL-U is not supported in bulk mode: the presence of a CoNLL-U part or file extension rejects the whole request. After acceptance, however, the failure of one document does not roll back documents that were converted successfully.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/bulk/{bulkId}/status</code></td><td>Returns the aggregate status of the bulk operation and the status of every individual document, including its <code>fileId</code>, progress, and errors. Final aggregate states are <code>COMPLETED</code>, <code>FAILED</code>, <code>CANCELLED</code>, or <code>PARTIALLY_COMPLETED</code>.</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="api-service-group corpus-services-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Corpus lifecycle</span>
                <h3>Corpus management</h3>
            </div>
            <span class="service-count">5 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/corpora</code></td><td>Creates an empty NIF corpus from a <code>.txt</code> file containing only front matter and supported metadata. The descriptor must not contain document text.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/corpora/{corpusId}</code></td><td>Returns the corpus URI, metadata, descriptor file, and the current list of documents belonging to the corpus.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/corpora/{corpusId}/nif</code></td><td>Downloads the corpus NIF named graph in Turtle, including its metadata and the <code>dcterms:hasPart</code> links to member texts.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/corpora/{corpusId}/original</code></td><td>Returns the original TXT descriptor used to create the corpus and define its metadata.</td></tr>
                    <tr><td><span class="method delete">DELETE</span></td><td><code class="endpoint-code">/texts/corpora/{corpusId}</code></td><td>Deletes the corpus NIF graph, record, and descriptor. Member texts are not deleted; they are only detached from the corpus.</td></tr>
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
