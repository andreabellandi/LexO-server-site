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

    <div class="frontmatter-panel">
        <div class="frontmatter-copy">
            <span class="api-eyebrow">JSON BULK IMPORT</span>
            <h3>Text and attestations</h3>
            <p>A fixed-schema JSON file can import plain text, document metadata and one or more FRAC attestations in a single operation. JSON documents are uploaded through <code>POST /texts/bulk</code>, using a multipart <code>file</code> field and a shared, required ISO 639 <code>language</code> field.</p>
            <p>The canonical text is read from <code>text.content</code> and converted to NIF as plain text. Each attestation identifies an existing OntoLex entity, its exact RDF type, the selected textual value and its Unicode code-point offsets. The value must match the substring between <code>start_char</code> and <code>end_char</code>.</p>
            <p>Attestations may also include custom RDF metadata. Each metadata property contains one or more values, represented as IRIs, plain literals, language-tagged literals or typed literals. In the example, a decimal confidence value is associated with the imported attestation.</p>
            <p>Lexical entries, forms and senses are resolved in the lexical graph associated with the uploaded language, while lexical concepts are resolved in the fixed lexical-concept graph. Invalid individual attestations are reported as unsaved without removing the imported text or other valid attestations.</p>
            <p><strong>Technical note.</strong> The language is not declared inside the JSON document. It must be supplied separately as the multipart <code>language</code> field. The observable IRI must identify an existing lexical entity of the declared RDF type.</p>
        </div>
        <pre class="frontmatter-code"><code>{
  "metadata": {
    "id": "doc-001",
    "title": "Testo annotato",
    "author": "Mario Rossi"
  },
  "text": {
    "type": "txt",
    "content": "LexO annota parole."
  },
  "attestations": [
    {
      "id": "ann-001",
      "observable": "https://lexo.ilc.cnr.it#LexO_parola",
      "type": "http://www.w3.org/ns/lemon/ontolex#LexicalEntry",
      "value": "parole",
      "gloss": "parola",
      "start_char": 12,
      "end_char": 18,
      "metadata": [
        {
          "property": "http://www.lexinfo.net/ontology/3.0/lexinfo#confidence",
          "values": [
            {
              "value": "0.95",
              "type": "literal",
              "datatype": "http://www.w3.org/2001/XMLSchema#decimal"
            }
          ]
        }
      ]
    }
  ]
}</code></pre>
    </div>

    <div class="api-service-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Document lifecycle</span>
                <h3>Text management</h3>
            </div>
            <span class="service-count">3 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Function</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts</code></td><td>Text catalogue</td><td>Returns the texts available in <code>LexOTexts</code>, including name, size, sentence and token counts, metadata, attestations, and annotations. The optional <code>corpusId</code> parameter restricts the result to texts belonging to a specific corpus.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}</code></td><td>Text details</td><td>Returns the persisted record of a converted text, including its URI, corpus, segmentation method, associated files, named graph, dates, counts, metadata, and warnings.</td></tr>
                    <tr><td><span class="method delete">DELETE</span></td><td><code class="endpoint-code">/texts/{fileId}</code></td><td>Delete text</td><td>Deletes the document record and NIF graph, persisted files, corpus membership, attestations, and annotations. It also removes references to those attestations from other graphs and recalculates the affected frequencies.</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="api-service-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Single-document workflow</span>
                <h3>Single import and NIF conversion</h3>
            </div>
            <span class="service-count">4 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Function</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/upload</code></td><td>Upload text</td><td>Uploads a TXT or CommonMark file and, optionally, a CoNLL-U file. The multipart <code>language</code> field is required and validated against the ISO 639 list. The service returns a new <code>fileId</code>.</td></tr>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/{fileId}/convert</code><code class="endpoint-code endpoint-variant">?corpusId={corpusId}</code></td><td>Start NIF conversion</td><td>Starts asynchronous conversion of the uploaded text. The optional <code>corpusId</code> parameter adds the resulting document to the specified corpus.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/status</code></td><td>Conversion status</td><td>Returns the current state of asynchronous jobs associated with the text, including progress, completion, failure, or cancellation information.</td></tr>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/{fileId}/cancel</code></td><td>Cancel conversion</td><td>Requests interruption of the asynchronous conversion. The body is optional; when it specifies <code>type</code>, the only accepted value is <code>CONVERT</code>.</td></tr>
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
                <thead><tr><th>Method</th><th>Endpoint</th><th>Function</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/bulk</code></td><td>Bulk import and conversion</td><td>Uploads and starts asynchronous conversion of multiple TXT, CommonMark, or JSON files using one shared ISO language code. CoNLL-U is not supported. <code>corpusId</code> applies only to textual files; JSON files use <code>metadata.corpus</code> and may contain attestations. Returns <code>HTTP 202</code> with a <code>bulkId</code> and independent <code>fileId</code> values.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/bulk/{bulkId}/status</code></td><td>Bulk import status</td><td>Returns the aggregate status, counters, and outcome of each document in the bulk operation, including independent failures and JSON attestations that could not be saved.</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="api-service-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Multiple documents</span>
                <h3>Bulk deletion</h3>
            </div>
            <span class="service-count">2 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Function</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method delete">DELETE</span></td><td><code class="endpoint-code">/texts/bulk</code></td><td>Asynchronous bulk deletion</td><td>Validates a non-empty JSON list of unique <code>fileIds</code> and starts a job that independently applies the same complete deletion procedure used for a single text to every item. Returns <code>HTTP 202</code> and a <code>bulkId</code>.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/deletions/{bulkId}/status</code></td><td>Bulk deletion status</td><td>Returns status, counters, and the ordered outcome for each text: deleted, not found, or failed. An error affecting one item does not prevent subsequent items from being processed.</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="api-service-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Corpus lifecycle</span>
                <h3>Corpus management</h3>
            </div>
            <span class="service-count">3 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Function</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/texts/corpora</code></td><td>Create corpus</td><td>Creates an empty NIF corpus from a single TXT file containing only front matter with supported metadata. Returns the corpus record and the new <code>corpusId</code>.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/corpora/{corpusId}</code></td><td>Corpus details</td><td>Returns the corpus record, metadata, and the current list of documents belonging to the corpus.</td></tr>
                    <tr><td><span class="method delete">DELETE</span></td><td><code class="endpoint-code">/texts/corpora/{corpusId}</code></td><td>Delete corpus</td><td>Deletes the corpus NIF graph and persisted descriptor. Member texts are not deleted: they remain available and are detached from the corpus.</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="api-service-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Frequency metadata</span>
                <h3>Corpus frequency</h3>
            </div>
            <span class="service-count">2 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Function</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method put">PUT</span></td><td><code class="endpoint-code">/texts/{fileId}/total</code></td><td>Text frequency total</td><td>Creates or replaces, in the document graph, the total for one supported unit: <code>tokens</code>, <code>types</code>, <code>lemmas</code>, or <code>sentences</code>. The value must be a non-negative integer; totals for all other units remain unchanged.</td></tr>
                    <tr><td><span class="method put">PUT</span></td><td><code class="endpoint-code">/texts/corpora/{corpusId}/total</code></td><td>Corpus frequency total</td><td>Creates or replaces, in the corpus graph, the total for the specified frequency unit while preserving totals associated with the other units.</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="api-service-group corpus-services-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Stored representations</span>
                <h3>Text artifact downloads</h3>
            </div>
            <span class="service-count">6 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Function</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/nif</code></td><td>Download text NIF</td><td>Returns the document's NIF named graph serialized as Turtle.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/original</code></td><td>Download original</td><td>Returns the TXT, CommonMark, or JSON file originally uploaded.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/canonical</code></td><td>Download canonical text</td><td>Returns the normalized plain text used as <code>nif:isString</code> and as the reference representation for Unicode offsets.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/{fileId}/conllu</code></td><td>Download CoNLL-U</td><td>Returns the CoNLL-U file associated with the text, when available.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/corpora/{corpusId}/nif</code></td><td>Download corpus NIF</td><td>Returns the corpus NIF named graph serialized as Turtle.</td></tr>
                    <tr><td><span class="method get">GET</span></td><td><code class="endpoint-code">/texts/corpora/{corpusId}/original</code></td><td>Download corpus descriptor</td><td>Returns the original TXT file containing the metadata used to create the corpus.</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</div>`;

const ATTESTATION_API_HTML = `
<div class="content-block">
    <div class="corpus-api-header">
        <span class="api-eyebrow">FRAC attestation services</span>
        <h2>Attestation Services Documentation</h2>
        <p class="api-lead">These services create, retrieve, update, and delete FRAC attestations linked to NIF textual loci while keeping observable frequencies synchronized with the underlying textual evidence.</p>
    </div>

    <div class="api-service-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Attestation lifecycle</span>
                <h3>Creation</h3>
            </div>
            <span class="service-count">2 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Function</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/attestations</code></td><td>Batch creation by observable</td><td>Creates multiple FRAC attestations for the same observable at one or more positions in a text. The request requires <code>observable</code> and <code>corpus</code>, and optionally accepts <code>external</code> and <code>author</code>. The body is an array of occurrences containing <code>value</code>, <code>start</code>, and <code>end</code>. The complete request is validated atomically, NIF loci are created or reused, and the observable's frequency in the text is updated.</td></tr>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/attestations/by-locus</code></td><td>Batch creation by locus</td><td>Creates multiple attestations for different observables on the same textual interval. The request requires <code>corpus</code>, and optionally accepts <code>external</code> and <code>author</code>. The body contains <code>value</code>, <code>start</code>, <code>end</code>, and an <code>observables</code> list; each observable may carry its own RDF metadata. A single shared NIF locus is created or reused, and the frequencies of all affected observables are updated.</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="api-service-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Search and inspection</span>
                <h3>Retrieval</h3>
            </div>
            <span class="service-count">2 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Function</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/attestations/{fileId}</code></td><td>Attestations for a text</td><td>Returns a paginated list of attestations for the text identified by <code>fileId</code>, including the observable with its label and RDF types, frequency in the text, NIF locus, selected value, offsets, language, author, dates, and metadata. Optional query filters are <code>observable</code>, <code>observableType</code>, <code>author</code>, <code>limit</code>, and <code>offset</code>. The request may also include a JSON filter with nested <code>AND</code>/<code>OR</code> conditions over author, text metadata, and observable type. The default <code>limit</code> is 50.</td></tr>
                    <tr><td><span class="method post">POST</span></td><td><code class="endpoint-code">/attestations/by-observable</code></td><td>Attestations for an observable</td><td>Searches all document graphs for attestations of the IRI supplied through the required <code>observable</code> parameter. It returns the same paginated representation as the text-specific service, distinguishing the document, locus, and frequency associated with each attestation. It accepts <code>limit</code>, <code>offset</code>, and the shared optional JSON filter.</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="api-service-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Attestation maintenance</span>
                <h3>Update</h3>
            </div>
            <span class="service-count">2 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Function</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method post">PATCH</span></td><td><code class="endpoint-code">/attestations/{fileId}/locus</code></td><td>Update locus</td><td>Moves a single attestation to a new interval in the text. The body specifies <code>attestation</code>, <code>start</code>, <code>end</code>, and optionally <code>updateGloss</code>, which defaults to <code>true</code>. Offsets are interpreted as Unicode code points and the selected value is recalculated from the canonical text. The service creates or reuses the destination locus and preserves previous loci that are system-provided or still shared.</td></tr>
                    <tr><td><span class="method post">PATCH</span></td><td><code class="endpoint-code">/attestations/{fileId}/observable</code></td><td>Replace observable</td><td>Atomically replaces the observable associated with one or more attestations in the text. The body contains the new <code>observable</code> and a non-empty <code>attestations</code> list. The entire batch is validated before any write is performed, and the frequencies of both the new observable and the previous observables are recalculated.</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="api-service-group">
        <div class="api-section-heading">
            <div>
                <span class="api-eyebrow">Attestation lifecycle</span>
                <h3>Deletion</h3>
            </div>
            <span class="service-count">2 endpoints</span>
        </div>
        <div class="api-table-wrap">
            <table class="api-table">
                <thead><tr><th>Method</th><th>Endpoint</th><th>Function</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td><span class="method delete">DELETE</span></td><td><code class="endpoint-code">/attestations/{fileId}/by-observable</code></td><td>Delete by observable</td><td>Deletes some or all attestations of a specific observable from the text. The body contains <code>observable</code> and exactly one selection mode: a non-empty <code>attestations</code> list or <code>all: true</code>. The operation is atomic, updates the observable's frequency, and removes only orphaned loci generated by LexO; shared or pre-existing loci are preserved.</td></tr>
                    <tr><td><span class="method delete">DELETE</span></td><td><code class="endpoint-code">/attestations/{fileId}/by-locus</code></td><td>Delete by locus</td><td>Deletes some or all attestations associated with a specific NIF locus in the text. The body contains <code>locus</code> and exactly one selection mode: an <code>attestations</code> list or <code>all: true</code>. Frequencies are updated for every affected observable, and the locus is removed only when it was generated by the service and has become orphaned.</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="frontmatter-panel" style="grid-template-columns: 1fr;">
        <div class="frontmatter-copy">
            <span class="api-eyebrow">Common rules</span>
            <h3>Attestation semantics</h3>
            <p><code>{fileId}</code> selects the attestation named graph associated with a single text.</p>
            <p><code>start</code> is inclusive and <code>end</code> is exclusive. Both are Unicode code-point offsets calculated against the canonical <code>nif:isString</code> value.</p>
            <p>Supported observables are lexical entries, forms, lexical senses, and lexical concepts.</p>
            <p>Creation, update, and deletion operations automatically maintain the corresponding <code>frac:Frequency</code> resources.</p>
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

    const $servicesMenu = $('.dropdown-menu');
    $servicesMenu
        .html(`
            <li><a onclick="navigate('api-lexicon')">Lexicon API</a></li>
            <li><a onclick="navigate('api-attestation')">Attestation API</a></li>
            <li><a onclick="navigate('api-dictionary')">Dictionary API</a></li>
            <li><a onclick="navigate('api-ecd')">Explanatory Combinatorial Dictionary API</a></li>
            <li><a onclick="navigate('api-corpus')">Corpus API</a></li>
        `)
        .css('min-width', '400px');

    $servicesMenu.find('a').css('white-space', 'nowrap');

    if (!$('#api-attestation').length) {
        const $attestationSection = $('<section>', {
            id: 'api-attestation',
            class: 'corpus-api',
            html: ATTESTATION_API_HTML
        });

        const $lexiconSection = $('#api-lexicon');
        if ($lexiconSection.length) {
            $attestationSection.insertAfter($lexiconSection);
        } else {
            $('main').append($attestationSection);
        }
    }

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
