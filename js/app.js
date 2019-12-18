$(document).ready(function() {
    $( "#audio-controls-toggle" ).click(function() {
        $( "#audio-controls" ).toggle();
    });

    $( "#info-icon" ).click(function() {
        $( "#info-modal" ).modal();
    })
});