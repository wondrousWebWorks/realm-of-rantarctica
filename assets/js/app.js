let gameData = [];
let playerShuffledDeck = [];
let aiShuffledDeck = [];
let currentPlayerCardIndex = 0;
let currentAICardIndex = 0;
let difficulty = sessionStorage.getItem("difficulty");
let time = difficulty === "HARD" ? 2 : difficulty === "MEDIUM" ? 4 : 2;
let isTimerRunning = true;

const musicElement = $( "#music" );
const currentMusicVolElement = $( "#current-music-vol" );
const soundFXElement = $( "#sound-fx" );
const currentSoundFXVolElement = $( "#current-sound-fx-vol" );
const currentlyPlayingTrackElement = $( "#currently-loaded-track" );
const aiValueElements = $( ".ai-attribute-value" );
const playerValueElements = $( ".player-attribute-value" );
const combinedAIAndPlayerValueElements = $( ".ai-attribute-value-combined-display" );

$(document).ready(function() {

    /**
     * Fetches game data from json file and writes response to global variable
     */
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

    /**
     * Loads the Home Page and hides all other screens
     */
    function loadHomePage() {
        $( "#full-screen-game-container-col" ).css("background", "url('https://res.cloudinary.com/wondrouswebworks/image/upload/v1576620176/realm-of-rantarctica/backgrounds/forest.png')");
        $( "#post-battle-page, #level-select-page, #battle-page" ).hide();
        $( "#landing-page" ).show();
    }

    /**
     * Hides Landing Page and shows Level Select Page
     */
    function loadLevelSelectScreen() {
        $( "#full-screen-game-container-col" ).css("background", "url('https://res.cloudinary.com/wondrouswebworks/image/upload/v1576620172/realm-of-rantarctica/backgrounds/mountainous-lake.png')");
        $( "#landing-page" ).hide();
        $( "#level-select-page" ).show();  
        $( "#level-select-page" ).toggleClass("set-flex-display-column");
        $( "#level-select-page" ).css("display", "flex"); 
    }

    /**
     * Loads Level Select cards
     * @param {{"lg-backgrounds": Array, "md-backgrounds": Array, "characters": Array, "music": Array, "sounds": Object}} gameData 
     */
    function loadLevelSelectCards(gameData) {

        for (let i = 1; i <= gameData["md-backgrounds"].length; i++) {
            $( `#bg-card-${i} img` ).attr("src", Object.values(gameData["md-backgrounds"][i - 1]));
            $( `#bg-card-${i}` ).attr("name", Object.keys(gameData["md-backgrounds"][i - 1]));
            $( `#bg-card-${i} h5` ).text(Object.keys(gameData["md-backgrounds"][i - 1]));
        }    
    }

    /**
     * Sets the user's chosen background
     * @param {jQuery} element 
     */
    function setChosenBattleBackground(element) {
        let chosenBattleGround = element[0].attributes.name.value;

        for (i = 0; i < 16; i++) {
            if(chosenBattleGround == Object.keys(gameData["lg-backgrounds"][i])) {
                $( "#full-screen-game-container-col" ).css("background", `url(${Object.values(gameData["lg-backgrounds"][i])})`);  
            }
        }
    }

    /**
     * Generates a random integer value between max and min values
     * @param {number} min 
     * @param {number} max 
     */
    function generateRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    /**
     * Sets a random background for the Battle screen
     */
    function setRandomBattleBackground() {
        let randomLevelInt = generateRandomInt(0, 15);

        $( "#full-screen-game-container-col" ).css("background", `url(${Object.values(gameData["lg-backgrounds"][randomLevelInt])})`);
    }

    /**
     * Loads the Battle Screen
     */
    function loadBattleScreen() {
        $( "#level-select-page" ).hide();
        $( "#battle-page" ).show();  
        $( "#battle-page" ).toggleClass("set-flex-display-column"); 

        writeShuffledDecksToExternalVariables(gameData);
        loadRoundContent();

        $( ".player-attribute" ).click((e) => {
            playSoundEffect(gameData["sounds"]["Sword Swing"]);
            cardValueClickEvent(e)
        });
    }

    /**
     * Shuffle a card deck using the Fisher-Yates (aka Knuth) Shuffle
     * @param {Array} cardArray 
     */
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

    /**
     * Writes attribute values to card for Player or AI
     * @param {Array} deck 
     * @param {string} playerOrAI 
     * @param {number} currentIndex 
     */
    function writeValuesToCard(deck, playerOrAI, currentIndex) {
        let cardValues = Object.values(Object.values(deck[currentIndex])[0][0]);
        
        for (let i = 0; i < playerValueElements.length; i ++ ) {
            if (playerOrAI === "ai") {
                combinedAIAndPlayerValueElements[i].innerText = cardValues[i];
                aiValueElements[i].innerText = cardValues[i];
            } else if (playerOrAI === "player") {
                playerValueElements[i].innerText = cardValues[i];
            }
        }
    }

    /**
     * Writes placeholder values to AI cards
     */
    function writeHiddenAIValuesToCard() {
        for (let i = 0; i < aiValueElements.length; i ++ ) {
            combinedAIAndPlayerValueElements[i].innerText = "?";
            aiValueElements[i].innerText = "?";
        }
    }

    /**
     * Displays either PLAYER or AI sprite and character name
     * @param {Object} deck 
     * @param {string} playerOrAI 
     * @param {number} currentIndex 
     */
    function displaySpriteAndCharacterName(deck, playerOrAI, currentIndex) {
        let currentCharacter = Object.values(deck[currentIndex]);
  
        let urlPrecursor = Object.values(currentCharacter[0]);
  
        let url = urlPrecursor[1]
  
        $( `#${playerOrAI}-sprite-name` ).text(Object.keys(deck[currentIndex]));
        $( `#${playerOrAI}-sprite` ).attr("src", url);
    }

    /**
     * Displays battle information
     * @param {string} info 
     */
    function displayBattleInfo(info) {
        $( "#battle-info" ).text(info);
    }

    /**
     * Shuffles card decks and copies them to external variables
     * @param {{"lg-backgrounds": Array, "md-backgrounds": Array, "characters": Array, "music": Array, "sounds": Object}} gameData 
     */
    function writeShuffledDecksToExternalVariables(gameData) {
             
        const playerCards = gameData["characters"].slice();
        const aiCards = gameData["characters"].slice();

        shuffleCards(playerCards);
        shuffleCards(aiCards);

        playerCards.forEach(card => {
            playerShuffledDeck.push(card);
        });

        aiCards.forEach(card => {
            aiShuffledDeck.push(card);
        });
    }

    /**
     * Displays a placeholder sprite and name for AI character
     */
    function displayHiddenAISpriteAndName() {
        $( `#ai-sprite-name` ).text("Unknown");
        $( "#ai-sprite" ).attr("src", "https://res.cloudinary.com/wondrouswebworks/image/upload/c_scale,h_325/v1578781031/realm-of-rantarctica/characters/question-mark.png");
    }

    /**
     * Displays the number if Player and AI cards
     */
    function displayCardCountValues() {
        $( ".card-count-player-value" ).text(playerShuffledDeck.length);
        $( ".card-count-ai-value" ).text(aiShuffledDeck.length);
    }

    /**
     * Loads and displays all info for each round
     */
    function loadRoundContent() {
        displayCardCountValues()

        writeValuesToCard(playerShuffledDeck, "player", currentPlayerCardIndex);
        writeHiddenAIValuesToCard();

        displaySpriteAndCharacterName(playerShuffledDeck, "player", currentPlayerCardIndex);
        displayHiddenAISpriteAndName();
        displayBattleInfo("FIGHT!");
    }

        // Handles the countdown for each round and displays the time value on screen
        function countdownTimer() {
            let timer = setInterval(function() {
                if (time < 1) {
                     $( "#timer" ).text("TIME'S UP");
                    clearInterval(timer);
                } else {
                    $( "#timer" ).text(time + "s");
                    time -= 1;
                }   
            },1000);
        }

        /**
         * Handles logic when the player wins a round
         */
        function handleRoundWin() {
            if (aiShuffledDeck.length > 1) {
                displayBattleInfo("YOU WIN!");
                let prize = aiShuffledDeck.splice(currentAICardIndex, 1);
                playerShuffledDeck = playerShuffledDeck.concat(prize);
      
                currentPlayerCardIndex += 1;
                
                if (currentAICardIndex >= aiShuffledDeck.length - 1) {
                    currentAICardIndex = 0;
                } 
      
                setTimeout(function() {
                    loadRoundContent();
                }, 3000);
            } else {
                loadPostBattleScreen("won");
                playSoundEffect(gameData["sounds"]["You Win"]);
            }
        }

    /**
     * Displays AI values and sprite, compares player and AI values, adjusts decks based on outcome, display round result and plays and appropriate audio file
     * @param {Event} e 
     */
    function cardValueClickEvent(e) {
        writeValuesToCard(aiShuffledDeck, "ai", currentAICardIndex);
        displaySpriteAndCharacterName(aiShuffledDeck, "ai", currentAICardIndex);
      
        const selectedAttributeClass = e.currentTarget.classList[1];
        const selectedAttributeValue = parseInt(e.currentTarget.lastElementChild.innerText);
        const targetAIAttribute = $( `#ai-attributes .${selectedAttributeClass}` );
        const selectedAttributeAIValue = parseInt(targetAIAttribute[0].lastElementChild.innerText);
      
        if (selectedAttributeValue > selectedAttributeAIValue) {
            handleRoundWin()
        } else if (selectedAttributeValue === selectedAttributeAIValue) {
            displayBattleInfo("DRAW!");
      
            if (currentPlayerCardIndex >= playerShuffledDeck.length -1) {
                currentPlayerCardIndex = 0;
            } else {
                currentPlayerCardIndex += 1;
            }
      
            if (currentAICardIndex >= aiShuffledDeck.length - 1) {
                currentAICardIndex = 0;
            } else {
                currentAICardIndex += 1;
            }
      
            setTimeout(function() {
                loadRoundContent();
            }, 2000);
      
        } else {
      
            if (playerShuffledDeck.length > 1) {
                displayBattleInfo("YOU LOSE!");
      
                let prize = playerShuffledDeck.splice(currentPlayerCardIndex, 1);
                aiShuffledDeck = aiShuffledDeck.concat(prize);
                
                
                if (currentPlayerCardIndex >= playerShuffledDeck.length -1) {
                    currentPlayerCardIndex = 0;
                } 
      
                currentAICardIndex += 1;
      
                setTimeout(function() {
                    loadRoundContent();
                }, 2000);
            } else {
                playSoundEffect(gameData["sounds"]["You Lose"]);
                loadPostBattleScreen("lost");
            }   
        }
      }

    /**
     * Loads the Post Battle screen
     * @param {string} result 
     */
    function loadPostBattleScreen(result) {
        $( "#battle-page" ).hide();
        $( "#post-battle-page" ).show(); 

        playerShuffledDeck = [];
        aiShuffledDeck = [];
        currentPlayerCardIndex = 0;
        currentAICardIndex = 0;
        
        if (result === "won") {
            $( "#post-battle-result" ).text("VICTORY!!!");
            $( "#post-battle-win-message" ).show();
            $( "#post-battle-win-image" ).show();
        } else if (result === "lost") {
            $( "#post-battle-result" ).text("DEFEAT!!!");
            $( "#post-battle-lose-message" ).show();
            $( "#post-battle-lose-image" ).show();
        }
    }
  
    /**
     * Sets the default difficulty
     */
    function setDefaultDifficulty() {
        sessionStorage.setItem("difficulty", "EASY");
    }

    /**
     * Saves the user's choice of difficulty to session storage
     * @param {string} difficulty 
     */
    function setSelectedDifficulty(difficulty) {
        sessionStorage.setItem("difficulty", difficulty);
    }

    /**
     * Sets the initial music volume to 50%
     */
    function setInitialMusicVol() {
        musicElement[0].volume = 0.5;
        currentMusicVolElement.text("50");
    }

    /**
     * Sets the initial sound effect volume to 20%
     */
    function setInitialSoundFXVol() {        
        soundFXElement[0].volume = 0.2; 
        currentSoundFXVolElement.text("20");
    }

    /**
     * Plays the currently loaded audio track
     */
    function playMusic() {
        musicElement[0].play();
    }

    /**
     * Pauses the currently playing audio track
     */
    function pauseMusic() {
        musicElement[0].pause();
    }

    /**
     * Changes music volume on user input
     */
    function setMusicVolume() {
        musicElement[0].volume = $(this)[0].valueAsNumber / 100; 
        currentMusicVolElement.text($(this)[0].valueAsNumber);
    }

    /**
     * Changes sound effect volume on user input
     */
    function setSoundFXVolume() {
        soundFXElement[0].volume = $(this)[0].valueAsNumber / 100; 
        currentSoundFXVolElement.text($(this)[0].valueAsNumber);
    }

    /**
     * Loads initial audio track
     * @param {{"lg-backgrounds": Array, "md-backgrounds": Array, "characters": Array, "music": Array, "sounds": Object}} gameData 
     */
    function loadInitialTrack(gameData) {
        musicElement.attr("src", Object.values(gameData["music"][3])[0]);
        sessionStorage.setItem("currentTrack", 3);
        currentlyPlayingTrackElement.text(Object.keys(gameData["music"][3])[0]);
    }

    /**
     * Loads next audio track
     * @param {{"lg-backgrounds": Array, "md-backgrounds": Array, "characters": Array, "music": Array, "sounds": Object}} gameData 
     */
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

    /**
     * Loads previous audio track
     * @param {{"lg-backgrounds": Array, "md-backgrounds": Array, "characters": Array, "music": Array, "sounds": Object}} gameData 
     */
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

    /**
     * Loads given source and plays sound effect
     * @param {string} path 
     */
    function playSoundEffect(path) {
        soundFXElement.attr("src", path);
        soundFXElement[0].play();
    }

    /**
     * Plays button-click animation on click of target
     * @param {jQuery} target 
     */
    function toggleButtonPressAnimation(target) {
        target.addClass("button-click");

        $( '.button-click' ).on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
            target.removeClass("button-click");
        });
    }

    /**
     * Displays Sound Info Modal unless user has set it not to display again
     */
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

    // Toggles the How To Play modal
    $( "#how-to-play-icon" ).click(function() {
        $( "#how-to-play-modal" ).modal('toggle');
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
    $( "#home-btn, #post-battle-result-btn" ).click(loadHomePage);

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

    $( ".level-btn, #audio-controls-toggle, #post-battle-result-btn ").mouseenter(function() {
        playSoundEffect(gameData["sounds"]["Click Pop High"]);
     });

     $( ".player-attribute ").mouseenter(function() {
        playSoundEffect(gameData["sounds"]["Tap"]);
     });

});