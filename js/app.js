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
        $( "#level-select-page" ).toggleClass("set-flex-display-column"); 
    }

    /* Loads the correct number of Level Select cards based on screen size - gets called as a callback in getData() */
    function loadLevelSelectCards(gameData) {
        let windowDimensions = getWindowDimensions();
        let cardCount = setLevelCardDisplayCount(windowDimensions); 
        for (let i = 1; i <= cardCount; i++) {
            $( `#bg-card-${i} img` ).attr("src", Object.values(gameData["md-backgrounds"][i - 1]));
            $( `#bg-card-${i}` ).attr("name", Object.keys(gameData["md-backgrounds"][i - 1]));
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

    /* Sets the user's chosen background for the Battle screen */
    function setChosenBattleBackground($element) {
        let chosenBattleGround = $element[0].attributes.name.value;

        getGameData(gameData => {
            for (i = 0; i < 12; i++) {
                if(chosenBattleGround == Object.keys(gameData["lg-backgrounds"][i])) {
                    $( "#full-screen-game-container-col" ).css("background", `url(${Object.values(gameData["lg-backgrounds"][i])})`);  
                }
            }
        })
    }

    /* Generates a random integer between 1 and 12 to select a random level to be loaded if the user chooses the Random Level option*/
    function generateRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    /* Sets a random background for the Battle screen */
    function setRandomBattleBackground() {
        let randomLevelInt = generateRandomInt(0, 11);
        getGameData(gameData => {
            $( "#full-screen-game-container-col" ).css("background", `url(${Object.values(gameData["lg-backgrounds"][randomLevelInt])})`);
        })
    }

    function loadBattleScreen() {
        $( "#level-select-page" ).hide();
        $( "#battle-page" ).show();  
        $( "#battle-page" ).toggleClass("set-flex-display-column"); 
        getGameData(handleCardLogic);
    }

    // Shuffle a card deck using the Fisher-Yates (aka Knuth) Shuffle
    function shuffleCards(cardArray) {
        let currentIndex = cardArray.length, temporaryValue, randomIndex;
        
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
        
            temporaryValue = cardArray[currentIndex];
            cardArray[currentIndex] = cardArray[randomIndex];
            cardArray[randomIndex] = temporaryValue;
        }
    }

    // Fetches elements for PLAYER or AI, and sets the attribute values for the appropriate player
    function writeValuesToCard(deck, playerOrAI) {
        let elementstoWriteValuesTo = document.getElementsByClassName(`${playerOrAI}-attribute-value`);
    
        let firstCharacter = Object.values(deck[0]);

        let shuffledCardValues = Object.values(firstCharacter[0][0]);
        
        for (let i = 0; i < elementstoWriteValuesTo.length; i ++ ) {
            elementstoWriteValuesTo[i].innerText = shuffledCardValues[i];
        }
    }

    // Displays either PLAYER or AI sprite and character name
    function displaySprite(deck, playerOrAI) {
        let firstCharacter = Object.values(deck[0]);

        let urlPrecursor = Object.values(firstCharacter[0]);

        let url = urlPrecursor[1]

        $( `#${playerOrAI}-sprite-name` ).text(Object.keys(deck[0]));
        $( `#${playerOrAI}-sprite-and-name-container` ).css("background", `url(${url})`);
        $( `#${playerOrAI}-sprite-and-name-container` ).css("background-repeat", "no-repeat");
        $( `#${playerOrAI}-sprite-and-name-container` ).css("background-position", "center");
    }

    // Handles all logic related to cards, including shuffling, writing values to cards, timing and displaying sprites
    function handleCardLogic(gameData) {
        // Retrieve characters from getGameData's json object and assign for player and AI       
        playerCards = gameData["characters"].slice();
        aiCards = gameData["characters"].slice();

        // Randomize Player and AI decks
        shuffleCards(playerCards);
        shuffleCards(aiCards);

        // Write card count for Player and AI to Battle Page
        $( ".card-count-player-value" ).text(playerCards.length);
        $( ".card-count-ai-value" ).text(aiCards.length);

        writeValuesToCard(playerCards, "player");
        writeValuesToCard(aiCards, "ai");
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

    /* Returns to Landing Page screen */
    $( "#home-btn" ).click(function() {
        $( "#full-screen-game-container-col" ).css("background", "url('https://res.cloudinary.com/wondrouswebworks/image/upload/v1576620176/realm-of-rantarctica/backgrounds/forest-bg-1_lqrdux.png')");
        $( "#level-select-page" ).hide();
        $( "#landing-page" ).show();
    });

    /* Sets the chosen background for the Battle Screen when clicked and launches Battle Screen*/
    $( ".card ").click(function() {
        setChosenBattleBackground($(this));
        loadBattleScreen();    
    });

    /* Sets a random background for the Battle Screen when clicked and launches Battle Screen*/
    $( ".random-level-btn" ).click(() => {
        setRandomBattleBackground();
        loadBattleScreen();
    });
});