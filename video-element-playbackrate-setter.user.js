// ==UserScript==
// @name         video-element-rate-controller
// @namespace    https://github.com/mirnhoj/video-element-playbackrate-setter
// @version      0.1
// @description  add keyboard shortcuts that will increase/decrease the playback rate for video elements.
// @include      http*://*.youtube.com/*
// @include      http*://*.gfycat.com/*
// @include      http*://*.vimeo.com/*
// @include      http*://vimeo.com/*
// @include      http*://*.facebook.com/*
// @include      http*://www.kickstarter.com/*
// @include      http*://www.periscope.tv/*
// @include      http*://www.twitch.tv/*
// @include      http*://vid.me/*
// ==/UserScript==
// 
// if you want to extend the functionality of this script to other sites
// besides youtube, add additional @include keys to the metadata block.
//
// if you want change the granularity of the playback rate adjustment, change
// the line "var speedStep = 0.1;" to equal something other than 0.1, like 0.01
// for more granular adjustments, or 0.25 for less granular adjustments. 
// Rates will be rounded to 0.01.

var speedStep = 0.1;

function makeInfobox() {
    var infobox = document.createElement("h1");
    infobox.style.position = "absolute";
    infobox.style.top = "10%";
    infobox.style.right = "10%";
    infobox.style.color = "rgba(255, 0, 0, 1)";
    infobox.style.zIndex = "99999";  // ensures that it shows above other elements.
    infobox.style.visibility = "hidden";
    infobox.style.marginTop = "3%";
    infobox.className = "playbackrate-indicator";
    return infobox;
}
    
var hideTime = 0;

function modifyAll(rateDiff) {
    var videoElements = document.getElementsByTagName("video");
    for (var i = 0; i < videoElements.length; ++i) {
        modifyPlaybackRate(videoElements[i], rateDiff);
    }
    
    hideTime = new Date().getTime() + 1000;
    hideInfobox();
}


function modifyPlaybackRate(videoElement, rateDiff) {
    // Grab the video elements and set their playback rate
    var newRate = Math.round((videoElement.playbackRate + rateDiff) * 10) / 10 ;
    videoElement.playbackRate = newRate;
    
    // Show infobox if not already added and update rate indicator.
    if (videoElement && !videoElement.infobox) {
        var infobox = makeInfobox();
        videoElement.parentElement.appendChild(infobox);
        videoElement.infobox = infobox; 
    }
    
    videoElement.infobox.style.visibility = "visible";
    videoElement.infobox.innerHTML = newRate + "x";
}

function hideInfobox() {
    if (new Date().getTime() > hideTime) {
        var infoboxes = document.getElementsByClassName("playbackrate-indicator");
        for (var i = 0; i < infoboxes.length; ++i) {
           infoboxes[i].style.visibility = "hidden";
        }
    } else {
        setTimeout(hideInfobox, 100);
    }
}


// Mimic vlc keyboard shortcuts
window.addEventListener('keydown', function(event) {
    var keycode = event.code;

    // Decrease playback rate if '[' is pressed
    if (event.code === "BracketLeft") {
        modifyAll(-speedStep);
    }

    // Increase playback rate if ']' is pressed
    if (event.code === "BracketRight") {
        modifyAll(speedStep);
    }
});
