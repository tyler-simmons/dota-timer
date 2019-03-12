//hello
//Basic JSON object for testing -- will come from db
var events = [
    {
        name: "place ward"
    },
    {
        name: "get bounty rune"
    },
    {
        name: "check map"
    }
]

//testing object
var timerLocal = {
    Author: "Tyler",
    Created: 25,
    Data: [
        {
            event: "ward",
            timeStamps: [
                60, 120, 180, 240, 420
            ]
        },
        {
            event: "check map",
            timeStamps: [
                30, 90, 150, 210
            ]
        },
        {
            event: "get bounties",
            timeStamps: [
                0, 360
            ]
        }
    ]
}

//wait for DOM to load before selecting
$(document).ready(function(){
    //select DOM elements that will be needed
    //store the jQuery OBJECTS 
    var displayTest = $('#timer'),
        startButton = $('#timer-start'),
        mainDisplay = $('.main-display');

    var dotaTimer = new Dota(displayTest, startButton, mainDisplay);
    dotaTimer.init();
});



//Constructor for our Dota object ->
//1. Imports data from 
function Dota(timerDisplay, startButton, mainDisplay) {
    
    //take the argument references to the jQuery
    //DOM elements and assign them to this
    //instance
    this.timerDisplay = timerDisplay;
    this.startButton = startButton;
    this.mainDisplay = mainDisplay;
    
    //'private' members used for timer logic
    let elapsedTimeSec = 0;
    let lastEventTime = -1;
    let eventCache = null;
    let timeController = null;
    let initMutex = 1;
    
    //constant time of 'last'
    //event to prevent infinite timer
    const maxTimeDefault = 5400;
    
    function getDataFromAPI() {
        //async request to API to get timer data
        $.getJSON("/api")
        .then((data) => {
            //When the promise created by our request is 
            //fulfilled, take our data and import it
            importData(data.timer1.Data);
        })
        .catch((err) => {
            console.log(err);
            alert("Error: could not import data from server");
        })
    }
    
    //DOM manipulator - update the time display
    function updateTimer(time) {
        timerDisplay.text(buildTimeString(time));
    }

    //DOM manipulator - append an event to the main display
    function appendToList(action) {
        mainDisplay.append(`<li>${action}</li>`);
    }

    //Attempt to apply the click listener to the
    //start button - will only succeed the first time
    function initButton() {
        startButton.on('click', () => {
            //check to see if the timer has already been started
            //mutex will allow for pause feature
            initMutex--;
            initMutex === 0 ? startTimer() : alert("Error: timer already started");
        });
    }

    //Take in the Data section of timer object
    //and extract necessary info ->
    //gets last event time and populates event cache 
    function importData(timerData) {
        //get the time of final event
        lastEventTime = timerData[timerData.length - 1].time;
        eventCache = new Array(lastEventTime);
        //mem for array is not populate on declaration so it
        //needs to be filled with default value
        eventCache.fill(-1);
        timerData.forEach((event) => {
            //populate the cache (index = seconds elapsed)
            eventCache[event.time] = event.action;
        });
    }

    
    //USED FOR UPDATED TIMER SCHEMA
    //DEV BRNACH ONLY
    function importDataNew(timerImport) {
        let dataImport = timerImport.Data;
        for (let i = 0; i < dataImport.length; i++) {
            dataImport[i].timeStamps
        }
    }

    
    //called each second - references the cache to see if
    //there is an event at elapsedTime (in seconds) and 
    //updated the display accordingly - stops timer if 
    //last event time is reached
    function resolveTime(elapsedTime) {
        //current action only needs to exist in this scope (referenced from cache)
        let currentAction = eventCache[elapsedTime];
        console.log(`Time: ${elapsedTime}, Action: ${currentAction}`);
        //if there's anything other than defulat value - add to display
        if (currentAction !== -1) {
            appendToList(currentAction);
        }
        //check to see if it's the time of last event
        if (elapsedTime === lastEventTime) {
            clearInterval(timeController);
        }
    }

    
    //format the elapsed time in seconds to mm:ss
    //pad with 0's as needed
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

    //(applied to start button click listener)
    //starts timer
    function startTimer() {
        //need to assign to member variable to enable stop/pause
        timeController = setInterval(function(){
            //update timer display
            updateTimer(elapsedTimeSec);
            //check against cache for event
            resolveTime(elapsedTimeSec);
            elapsedTimeSec++;
        }, 1000);
    }

    //only public function - initializes app
    this.init = function() {
        getDataFromAPI();
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