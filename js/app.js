$(document).ready(function() {
    /* Gets window dimensions and return as an array [width, length] */
    function getWindowDimensions() {
        return [$(window).width(), $(window).height()];
    }

    /* Sets the number of Level Select Cards to be displayed at once on screen based on window dimensions */
    function setLevelCardDisplayCount(windowDimensions) {
        if(windowDimensions[0] > 1200) {
            return 6;
        } else if (windowDimensions[0] >= 768) {
            return 4;
        } else {
            return 2;
        }
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

    /* Hides Landing Page and shows Level Select Page without any Level Select Cards */
    function loadLevelSelectScreen() {
        $( "#full-screen-game-container-col" ).css("background", "url('https://res.cloudinary.com/wondrouswebworks/image/upload/v1576620172/realm-of-rantarctica/backgrounds/bg-4_ox6ev7.png')");
        $( "#landing-page" ).hide();
        $( "#level-select-page" ).show();  
        $( "#level-select-page" ).css("display", "flex");
        $( "#level-select-page" ).css("flex-direction", "column");    
        $( "#level-select-page" ).css("justify-content", "space-between");
        $( "#level-select-page" ).css("align-items", "center");    
    }

    /* Loads the correct number of Level Select cards based on screen size - gets called as a callback in getData() */
    function loadLevelSelectCards(gameData) {
        let windowDimensions = getWindowDimensions();
        let cardCount = setLevelCardDisplayCount(windowDimensions); 
        for (let i = 1; i <= cardCount; i++) {
            $( `#bg-card-${i} img` ).attr("src", Object.values(gameData["md-backgrounds"][i - 1]));
            $( `#bg-card-${i} h5` ).text(Object.keys(gameData["md-backgrounds"][i - 1]));
            
  
            if(cardCount === 6) {
                $( `#bg-card-${i}` ).addClass("col-4");
            } else if (cardCount === 4) {
                $( `#bg-card-${i}` ).addClass("col-6");
            } else {
                $( `#bg-card-${i}` ).addClass("col-12");
            }
            $( `#bg-card-${i}` ).css("display", "inline-block");
            $( `#bg-card-${i}` ).show();
  
        }    
    }

    /* Generates a random integer between 1 and 12 to select a random level to be loaded if the user chooses the Random Level option*/
    function generateRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
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
        loadLevelSelectScreen();
        getGameData(loadLevelSelectCards);
    });

    $( "#target" ).click(function() {
        $( "#full-screen-game-container-col" ).css("background", "url('https://res.cloudinary.com/wondrouswebworks/image/upload/v1576620176/realm-of-rantarctica/backgrounds/forest-bg-1_lqrdux.png')");
        $( "#level-select-page" ).hide();
        $( "#landing-page" ).show();
    });
});