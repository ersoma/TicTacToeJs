function getPersistenceController(options){

    options = options || {};
    if(typeof options.gameController === "undefined"){
        throw new Error("Missing argument: gameController");
    }

    var localStorageKey = "ttt-game";
    var localStorageSupported = typeof(Storage) !== "undefined";

    /* PUBLIC FUNCTIONS */

    var saveGame = function(){
        localStorage.setItem(localStorageKey, gameController.exportGame());
    }

    var loadGame = function(){
        gameController.importGame(localStorage.getItem(localStorageKey));
    }

    var clearSavedGame = function(){
        localStorage.removeItem(localStorageKey);
    }

    return {
        saveGame: localStorageSupported ? saveGame : function(){},
        loadGame: localStorageSupported ? loadGame : function(){},
        clearSavedGame: localStorageSupported ? clearSavedGame : function(){}
    }
}