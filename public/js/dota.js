//Basic JSON object for testing -- will come from db
var timer = {
    Author: "Tyler",
    Created: 25,
    Data: [
        {
            time: 10,
            action: "ward"
        },
        {
            time: 20,
            action: "check map"
        },
        {
            time: 30,
            action: "get bounty"
        },
        {
            time: 50,
            action: "get bounty"
        },
        {
            time: 100,
            action: "stack camps"
        },
        {
            time: 120,
            action: "last action"
        }
    ]
}

var testDota;

$(document).ready(function(){
    
    var displayTest = $('#timer'),
        startButton = $('#timer-start'),
        mainDisplay = $('.main-display');

    var ajaxTimer;

    $.getJSON("https://dota-timer.herokuapp.com/api")
    .then(function(data) {
        console.log(data.timer1);
        ajaxTimer = data.timer1;
        testDota = new Dota(displayTest, startButton, mainDisplay, ajaxTimer);
        testDota.init();    
    })
    .catch(function(err){
        console.log(err);
    })
    

    
    
});

function Dota(timerDisplay, startButton, mainDisplay, timerImport) {
    
    this.timerDisplay = timerDisplay;
    this.startButton = startButton;
    this.mainDisplay = mainDisplay;
    this.timerImport = timerImport;

    let elapsedTimeSec = 0;
    let lastEventTime = -1;
    let eventCache = null;
    let timeController = null;
    let initMutex = 1;
    
    function updateTimer(time) {
        timerDisplay.text(buildTimeString(time));
    }

    function appendToList(action) {
        mainDisplay.append(`<li>${action}</li>`);
    }

    function initButton() {
        startButton.on('click', () => {
            initMutex--;
            if (initMutex === 0) {
                timerConfig();
            } else {
                alert("Error starting timer");
            }
        });
    }

    function importData(timerImport) {
        let importData = timerImport.Data;
        lastEventTime = importData[importData.length - 1].time;
        eventCache = new Array(lastEventTime);
        eventCache.fill(-1);
        importData.forEach((event) => {
            eventCache[event.time] = event.action;
        });
    }

    function resolveTime(elapsedTime) {
        let currentAction = eventCache[elapsedTime];
        console.log(`Time: ${elapsedTime}, Action: ${currentAction}`);
        if (currentAction !== -1) {
            appendToList(currentAction);
        }
        if (elapsedTime === lastEventTime) {
            clearInterval(timeController);
        }
    }

    function buildTimeString(elapsedTime) {
        let minutes = Math.floor(elapsedTime/60);
        let seconds = elapsedTime - (minutes * 60);
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return `${minutes}:${seconds}`
    }

    function timerConfig() {
        timeController = setInterval(function(){
            updateTimer(elapsedTimeSec);
            resolveTime(elapsedTimeSec);
            elapsedTimeSec++;
        }, 1000);
    }

    this.init = function() {
        importData(timerImport);
        initButton();
    }
}




//db has all of the 'events'
//db contains 'timers'
//A timer is just an ordering of events
//maybe with some metadata
//Sample timer

//In the frontend - need an array with
//each index representing a second
//load the array on init - get data from server
//each second, have frontend check against
//the array

//Make ajax call to server
//have server query db and then
//send some JSON or some other
//encoding to fill the cache array

//UX Thoughts
//User brought to dashboard
//User selects timer (query db for 'timers')
//--maybe have a defualt timer and then allow custom timers
//wait for timer to load
//give a start button 
//user presses start button
//

//steam api key 59862AC34A6CD31B5E2A435A9C65C5DB