const https = require('https');

module.exports = {
    getPage: getPage,
    getVideoUrl: getVideoUrl,
    getUserInput: getUserInput,
    isInputLegal: isInputLegal
};

// return a promise to page 
function getPage (url) {
    return new Promise( (resolve, reject) => {
	https.get(url, (res) => {
	    const { statusCode } = res;
	    const contentType = res.headers['content-type'];
	    let error;
	    if (statusCode !== 200) {
		error = new Error('Request Failed.\n' +
				  `Status Code: ${statusCode}`);
	    }
	    let rawData = '';
	    res.on('data', (chunk) => {
		rawData += chunk;
	    });
	    res.on('end', () => {
		try {
		    resolve(rawData);
		} catch (e) {
		    reject(e);
		}
	    });
	}).on('error', (e) => {
	    reject(e);
	});
    });
};

// Find url of the video within the html/js code of the page.
function getVideoUrl (page) {
    let regex = /"og:video.+content=".+"/.exec(page);
    regex = /https.+\"/.exec(regex);

    return regex[0].substring(0, regex[0].length-1);
};

// Return user input from url of get request
function getUserInput(url) {
    // split url using '/'
    var splittedUrl = url.split('/');
    // Leave only link part in the array
    splittedUrl.splice(0,2);
    // Join with '/'
    var userInput = splittedUrl.join('/');
    // remove '?link=' from the beginning of string
    userInput = decodeURIComponent(userInput.slice(6, userInput.length));
    return userInput;
}

// Check whether the input from the user is the right kind of url
function isInputLegal(input) {
    let rightPrefix = "https://www.instagram.com/";
    let actualPrefix = input.slice(0,26);
    if (actualPrefix === rightPrefix) {
	return true;
    } else {
	return false;
    }
};
