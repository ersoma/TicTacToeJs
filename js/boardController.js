function getBoardController(options){

    var defaults = {
        tableId: '#board',
        userWonId: '#user-won',
        computerWonId: '#computer-won',
        nobodyWonId: '#nobody-won'
    };
    options = $.extend({}, defaults, options || {});

    /* PRIVATE FUNCTIONS */

    function getField(fieldId){
        return $(options.tableId).find("td[data-index='" + fieldId + "']");
    }

    function isFieldEmpty(fieldId){
        var field = getField(fieldId);
        if(field.length !== 1){
            return false;
        }
        return field.hasClass("active") === true;
    }

    /* PUBLIC FUNCTIONS */

    var reset = function(){
        $(options.tableId).find("td").empty();
        $(options.tableId).find("td").append('<div class="x animate zoomIn" style="display:none"></div>');
        $(options.tableId).find("td").append('<div class="o animate zoomIn" style="display:none"></div>');
        $(options.tableId).find("td").addClass("active");
        $(options.userWonId).css("display", "none");
        $(options.computerWonId).css("display", "none");
        $(options.nobodyWonId).css("display", "none");
    };

    var setUserMove = function(fieldId){
        var field = getField(fieldId);
        if(isFieldEmpty(fieldId) === false){
            throw new Error("Field not empty.");
        }
        $(field).children(".x").css("display", "");
        $(field).animateCss('pulse');
        $(field).removeClass("active");

    };

    var setComputerMove = function(fieldId){
        var field = getField(fieldId);
        if(isFieldEmpty(fieldId) === false){
            throw new Error("Field not empty.");
        }
        $(field).children(".o").css("display", "")
        $(field).removeClass("active");
    };

    var displayUserWon = function(){
        $(options.userWonId).css("display", "");
    };

    var displayComputerWon = function(){
        $(options.computerWonId).css("display", "");
    };

    var displayNobodyWon = function(){
        $(options.nobodyWonId).css("display", "");
    };

    return {
        reset: reset,
        setUserMove: setUserMove,
        setComputerMove: setComputerMove,
        displayUserWon: displayUserWon,
        displayComputerWon: displayComputerWon,
        displayNobodyWon: displayNobodyWon
    }
}