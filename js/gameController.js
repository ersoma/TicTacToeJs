function getGameController(options){

    options = options || {};
    if(typeof options.boardController === "undefined"){
        throw new Error("Missing argument: boardController");
    }
    if(typeof options.stepEndedHandler === "undefined"){
        throw new Error("Missing argument: stepEndedHandler");
    }
    if(typeof options.gameEndedHandler === "undefined"){
        throw new Error("Missing argument: gameEndedHandler");
    }

    var fieldTypes = {
        empty: 0,
        user: 1,
        computer: 4
    };
    var winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [6, 4, 2]
    ];
    var board = [
        fieldTypes.empty, fieldTypes.empty, fieldTypes.empty,
        fieldTypes.empty, fieldTypes.empty, fieldTypes.empty,
        fieldTypes.empty, fieldTypes.empty, fieldTypes.empty
    ];

    /* PRIVATE FUNCTIONS */

    function didUserWin(){
        for(var i = 0; i < winningCombinations.length; i++){
            var isFirstUsers = board[winningCombinations[i][0]] === fieldTypes.user;
            var isSecondUsers = board[winningCombinations[i][1]] === fieldTypes.user;
            var isThirdUsers = board[winningCombinations[i][2]] === fieldTypes.user;
            if(isFirstUsers && isSecondUsers && isThirdUsers){
                return true;
            }
        }
        return false;
    }

    function canComputerMove(){
        for(var i = 0; i < board.length; i++){
            if(board[i] === fieldTypes.empty){
                return true;
            }
        }
        return false;
    }

    function getWinningFieldId(){
        for(var i = 0; i < winningCombinations.length; i++){
            var sum = $.reduce(winningCombinations[i], function(a, b){ return a + board[b] }, 0);
            if(sum === 8){
                return winningCombinations[i].sort(function (i, j) {  return board[i] - board[j]; })[0];
            }
        }
        return null;
    }

    function getBlockingFieldId(){
        for(var i = 0; i < winningCombinations.length; i++){
            var sum = $.reduce(winningCombinations[i], function(a, b){ return a + board[b] }, 0);
            if(sum === 2){
                return winningCombinations[i].sort(function (i, j) {  return board[i] - board[j]; })[0];
            }
        }
        return null;
    }

    function getRandomFieldId(){
        var emptyFieldIds = [];
        for(var i = 0; i < board.length; i++){
            if(board[i] === fieldTypes.empty){
                emptyFieldIds.push(i);
            }
        }
        var randomIndex = Math.floor(Math.random() * emptyFieldIds.length);
        return emptyFieldIds[randomIndex];
    }

    /* PUBLIC FUNCTIONS */

    var reset = function(){
        $.each(board, function(index, value){ board[index] = fieldTypes.empty });
        options.boardController.reset();
    };

    var exportGame = function(){
        return JSON.stringify(board);
    };

    var importGame = function(boardSerialized){
        if(boardSerialized === null) {
            return;
        }
        try {
            board = JSON.parse(boardSerialized);
        } catch(e){
            return;
        }
        for(var i = 0; i < board.length; i++){
            if(board[i] === fieldTypes.computer){
                boardController.setComputerMove(i);
            }
            if(board[i] === fieldTypes.user){
                boardController.setUserMove(i);
            }
        }
    };

    /**
     * The next step the computer takes is calculated by this algirithm:
     *  1. add the user's step to the board
     *  2. if the user won the game show the results
     *  3. if the user didn't win check if there are empty fields left or the game is a draw
     *  4. if there are free fields check if the computer can win in one step
     *  5. if the computer can't win in one step check if it can loose in one step
     *  6. if the computer can't loose in one step select a random free field
     */
    var computeNextStep = function(fieldId){
        // 1.
        board[fieldId] = fieldTypes.user;
        options.boardController.setUserMove(fieldId);
        // 2.
        if(didUserWin() === true){
            options.boardController.displayUserWon();
            options.gameEndedHandler();
            return;
        }
        // 3.
        if(canComputerMove() === false){
            options.boardController.displayNobodyWon();
            options.gameEndedHandler();
            return;
        }
        // 4.
        var winningFieldId = getWinningFieldId();
        if(winningFieldId !== null){
            board[winningFieldId] = fieldTypes.computer;
            options.boardController.setComputerMove(winningFieldId);
            options.boardController.displayComputerWon();
            options.gameEndedHandler();
            return;
        }
        // 5.
        var blockingFieldId = getBlockingFieldId();
        if(blockingFieldId !== null){
            board[blockingFieldId] = fieldTypes.computer;
            options.boardController.setComputerMove(blockingFieldId);
            options.stepEndedHandler();
            return;
        }
        // 6.
        var randomFieldId = getRandomFieldId();
        board[randomFieldId] = fieldTypes.computer;
        options.boardController.setComputerMove(randomFieldId);
        options.stepEndedHandler();
    };

    return {
        reset: reset,
        exportGame: exportGame,
        importGame: importGame,
        computeNextStep: computeNextStep
    }
}