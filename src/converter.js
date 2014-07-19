module.exports = (function(global) {
  'use strict';

  // Dependencies.
  var fs   = require('fs');
  var path = require('path');

  var MIME_TYPES = {
    png:  'image/png',
    gif:  'image/gif',
    jpg:  'image/jpeg',
    jpeg: 'image/jpeg'
  };
  var MANIFEST_RE = /manifest ?: ?\[[\n\ta-zA-Z0-9/-_{}"'., ]*\]/m;
  var MANIFEST_DELIMITER = 'manifest: ';


  /**
   * Export converted file from target filepath.
   * Target 'file' and 'images dir' have to be placed in same working dir.
   *
   * Converted file will export to working dir.
   * So, set 'fileName' option to avoid overwriting your original target file.
   *
   * @class Converter
   * @param {Object} options
   * @param {String} options.target   [Required] path to target js file
   * @param {String} options.fileName [Optional] converted file name
   */
  var Converter = function(options) {
    if (!options.target) {
      throw new Error('Target file path is missing!')
    }
    this._initialize(options);
  };

  Converter.prototype = {
    constructor: Converter,

    /**
     * Set options as local variables.
     *
     * @name initialize
     * @param options options
     */
    _initialize: function(options) {
      var workDir        = path.dirname(options.target);
      var targetFileName = path.basename(options.target);

      // Set members.
      this.workDir        = workDir;
      this.targetFileName = targetFileName;
      this.destFileName   = (options.fileName) ? options.fileName + '.js' : targetFileName;
    },

    /**
     * Convert and export file.
     *
     * @name convert
     * @return {Boolean}
     *   convert success or NOT
     */
    convert: function() {
      var workDir = this.workDir;
      var targetFile = workDir + '/' + this.targetFileName;

      var targetFileStr = fs.readFileSync(targetFile, 'utf8');
      var manifestArray = __getManifestArrayByTargetFileStr(targetFileStr);

      // Convert path to base64 strings
      var convertedManifestArray = manifestArray.map(function(e) {
        var imgPath = workDir + '/' + e.src;
        e.src = __getBase64StringByFilePath(imgPath);

        return e;
      });

      // Finally write file.
      var convertedManifest = MANIFEST_DELIMITER + JSON.stringify(convertedManifestArray, null, 2);
      var destFileStr = targetFileStr.replace(MANIFEST_RE, convertedManifest);
      var destFile = this.workDir + '/' + this.destFileName;
      try {
        fs.writeFileSync(destFile, destFileStr);
        return true;
      } catch(e) { throw new Error(e); }
    }
  };

  return Converter;

  /**
   * Parse and return manifest Array object from entire file string.
   *
   * @name getManifestArrayByTargetFileStr
   * @param {String} targetFileStr
   *   Entire body of target file
   * @return {Array}
   *   manifest array
   */
  function __getManifestArrayByTargetFileStr(targetFileStr) {
    // Read js and parse manifest to get strings like "manifest: [{}, {},..{}]"
    var manifest         = targetFileStr.match(MANIFEST_RE)[0];
    var manifestArrayStr = manifest.split(MANIFEST_DELIMITER)[1];

    // String -> Array
    /*jslint evil: true */
    return eval(manifestArrayStr);
  }

  /**
   * Parse and return manifest Array object from entire file string.
   *
   * @name getBase64StringByFilePath
   * @param {String} filePath
   *   path to your images
   * @return {String}
   *   base64 encoded strings
   */
  function __getBase64StringByFilePath(filePath) {
    var file = fs.readFileSync(filePath);
    var extName = path.extname(filePath);
    var mimeType = MIME_TYPES[extName.substr(1, extName.length)];

    return 'data:' + mimeType + ';base64,' + new Buffer(file).toString('base64');
  }


}(this.self || global));
