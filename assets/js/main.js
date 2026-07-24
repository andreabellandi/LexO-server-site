$(document).ready(function () {
    $('#services-trigger').on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $('.dropdown-menu').toggle();
    });

    $(document).on('click', function () {
        $('.dropdown-menu').hide();
    });
});

function navigate(sectionId) {
    $('section').removeClass('active');
    $('#' + sectionId).addClass('active');
    $('main').scrollTop(0);
}
