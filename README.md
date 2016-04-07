## Franklin Templeton Web Hackathon

This project serves as a simple application framework to get you up an running in the web hackathon. You will need to have a local copy of NodeJS installed - https://nodejs.org and optionally you will need GIT if you want to clone this repository, otherwise use the download zip function.

## Installation

````
$ npm install -g bower gulp
$ npm install
$ bower install
$ gulp build
````

## Running the application
````
> gulp serve
````

## Directory Structure

The public directory is where your application will live and this directory should be hosted by your web server when you publish your application. The src directory is where you can find the application's LESS files and all of the non-production javascript libraries. Typyically you should edit files in here and rebuild the application rather than editing CSS & JS assets directly. HTML can be edited directly in the public directory, however you may wish to use a JavaScript templating engine like handlebars.

## Updating CSS & JavaScript assets

You can edit your JavaScript and LESS files from the src directory. When you want to build the application you can run gulp build and it will compile the LESS files and minify the javascript before copying them over to the public directory.
````
$ gulp build
````
If you only want to build the CSS assets you can individually call:
````
$ gulp css
````
Likewise for JavaScript:
````
$ gulp js
````
Gulp will be automatically watching for any changes to LESS and JavaScript assets, any changes to a LESS or JavaScript file will trigger their corresponding build process then reload the application in your browser.

## Support

Facilitators will be available during the hackathon on Skype or via email.


## License

The MIT License (MIT)

Copyright 2016 Franklin Resources, Inc.
