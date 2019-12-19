$(document).ready(function() {
    /* Toggles the html audio control's visibility on clicking */
    $( "#audio-controls-toggle" ).click(function() {
        $( "#audio-controls" ).toggle();
    });

    /* Adds the landingPage string literal as the full-screen-game container's html */
    $( "#full-screen-game" ).html(landingPage);

    /* Toggles the Information modal */
    $( "#info-icon" ).click(function() {
        $( "#info-modal" ).modal();
    });

});