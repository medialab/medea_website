# MEDEA website

## General presentation
This website is an Angular application presenting the research results of the MEDEA project through narratives. These narratives contains both texts (the analyses) and interactive visualisations related to specific parts of the text.
This website is mainly composed of 2 parts:
* IPCC:
This part contains 3 analyses (plus an introduction)
* UNFCCC:
This part contains 2 analyses (plus an introduction)

## How to Install
This application basically download content from a given Google Drive and plugs it to an Angular app.
Consequently you need to install several components to have it working.

### Setting up the Google Drive content downloader
The content exporter is based on __Drive-out__ (created by Daniele Guido). It is a node "exporter" from Google Drive.

/!\ Warning, it appears that the Google Drive Documents have to be in YOUR OWN GOOGLE DRIVE FOLDER in order to let the API access these files. So don't forget to click on the "Add to my drive" button!

1. Applying for a Google ClientID
---
You will need to apply for a a google __Client ID for native application__ in order to get the data from google drive. You can use a google account to apply and retrieve your credentials at [google developer console](https://console.developers.google.com).

You then need to place these credentials in the `settings.js` file.

Once you have logged in with your google account, follow these steps:

1. Create a new project
2. Under __APIs & Auth__ / __APIs__  enable __DriveAPI__ by setting its status to __ON____Drive-out__
3. Under __APIs & Auth__ / __Credentials__ click on __create new Client ID__ and then select  `Installed application` for _Application type_ and `Other` when the Installed Application Type panel appears.
4. Under __APIs & Auth__ / __Concsent Screen__ select an _EMAIL ADDRESS_ and give a _PRODUCT NAME_ to your application.

Remember to doublecheck the google drive api credentials, the application name, email and product Name.



2. Installation on UNIX
---
Driveout needs [node library](http://nodejs.org/) because it uses [bower](http://bower.io/#install-bower) and [grunt-cli](http://gruntjs.com/getting-started) as well. Open your terminal and type:

	npm install -g bower
	npm install -g grunt

Git-cloned (e.g under `~~/`) and install the dependencies required by drive_api.js:

	cd ~~/drive-out
	npm install
	bower install



Copy the `settings.js` file

	cp settings.js.example settings.js

and fill it with Google clientID credentials. Put then in between the quotes:

	settings.CLIENT_ID = 'YOUR GOOGLE CLIENT ID.apps.googleusercontent.com';
	settings.CLIENT_SECRET = 'YOUR GOOGLE CLIENT SECRET';
	settings.REDIRECT_URL = 'YOUR GOOGLE REDIRECT_URL';

3. Get the data ...
---

Now comes the __tricky part__.
First of all, get the [sharing link](https://support.google.com/drive/answer/2494822?hl=en) for the google drive folder you want to drive-out, something like `https://drive.google.com/folderview?id=XXXXXXXXXXX&usp=sharing`.

Please note that the shared folder can belong to any other google account - that's why you need to authorize the drive-out application to read the shared folder (Cfr. step 1).

Complete the `settings.js` file with the following line:

	settings.DRIVE_FOLDER_URL = 'https://drive.google.com/folderview?id=XXXXXXXXXXX&usp=sharing';

Drive_out will ask Google for a Oauth2 token using your credentials and it will store these data it in a file named `secrets.json` in a file location of your choice, just ensure it is an absolute path (with slash).

	settings.SECRETS_PATH = './secrets.json';


4. start your engines
---

In order to get the data from your google drive folder type:

	npm start

copy the link after this line and paste in your browser address bar

	Please visit the following url and authenticate with your google drive credentials:

Normally you will be asked for your google credentials (again) and you should then receive a code. Copy and paste the code into the terminal:

	Enter the code here:

and wait for the indexer to finish its job.
As you may see, two folders have now been created in your driveout installation folder: `~~/drive-out/app/contents` and `~~/drive-out/app/media`.
Inside the `media` folder you find a copy of each non-text file, while the `Contents` folder will contain all your text contents translated into JSON structured files.

Please refer to [index.js](https://github.com/medialab/drive-out/blob/master/index.js) file to understand how drive-out exports your files, and modify it according to your needs.

## How to build an static app

Run `grunt build` and copy the dist path to your server root

## How to develop your app
Run `grunt serve` in your local folder

## How to update your app
The texts have changed?
Run `npm start`
Then `grunt build` or `grunt serve` depending on your needs.

