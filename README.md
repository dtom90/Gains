# GainsTrack
A workout tracker mobile app

[![Build Status](https://travis-ci.org/dtom90/GainsTrack.svg?branch=master)](https://travis-ci.org/dtom90/GainsTrack)

## Software Requirements Specification

### Purpose

#### Background

I do weight / resistance training several times per week. Each time that I do it, I have a specific workout routine that I follow. As I continue working out from week to week, I would like to be able to record the progress that I am making for each exercise. I would also like to be able to visualize the progress that I am making over time.

### Solution

This application allows a user to:

1. Create a workout consisting of a sequence of exercises with target reps, sets, & rounds
2. Start and record performance during workout
3. Visualize workout / exercise performance & progress over time

## Usage

### 1. Download this repository
```
git clone https://github.com/dtom90/GainsTrack
```

Repository will be downloaded into `GainsTrack/` folder

### 2. Install dependencies

Go to the downloaded repository folder and run:
```
npm install
```

This will download latest version of Framework7, Framework7-Vue, Vue and required icon fonts (to `/src/fonts/`)

### 3. Run the app

```
npm run dev
```

App will be opened in browser at `http://localhost:8080/`

### 4. Build app for production

```
npm run build
```

The output will be at `www/` folder

## Use with cordova
Cordova is not enabled by default, so make sure to remove the comment tags around the `<script src="cordova.js"></script>` line in [projectroot]/src/index.html
```
<body>
  <div id="app"></div>

  <!-- Cordova -->

  <script src="cordova.js"></script>

  <!-- built script files will be auto injected -->
</body>
```
It will be added during the build process to Android/iOS.

Just put the contents of `www` folder in your cordova's project root `www` folder

## One command install

```
git clone https://github.com/framework7io/framework7-template-vue-webpack my-app &&
cd my-app &&
npm install &&
npm run dev
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for development
npm run build-dev

# build for production with minification
npm run build-prod
```

## Project Structure

* `src/index.html` - main app HTML
* `src/assets` - folder with static assets (images)
* `src/components` - folder with custom `.vue` components
* `src/css` - put custom app CSS styles here. Don't forget to import them in `main.js`
* `src/pages` - app `.vue` pages
* `src/app.js` - main app file where you include/import all required libs and init app
* `src/routes.js` - app routes
* `src/app.vue` - main app structure/component
* `/static/` - folder with extra static assets that will be copied into output folder
