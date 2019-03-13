
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
    $('#menubtn-icon').on('click', function(){
        $('#sideNav').addClass('util-sidenav-open');
        $('main').css('margin-left', '230px');
    });

    $('#closebtn').on('click', function(){
        $('#sideNav').removeClass('util-sidenav-open');
        $('main').css('margin-left', '0px');
    });

    $('main').on('click', function() {
        if ($('#sideNav').hasClass('util-sidenav-open')){
            $('#sideNav').removeClass('util-sidenav-open');
            $('main').css('margin-left', '0px');
        }
    });
    
    
    
    var displayTest = $('#timer'),
        startButton = $('#timer-start'),
        mainDisplay = $('.main-display');

    var dotaTimer = new Dota(displayTest, startButton, mainDisplay);
    dotaTimer.init();
});



//Constructor for our Dota object ->
//1. Imports data from 
function Dota(timerDisplay, startButton, mainDisplay) {
    
    var audio = new Audio('../audio/light.mp3');
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
            console.log(data.newTimer.Data);
            importDataNew(data.newTimer.Data);
            setLastEventTime(data.newTimer.Data);
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
        mainDisplay.prepend(`<li>${action}</li>`);
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
    // function importData(timerData) {
    //     //get the time of final event
    //     lastEventTime = timerData[timerData.length - 1].time;
    //     //eventCache = new Array(lastEventTime);
    //     //mem for array is not populate on declaration so it
    //     //needs to be filled with default value
    //     eventCache.fill(-1);
    //     timerData.forEach((event) => {
    //         //populate the cache (index = seconds elapsed)
    //         eventCache[event.time] = event.action;
    //     });
    // }

    
    function EventTimeModel(addEvent) {
        this.events = [addEvent];
    }

    function setLastEventTime(timerData) {
        let timeStampList = new Array();
        for (let i = 0; i < timerData.length; i++) {
            timeStampList.push(...timerData[i].timeStamps);
        }
        lastEventTime = Math.max(...timeStampList);
    }

    //USED FOR UPDATED TIMER SCHEMA
    //DEV BRNACH ONLY
    function importDataNew(timerData) {
        
        
        //Use a map for O(1) accessing
        eventCache = new Map();
        for (let i = 0; i < timerData.length; i++) {
            //Go through all the timestamps of of this 'event type'
            timerData[i].timeStamps.forEach(function (time) {
                if (eventCache.has(time)) {
                    eventCache.get(time).events.push(this[i].event);
                    console.log(`Overlap @ time ${time} - ${eventCache.get(time).events}`);
                } else {
                    eventCache.set(time, new EventTimeModel(this[i].event));
                }
            //reference the data import with 'this'
            }, timerData);
        }
    }

    this.newTest = function() {
        importDataNew(timerLocal.Data);
        console.log(eventCache.get(0));
        console.log(eventCache.get(210));
    }
    
    //called each second - references the cache to see if
    //there is an event at elapsedTime (in seconds) and 
    //updated the display accordingly - stops timer if 
    //last event time is reached
    function resolveTime(elapsedTime) {
        if (eventCache.has(elapsedTime)) {
            audio.play();
            console.log(`Event at time ${elapsedTime}: ${eventCache.get(elapsedTime).events}`);
            eventCache.get(elapsedTime).events.forEach((event => {
                appendToList(event);
            }))
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
            //check against cache for event
            resolveTime(elapsedTimeSec);
            //update timer display
            updateTimer(elapsedTimeSec);
            elapsedTimeSec++;
        }, 1000);
    }

    //only public function - initializes app
    this.init = function() {
        getDataFromAPI();
        initButton();
    }
}


//steam api key 59862AC34A6CD31B5E2A435A9C65C5DB