$(document).ready(function() {
    /* Gets window dimensions and return as an array [width, length] */
    function getWindowDimensions() {
        return [$(window).width(), $(window).height()];
    }

    /* Fetches game data from json file and takes a callback to do something with retrieved data */
    function getGameData(callback) {
        fetch("data/game_data.json")
            .then(response => {
                return response.json();
            })
            .then(gameData => {
                callback(gameData);
            })
            .catch(error => {
                alert("Failed to get game data.");
                console.log(error);
            });
    }

    /* Toggles the html audio control's visibility on clicking */
    $( "#audio-controls-toggle" ).click(function() {
        $( "#audio-controls" ).toggle();
    });

    /* Toggles the Information modal */
    $( "#info-icon" ).click(function() {
        $( "#info-modal" ).modal();
    });

    /* Loads Select Level screen */
    $( "#play-icon" ).click(function() {
        $( "#full-screen-game-container-col" ).css("background", "url('https://res.cloudinary.com/wondrouswebworks/image/upload/v1576620172/realm-of-rantarctica/backgrounds/bg-4_ox6ev7.png')");
        $( "#landing-page" ).hide();
        $( "#level-select-page" ).show();
    });

    $( "#target" ).click(function() {
        $( "#full-screen-game-container-col" ).css("background", "url('https://res.cloudinary.com/wondrouswebworks/image/upload/v1576620176/realm-of-rantarctica/backgrounds/forest-bg-1_lqrdux.png')");
        $( "#level-select-page" ).hide();
        $( "#landing-page" ).show();
    });
});