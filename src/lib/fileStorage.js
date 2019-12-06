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

function writeFile (fileName, fileContents, successCallback, errorCallback) {
  openDirectory(function (dirEntry) {
    // Creates a new file or returns the file if it already exists.
    dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function (fileWriter) {
        fileWriter.onwriteend = function () { successCallback('Data Save Successful!') }
        fileWriter.onerror = errorCallback

        // if we have contents, write it to the file
        if (typeof fileContents === 'string') {
          fileWriter.write(fileContents)
        } else {
          errorCallback('No data to write')
        }
      })
    }, errorCallback)
  }, errorCallback)
}

function readFile (fileName, successCallback, errorCallback) {
  openDirectory(function (dirEntry) {
    dirEntry.getFile(fileName, { create: false }, function (fileEntry) {
      fileEntry.file(function (file) {
        var reader = new FileReader()
        reader.onloadend = function () { successCallback(this.result) }
        reader.readAsText(file)
      }, errorCallback)
    }, errorCallback)
  }, errorCallback)
}

function errorHandler (errorCallback) {
  return function (e) {
    if (typeof e === 'string') {
      errorCallback(e)
    } else if (typeof e === 'object' && 'code' in e) {
      let msg = ''
      switch (e.code) {
        /* eslint-disable no-undef */
        case FileError.NOT_FOUND_ERR:
          msg = 'File not found'
          break
        case FileError.SECURITY_ERR:
          msg = 'Security error'
          break
        case FileError.ABORT_ERR:
          msg = 'Operation aborted'
          break
        case FileError.NOT_READABLE_ERR:
          msg = 'Not Readable'
          break
        case FileError.ENCODING_ERR:
          msg = 'Encoding error'
          break
        case FileError.NO_MODIFICATION_ALLOWED_ERR:
          msg = 'No Modification Allowed'
          break
        case FileError.INVALID_STATE_ERR:
          msg = 'Invalid state'
          break
        case FileError.SYNTAX_ERR:
          msg = 'Syntax error'
          break
        case FileError.INVALID_MODIFICATION_ERR:
          msg = 'Invalid modification'
          break
        case FileError.QUOTA_EXCEEDED_ERR:
          msg = 'Storage quota exceeded'
          break
        case FileError.TYPE_MISMATCH_ERR:
          msg = 'Type mismatch'
          break
        case FileError.PATH_EXISTS_ERR:
          msg = 'Path does not exist'
          break
        default:
          msg = 'Error code ' + e.code
          break
        /* eslint-enable no-undef */
      }
      errorCallback(msg)
    } else {
      errorCallback(e.toString())
    }
  }
}

function saveData (fileContents, successCallback, errorCallback) {
  writeFile('myData.json', fileContents, successCallback, errorHandler(errorCallback))
}

function readData (successCallback, errorCallback) {
  readFile('myData.json', successCallback, errorHandler(errorCallback))
}

export default { saveData, readData }
