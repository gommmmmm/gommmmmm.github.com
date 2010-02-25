
/**************** QUOTE TWITTER ****************/

function parseTweets(tweets) {
    var html = "";
    for (var i=0; i<tweets.length; i++) {
        html += parse(tweets[i])
    }
    var targetNode = document.getElementById("tweet");
    if (targetNode != null) {
        targetNode.innerHTML = html;
    }
}

function parse(tweetObj) {
    var tweet = tweetObj.text;
    var matches = tweet.match(/https?:\/\/[-_.!~*\'\(\)a-zA-Z0-9;\/?:\@&=+\$,%#]+/g);
    var images = new Array();

    for (var i=0; i<matches.length; i++) {
        var m = matches[i];
        var twitpicMatches = m.match(/^http:\/\/twitpic\.com\/([a-z0-9]+)/);
        if (twitpicMatches != null && twitpicMatches.length > 0) {
            images.push(twitpicMatches[1]);
            tweet = tweet.replace(twitpicMatches[0], '');
            if (tweet.indexOf(" - ") == 0) {
                tweet = tweet.substring(3);
            } else if (tweet.indexOf(" - ") == tweet.length - 3) {
                tweet = tweet.substring(0, tweet.length - 3);
            }
        } else {
            tweet = tweet.replace(m, '<a href="' + m + '">' + m + '</a>');
        }
    }

    tweet = '<a href="http://twitter.com/' + tweetObj.user.screen_name + '/status/' + tweetObj.id + '">' + tweet + '</a>';
    
    var imageHtml = "";
    for (var i=0; i<images.length; i++) {
        imageHtml += '<div class="pic">';
        imageHtml += '<a href="http://twitpic.com/' + images[i] + '">'
        imageHtml += '<img src="http://twitpic.com/show/large/' + images[i] + '" />';
        imageHtml += '</a>';
        imageHtml += '</div>';
    }
    tweet = imageHtml + tweet;
    tweet = '<div class="content">' + tweet + '</div>';
    tweet += '<div class="time">' + niceTime(parseDate(tweetObj.created_at)) + '</div>';
    return tweet;
}


/**
 * PRETTY-DATE
 * http://james.padolsey.com/javascript/recursive-pretty-date/
 * Copyright (c) 2010 James Padolsey
 * -------------------------------------------------------
 * Dual licensed under the MIT and GPL licenses.
 *    - http://www.opensource.org/licenses/mit-license.php
 *    - http://www.gnu.org/copyleft/gpl.html
 */

var niceTime = (function() {
    
    var ints = {
        second: 1,
        minute: 60,
        hour: 3600,
        day: 86400,
        week: 604800,
        month: 2592000,
        year: 31536000
    };
    
    return function(time) {
        
        time = +new Date(time);
        var gap = ((+new Date()) - time) / 1000,
        amount, measure;
        
        for (var i in ints) {
            if (gap > ints[i]) { measure = i; }
        }
        
        amount = gap / ints[measure];
        amount = gap > ints.day ? (Math.round(amount * 100 / 100)) : Math.round(amount);
        amount += ' ' + measure + (amount > 1 ? 's' : '') + ' ago';
        
        return amount;
    };
    
})();


var parseDate = (function() {
    var months = {
        "Jan":1,
        "Feb":2,
        "Mar":3,
        "Apr":4,
        "May":5,
        "Jun":6,
        "Jul":7,
        "Aug":8,
        "Sep":9,
        "Oct":10,
        "Nov":11,
        "Dec":12
    };

    return function(dateStr) {
        var matches = dateStr.match(/^[a-zA-Z]{3} ([a-zA-Z]{3}) ([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2}) \+([0-9]{4}) ([0-9]{4})$/);
        var dateFormatted = matches[7] + "-" + months[matches[1]] + "-" + matches[2] + "T" + matches[3] + ":" + matches[4] + ":" + matches[5] + "Z";

	    var d = dateFormatted.split(/\D/);
	    --d[1];
	    var time = Date.UTC.apply(null, d);

        return new Date(time);
    };
})();

/*
 * PRETTY-DATE END
 */