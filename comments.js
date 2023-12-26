// Create web server to handle comments
//

// Import modules
var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var url = require('url');
var path = require('path');

// Create server
http.createServer(function (request, response) {

    // Get pathname
    var pathname = url.parse(request.url).pathname;

    // Check if pathname is comments
    if (pathname == '/comments') {

        // Check if request is post
        if (request.method == 'POST') {

            // Create body variable
            var body = '';

            // Add data to body variable
            request.on('data', function (data) {
                body += data;
            });

            // When data is finished
            request.on('end', function () {

                // Parse body
                var POST = qs.parse(body);

                // Get comment
                var comment = POST['comment'];

                // Check if comment is empty
                if (comment != '') {

                    // Create date object
                    var date = new Date();

                    // Create comment object
                    var commentObject = {
                        'comment': comment,
                        'date': date.toString()
                    };

                    // Read comments file
                    fs.readFile('comments.json', function (err, data) {
                        if (err) {

                            // Create comments array
                            var comments = [];

                            // Add comment to comments array
                            comments.push(commentObject);

                            // Write comments array to file
                            fs.writeFile('comments.json', JSON.stringify(comments), function (err) {
                                if (err) {

                                    // Set response header
                                    response.writeHead(500, {
                                        'Content-Type': 'application/json'
                                    });

                                    // Write response
                                    response.write(JSON.stringify({
                                        'message': 'Failed to write comment to file'
                                    }));

                                    // End response
                                    response.end();
                                } else {

                                    // Set response header
                                    response.writeHead(200, {
                                        'Content-Type': 'application/json'
                                    });

                                    // Write response
                                    response.write(JSON.stringify({
                                        'message': 'Comment added successfully'
                                    }));

                                    // End response
                                    response.end();
                                }
                            });
                        } else {

                            // Parse comments file
                            var comments = JSON.parse(data);

                            // Add comment to comments array
                            comments.push(commentObject);

                            // Write comments array to file
                            fs.writeFile('comments.json', JSON.stringify(comments), function (err) {
