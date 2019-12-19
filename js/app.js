$(document).ready(function() {
    $( "#audio-controls-toggle" ).click(function() {
        $( "#audio-controls" ).toggle();
    });

    $( "#full-screen-game" ).html(landingPage);

    $( "#info-icon" ).click(function() {
        $( "#info-modal" ).modal();
    });

});