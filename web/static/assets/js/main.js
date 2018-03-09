$(document).ready(function () {

    $('#medicine_information_btn').click(function () {
        showView("medicine_information_sec")
    });

    $('#authority_btn').click(function () {
        showView("authority_sec")
    });

    $('#produce_med_btn').click(function () {
        showView("produce_med_sec")
    });

    function showView(viewName) {
        $('main > section').hide();
        $('#' + viewName).show();
    }






});
