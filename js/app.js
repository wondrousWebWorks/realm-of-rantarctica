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

    /* Loads Select Level screen */
    $( "#play-icon" ).click(function() {
        $( "#full-screen-game-container-col" ).css("background", "url('https://res.cloudinary.com/wondrouswebworks/image/upload/v1576620172/realm-of-rantarctica/backgrounds/bg-4_ox6ev7.png')");
        $( "#full-screen-game" ).html(levelSelectOne);
    });

});