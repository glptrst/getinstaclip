"use strict";
const http = require('http');
const https = require('https');
const fs = require('fs');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    req.on('error', (err) => {
	console.log(err);
	res.statusCode = 400;
	res.end();
    });

    if (req.method === 'GET') {
	if (req.url === '/') {
	    // Serve homepage
	    fs.readFile('./public/homepage.html', (err, fileContent) => {
		if (err) {
		    console.log('Error 1');
		} else {
		    res.writeHead(200, {'Content-Type': 'text/html'});
		    res.end(fileContent);
		}
	    });
	} else if (req.url === '/cover.css') {
	    fs.readFile('./public/css/cover.css', (err, fileContent) => {
		if (err) {
		    console.log('Error 2');
		} else {
		    res.writeHead(200, {'Content-Type': 'text/css'});
		    res.end(fileContent);
		}
	    });
	} else {
	    var splittedUrl = req.url.split('/');
	    if (splittedUrl[1] === 'getpic') {
		// Check user input
		if (instapic.isInputLegal(instapic.getUserInput(req.url))) {
		    // get promise to html of the page
		    let pagePromise = instapic.getPage(instapic.getUserInput(req.url));
		    pagePromise.
			then((page) => {

			    //TODO
			    //get video url
			    let video;

			    // redirect to picture
			    res.statusCode = 302;
			    res.setHeader('Location', video);
			    res.end();
			}, (err) => {
			    console.log(err);
			});
		} else {
		    res.statusCode = 404;
		    res.end('Wrong link');			    
		}
	    } else {
		res.statusCode = 404;
		res.end('error');
	    }
	}
    } else {
	res.statusCode = 404;
	res.end('error');
    }
});

server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
