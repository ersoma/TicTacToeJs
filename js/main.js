// instantiate controllers
var boardController = getBoardController();
var gameController = getGameController({
    boardController: boardController,
    stepEndedHandler: stepEndedHandler,
    gameEndedHandler: gameEndedHandler
});
var persistenceController = getPersistenceController({
    gameController: gameController
});

// initialize the game and set event handlers
$(function(){
    gameController.reset();
    persistenceController.loadGame();
    $("#reset-game").on('click', resetTheGameHandler);
    $("#board td").on('click', fieldClickHandler);
    $("#user-won button, #computer-won button, #nobody-won button").on('click', gameController.reset);
});

// event handlers
function resetTheGameHandler(e){
    persistenceController.clearSavedGame();
    gameController.reset();
    return false;
}

function fieldClickHandler(e){
    if( $(e.target).hasClass("active") === false ) {
        return;
    }
    var fieldId = $(e.target).data("index");
    persistenceController.saveGame();
    gameController.computeNextStep(fieldId);
}

function stepEndedHandler(){
    persistenceController.saveGame();
}

function gameEndedHandler(){
    persistenceController.clearSavedGame();
}