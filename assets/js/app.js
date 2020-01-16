let gameData = [];
let playerShuffledDeck = [];
let aiShuffledDeck = [];

const musicElement = $( "#music" );
let currentMusicVolElement = $( "#current-music-vol" );
const soundFXElement = $( "#sound-fx" );
let currentSoundFXVolElement = $( "#current-sound-fx-vol" );
let currentlyPlayingTrackElement = $( "#currently-loaded-track" );

$(document).ready(function() {
    // Gets window dimensions and return as an array [width, length]
    function getWindowDimensions() {
        return [$(window).width(), $(window).height()];
    }

    // Fetches game data from json file and takes a callback to do something with retrieved data
    function getGameData() {
        fetch("assets/data/gameData.json")
            .then(response => {
                return response.json();
            })
            .then(fetchedData => {
                gameData = fetchedData;
            })
            .catch(error => {
                alert("Failed to get game data.");
                console.log(error);
            });
    }

    // Hides Landing Page and shows Level Select Page without any Level Select Cards
    function loadLevelSelectScreen() {
        $( "#full-screen-game-container-col" ).css("background", "url('https://res.cloudinary.com/wondrouswebworks/image/upload/v1576620172/realm-of-rantarctica/backgrounds/bg-4_ox6ev7.png')");
        $( "#landing-page" ).hide();
        $( "#level-select-page" ).show();  
        $( "#level-select-page" ).toggleClass("set-flex-display-column");
        $( "#level-select-page" ).css("display", "flex"); 
    }

    // Loads the correct number of Level Select cards based on screen size - gets called as a callback in getData()
    function loadLevelSelectCards(gameData) {

        for (let i = 1; i <= gameData["md-backgrounds"].length; i++) {
            $( `#bg-card-${i} img` ).attr("src", Object.values(gameData["md-backgrounds"][i - 1]));
            $( `#bg-card-${i}` ).attr("name", Object.keys(gameData["md-backgrounds"][i - 1]));
            $( `#bg-card-${i} h5` ).text(Object.keys(gameData["md-backgrounds"][i - 1]));
        }    
    }

    // Sets the user's chosen background for the Battle screen
    function setChosenBattleBackground($element) {
        let chosenBattleGround = $element[0].attributes.name.value;

        for (i = 0; i < 12; i++) {
            if(chosenBattleGround == Object.keys(gameData["lg-backgrounds"][i])) {
                $( "#full-screen-game-container-col" ).css("background", `url(${Object.values(gameData["lg-backgrounds"][i])})`);  
            }
        }
    }

    // Generates a random integer between 1 and 12 to select a random level to be loaded if the user chooses the Random Level option
    function generateRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    // Sets a random background for the Battle screen
    function setRandomBattleBackground() {
        let randomLevelInt = generateRandomInt(0, 11);

        $( "#full-screen-game-container-col" ).css("background", `url(${Object.values(gameData["lg-backgrounds"][randomLevelInt])})`);
    }

    // Loads the Battle Screen and related Battle logic
    function loadBattleScreen() {
        $( "#level-select-page" ).hide();
        $( "#battle-page" ).show();  
        $( "#battle-page" ).toggleClass("set-flex-display-column"); 

        let windowDimension = getWindowDimensions();

        if (windowDimension[0] <= 576) {
            $( "#player-attributes-col" ).removeClass("col-4");
            $( "#player-attributes-col" ).addClass("col-12");

            $( "#card-count-col" ).removeClass("col-4");
            $( "#card-count-col" ).addClass("col-12");
        }
        battle();
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

    function writeHiddenAIValuesToCard() {
        let aiValueElements = document.getElementsByClassName("ai-attribute-value");

        for (let i = 0; i < aiValueElements.length; i ++ ) {
            aiValueElements[i].innerText = "?";
        }
    }

    // Displays either PLAYER or AI sprite and character name
    function displaySpriteAndCharacterName(deck, playerOrAI) {
        let firstCharacter = Object.values(deck[0]);

        let urlPrecursor = Object.values(firstCharacter[0]);

        let url = urlPrecursor[1]

        $( `#${playerOrAI}-sprite-name` ).text(Object.keys(deck[0]));
        $( `#${playerOrAI}-sprite` ).attr("src", url);
    }

    // Handles the countdown for each round and displays the time value on screen
    function countdownTimer() {
        let difficulty = sessionStorage.getItem("difficulty");
        let time;
        
        if (difficulty === "EASY") {
            time = 8;
        } else if (difficulty === "MEDIUM") {
            time = 4;
        } else if (difficulty === "HARD") {
            time = 2;
        }

        let timer = setInterval(function() {
            if (time < 1) {
                 $( "#timer" ).text("TIME'S UP");
                // $( "#battle-info" ).css("visibility", "visible");
                clearInterval(timer);
                // $( "#timer" ).text("0");
            } else {
                $( "#timer" ).text(time + "s");
                time -= 1;
            }   
        },1000);
    }

    // Displays battle information, such as instructions or feedback after each round
    function displayBattleInfo(info) {
        $( "#battle-info" ).text(info);
    }

    // Writes shuffled decks entries to external variables for further use
    function writeShuffledDecksToExternalVariables(gameData) {
             
        playerCards = gameData["characters"].slice();
        aiCards = gameData["characters"].slice();

        // Randomize Player and AI decks
        shuffleCards(playerCards);
        shuffleCards(aiCards);

        playerCards.forEach(card => {
            playerShuffledDeck.push(card);
        });

        aiCards.forEach(card => {
            aiShuffledDeck.push(card);
        });
    }

    // Displays a question mark as AI sprite and sets the AI character name as UNKNOWN
    function displayHiddenAISpriteAndName() {
        $( `#ai-sprite-name` ).text("Unknown");
        $( "#ai-sprite" ).attr("src", "https://res.cloudinary.com/wondrouswebworks/image/upload/c_scale,h_325/v1578781031/realm-of-rantarctica/characters/Pngtree_question_mark_vector_icon_4236432_m6naqr.png");
    }

    // Displays the player and ai number of cards in its container
    function displayCardCountValues() {
        $( ".card-count-player-value" ).text(playerShuffledDeck.length);
        $( ".card-count-ai-value" ).text(aiShuffledDeck.length);
    }

    // Loads all content for first round, except background which is handled elsewhere
    function loadFirstRoundContent() {
        setTimeout(function() {
            displayCardCountValues()

            writeValuesToCard(playerShuffledDeck, "player");
            writeHiddenAIValuesToCard();

            displaySpriteAndCharacterName(playerShuffledDeck, "player");
            displayHiddenAISpriteAndName();
        }, 1000);
    }

    // On click of player attribute, displays AI values and sprite, compares
    // player and AI values, adjusts decks based on outcome, display round
    // result and plays and appropriate audio file
    function cardValueClickEvent(e) {
        setTimeout(function() {
            let selectedAttributeName = e.currentTarget.children[0].innerText;
            let selectedAttributeValue = e.currentTarget.children[1].innerText;
            let selectedAttributeAIValue = Object.values(aiShuffledDeck[0])[0][0][selectedAttributeName];
    
            console.log(selectedAttributeValue);
            console.log(selectedAttributeAIValue);
        }, 500);
        let selectedAttributeName = e.currentTarget.children[0].innerText;
        let selectedAttributeValue = e.currentTarget.children[1].innerText;
        let selectedAttributeAIValue = Object.values(aiShuffledDeck[0])[0][0][selectedAttributeName];

        console.log(selectedAttributeValue);
        console.log(selectedAttributeAIValue);
        writeValuesToCard(aiShuffledDeck, "ai");
        displaySpriteAndCharacterName(aiShuffledDeck, "ai");

        setTimeout(function() {
            if (selectedAttributeValue > selectedAttributeAIValue) {
                displayBattleInfo("YOU WIN!");
    
                let prize = aiShuffledDeck.shift();
                playerShuffledDeck.push(prize);
                
                displayCardCountValues();
    
                soundFXElement.setAttribute("src", "assets/audio/zapsplat_multimedia_male_voice_processed_says_you_win_001_21572.mp3");
                soundFXElement.play();
            } else if (selectedAttributeValue === selectedAttributeAIValue) {
                displayBattleInfo("DRAW!");
            } else if (selectedAttributeValue < selectedAttributeAIValue) {
                displayBattleInfo("YOU LOSE!");
    
                let prize = playerShuffledDeck.shift();
                aiShuffledDeck.push(prize);
                
                displayCardCountValues();
    
                soundFXElement.setAttribute("src", "assets/audio/zapsplat_multimedia_male_voice_processed_says_you_lose_21571.mp3");
                soundFXElement.play();
            }
        }, 1000);
       
    }

    // Handles the main battle logic
    function battle() {
        writeShuffledDecksToExternalVariables(gameData);
        loadFirstRoundContent();

        $( ".player-attribute" ).click((e) => {
            cardValueClickEvent(e)
        });
    }
        
    // Saves the default difficulty of EASY in session storage
    function setDefaultDifficulty() {
        sessionStorage.setItem("difficulty", "EASY");
    }

    // Saves the user's choice of difficulty in session storage
    function setSelectedDifficulty(difficulty) {
        sessionStorage.setItem("difficulty", difficulty);
    }

    // Sets the initial volume for the #music audio component at 50%
    function setInitialMusicVol() {
        musicElement[0].volume = 0.5;
        currentMusicVolElement.text("50");
    }

    // Sets the initial volume for the #sound-fx element to 20% on page load
    function setInitialSoundFXVol() {        
        soundFXElement[0].volume = 0.2; 
        currentSoundFXVolElement.text("20");
    }

    // Plays the currently loaded track on #play-track icon click
    function playMusic() {
        musicElement[0].play();
    }

    // Pauses the track currently playing in #music audio element
    function pauseMusic() {
        musicElement[0].pause();
    }

    // Sets the volume for the #music audio element based on the #music-vol-control ranged input
    function setMusicVolume() {
        musicElement[0].volume = $(this)[0].valueAsNumber / 100; 
        currentMusicVolElement.text($(this)[0].valueAsNumber);
    }

    // Sets the volume for the #msound-fx audio element based on the #sound-fx-vol-control ranged input
    function setSoundFXVolume() {
        soundFXElement[0].volume = $(this)[0].valueAsNumber / 100; 
        currentSoundFXVolElement.text($(this)[0].valueAsNumber);
    }

    // Loads the first track in game_data.json on page load and writes the index to sessionStorage
    function loadInitialTrack(gameData) {
        musicElement.attr("src", Object.values(gameData["music"][3])[0]);
        sessionStorage.setItem("currentTrack", 3);
        currentlyPlayingTrackElement.text(Object.keys(gameData["music"][3])[0]);
    }

    // Loads the next track in game_data.json and writes the new index to sessionStorage
    function loadNextTrack(gameData) {
        let currentIndex = parseInt(sessionStorage.getItem("currentTrack"));
    
        if (currentIndex < (gameData["music"].length - 1)) {
            let newIndex = currentIndex + 1;
            musicElement.attr("src", Object.values(gameData["music"][newIndex])[0]);
            sessionStorage.setItem("currentTrack", newIndex);
            currentlyPlayingTrackElement.text(Object.keys(gameData["music"][newIndex])[0]);
        } else {
            musicElement.attr("src", Object.values(gameData["music"][0])[0]);
            sessionStorage.setItem("currentTrack", 0);
            currentlyPlayingTrackElement.text(Object.keys(gameData["music"][0])[0]);
        }
    
        musicElement[0].play();
    }
    // Loads the previous track in game_data.json and writes the new index to sessionStorage
    
    function loadPreviousTrack(gameData) {
        let currentIndex = parseInt(sessionStorage.getItem("currentTrack"));
    
        if (currentIndex >= 1) {
            let newIndex = currentIndex - 1;
            musicElement.attr("src", Object.values(gameData["music"][newIndex])[0]);
            sessionStorage.setItem("currentTrack", newIndex);
            currentlyPlayingTrackElement.text(Object.keys(gameData["music"][newIndex])[0]);
        } else {
            musicElement.attr("src", Object.values(gameData["music"][(gameData["music"].length - 1)])[0]);
            sessionStorage.setItem("currentTrack", gameData["music"].length - 1);
            currentlyPlayingTrackElement.text(Object.keys(gameData["music"][(gameData["music"].length - 1)])[0]);
        }
    
        musicElement[0].play();
    }

    function playSoundEffect(path) {
        soundFXElement.attr("src", path);
        soundFXElement[0].play();
    }

    // Plays button-click animation on click of target
    function toggleButtonPressAnimation(target) {
        target.addClass("button-click");

        $( '.button-click' ).on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
            target.removeClass("button-click");
        });
    }

    function checkOrSetSoundInfoModalDisplay() {
        let checkedValue = localStorage.getItem("checkBoxValue");
        
        if (checkedValue === "true") {
            $( "#sound-info-modal" ).modal("hide");
        } else {
            $( "#sound-info-modal" ).modal("show");
        }
    }

    // *******************  END OF FUNCTION DECLARATIONS  **********************
    getGameData();
    checkOrSetSoundInfoModalDisplay();
    setDefaultDifficulty();
    setInitialMusicVol();
    setInitialSoundFXVol();
    setTimeout(function() {
        loadInitialTrack(gameData);
    }, 500);
    
    $("#sound-info-modal").on('hidden.bs.modal', function(){
        let checkedValue = document.getElementById("show-or-hide-sound-info-modal").checked;
        localStorage.setItem("checkBoxValue", checkedValue);
    });

    // Toggles the html audio control's visibility on clicking
    $( "#audio-controls-toggle" ).click(function() {
        $('#audio-modal').modal('toggle');
    });

    $( "#music-vol-control" ).on("input", setMusicVolume);

    $( "#sound-fx-vol-control" ).on("input", setSoundFXVolume);

    $( "#play-track" ).click(function() {
        playMusic();
        toggleButtonPressAnimation($(this));
    });

    $( "#pause-track" ).click(function() {
        pauseMusic();
        toggleButtonPressAnimation($(this));
    });

    $( "#next-track" ).click(function() {
        loadNextTrack(gameData);
        toggleButtonPressAnimation($(this));
    });

    $( "#previous-track" ).click(function() {
        loadPreviousTrack(gameData);
        toggleButtonPressAnimation($(this));
    });

    // Toggles the Information modal
    $( "#info-icon" ).click(function() {
        $( "#info-modal" ).modal('toggle');
    });

    // Sets the user's selected difficulty in session storage on click and adds .selected-difficulty-btn
    $( ".difficulty-btn" ).click(function() {
        setSelectedDifficulty($(this)[0].innerText);
        $( ".difficulty-btn" ).removeClass("selected-difficulty-btn");
        $(this).addClass("selected-difficulty-btn");
    });

    // Loads Select Level screen
    $( "#play-icon" ).click(function() {
        loadLevelSelectScreen();
        loadLevelSelectCards(gameData);
    });

    // Returns to Landing Page screen
    $( "#home-btn" ).click(function() {
        $( "#full-screen-game-container-col" ).css("background", "url('https://res.cloudinary.com/wondrouswebworks/image/upload/v1576620176/realm-of-rantarctica/backgrounds/forest-bg-1_lqrdux.png')");
        $( "#level-select-page" ).hide();
        $( "#landing-page" ).show();
    });

    // Sets the chosen background for the Battle Screen when clicked, launches Battle Screen and plays sound
    $( ".card ").click(function() {
        playSoundEffect(gameData["sounds"]["Sword Swing"]);
        setChosenBattleBackground($(this));
        loadBattleScreen();    
    });

    // Plays a sword swish sound on mouseenter of .card
    $( ".card img ").mouseenter(function() {
       playSoundEffect(gameData["sounds"]["Click Pop Low"]);
    });

    // Sets a random background for the Battle Screen when clicked and launches Battle Screen
    $( ".random-level-btn" ).click(() => {
        playSoundEffect(gameData["sounds"]["Sword Swing"]);
        setRandomBattleBackground();
        loadBattleScreen();
    });

});