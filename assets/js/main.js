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

    const $ecdMenuItem = $('.dropdown-menu a')
        .filter(function () {
            return $(this).text().trim() === 'ECD API';
        })
        .closest('li');

    if (!$('.dropdown-menu a').filter(function () {
        return $(this).text().trim() === 'Corpus API';
    }).length) {
        $('<li><a onclick="navigate(\'api-corpus\')">Corpus API</a></li>')
            .insertBefore($ecdMenuItem);
    }

    if (!$('#api-corpus').length) {
        const $section = $('<section>', {
            id: 'api-corpus',
            class: 'corpus-api',
            html: '<div class="content-block"><p>Loading Corpus API documentation…</p></div>'
        });

        const $ecdSection = $('#api-ecd');
        if ($ecdSection.length) {
            $section.insertBefore($ecdSection);
        } else {
            $('main').append($section);
        }

        fetch('assets/content/corpus-api.html')
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.text();
            })
            .then(function (html) {
                $section.html(html);
            })
            .catch(function () {
                $section.html(
                    '<div class="content-block"><h2>Corpus and Text Services Documentation</h2>' +
                    '<p>The documentation could not be loaded. Serve the website through a local HTTP server rather than opening index.html directly.</p></div>'
                );
            });
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
