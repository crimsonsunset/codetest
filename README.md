## Character Browser

* I used yeoman to scaffold my project, specifically the "webapp" generator
* The basic layout uses dropdowns for most user interaction, with pagination also available on the first index page.
* Sometimes, the API takes a couple of seconds to return data. The app displays a spinner in these situations, but I also logged more relevant information in the console surrounding the AJAX calls. Please be patient!
* Additionally, I have included moment.js for time manipulation. Specifically, it is used for the display dates on the comics page.
* Working Version: http://marvel.paperplane.io/


### Steps to run  
Assume npm, grunt, and bower are globally installed.
cd into the unzipped folder and run your standard "npm install"
run "bower install" for js libraries
run "grunt serve". This will run through and host the app on localhost:9000. Notice this also launches the node.js server (localhost:8080) for the server-side HTTP calls the assignment requested. 