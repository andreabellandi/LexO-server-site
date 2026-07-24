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

    const $vocaboProject = $('#projects .project-row').first();
    $vocaboProject.find('.project-icon').attr({
        src: 'assets/images/vocabo-icon.png',
        alt: 'VocaBO project icon'
    });
    $vocaboProject.find('.project-title-col').css('align-self', 'center');
});

function navigate(sectionId) {
    $('section').removeClass('active');
    $('#' + sectionId).addClass('active');
    $('main').scrollTop(0);
}
