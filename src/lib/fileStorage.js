let storageDir = null

document.addEventListener('deviceready', function () {
  if ('syncedDataDirectory' in cordova.file) { // eslint-disable-line no-undef
    storageDir = cordova.file.syncedDataDirectory // eslint-disable-line no-undef
  }
})

function openDirectory (callback, errorCallback) {
  if (storageDir) {
    window.resolveLocalFileSystemURL(storageDir, function (dirEntry) {
      callback(dirEntry)
    }, errorCallback)
  } else {
    errorCallback('Storage directory not available!')
  }
}

function createFile (fileName, dataObj, successCallback, errorCallback) {
  openDirectory(function (dirEntry) {
    // Creates a new file or returns the file if it already exists.
    dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function (fileWriter) {
        fileWriter.onwriteend = function () {
          successCallback('Data Save Successful!')
        }

        fileWriter.onerror = function (e) {
          errorCallback('Failed file write: ' + e.toString())
        }

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
          dataObj = new Blob(['some file data'], { type: 'text/plain' })
        } else {
          dataObj = JSON.stringify(dataObj)
        }

        fileWriter.write(dataObj)
      })
    }, errorCallback)
  }, errorCallback)
}

function readFile (fileName, successCallback, errorCallback) {
  openDirectory(function (dirEntry) {
    dirEntry.getFile(fileName, { create: false }, function (fileEntry) {
      fileEntry.file(function (file) {
        var reader = new FileReader()

        reader.onloadend = function () {
          successCallback(this.result)
        }

        reader.readAsText(file)
      }, errorCallback)
    }, errorCallback)
  }, errorCallback)
}

function saveData (dataObj, successCallback, errorCallback) {
  createFile('myData.json', dataObj, successCallback, errorCallback)
}

function readData (successCallback, errorCallback) {
  readFile('myData.json', successCallback, errorCallback)
}

export default { saveData, readData }
