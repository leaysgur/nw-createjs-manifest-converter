;(function (global, undefined) {
  'use strict';

  // Dependencies.
  var doc       = global.document;
  var path      = require('path');
  var _         = require('./src/lodash');
  var CONST     = require('./src/const');
  var Converter = require('./src/converter');


  /**
   * App main
   *
   * @class Main
   * @member {String} mainFilePath
   *   path to your target swf.js file
   */
  function Main() {
    this.mainFilePath = null;

    this.initialize();
    return this;
  }

  Main.prototype = {
    constructor     : Main,
    initialize      : _initialize,
    bindElments     : _bindElments,
    attachEvent     : _attachEvents,
    parseTmpl       : _parseTmpl,
    getMainFilePath : _getMainFilePath,
    checkExec       : _checkExec,
    execConvert     : _execConvert,
    disableExecBtn  : _disableExecBtn,
    enableExecBtn   : _enableExecBtn
  }

  /**
   * Initialize app
   *
   * @name initialize
   */
  function _initialize() {
    this.bindElments();
    this.attachEvent();
    this.parseTmpl();

    this.checkExec();
  }

  /**
   * Get DOM elements
   *
   * @name bindElments
   */
  function _bindElments() {
    this.$mainFile       = doc.getElementById('js-main-file');
    this.$mainFileInfo   = doc.getElementById('js-main-file-info');
    this.$outputFileName = doc.getElementById('js-output-file-name');
    this.$execBtn        = doc.getElementById('js-exec');
    this.$exitBtn        = doc.getElementById('js-exit');
    this.$infoTmpl       = doc.getElementById('js-info-tmpl');
    this.$errorTmpl      = doc.getElementById('js-error-tmpl');
  }

  /**
   * Attach DOM events to elements
   *
   * @name attachEvents
   */
  function _attachEvents() {
    var that = this;

    this.$mainFile.addEventListener('change', function() {
      that.getMainFilePath();
    }, false);

    this.$execBtn.addEventListener('click', function() {
      that.execConvert();
    }, false);

    this.$exitBtn.addEventListener('click', __exitApp, false);
  }

  /**
   * Parse jst
   *
   * @name parseTmpl
   */
  function _parseTmpl() {
    var infoTmpl  = this.$infoTmpl.innerHTML;
    var errorTmpl = this.$errorTmpl.innerHTML;

    this.tmpl = {
      info : _.template(infoTmpl),
      error: _.template(errorTmpl)
    };
  }

  /**
   * Get target file path by input[type=file] tag
   *
   * @name getMainFilePath
   */
  function _getMainFilePath() {
    var files = this.$mainFile.files;
    if (!files) { return; }

    var file = files[0];
    if (__isJsFile(file)) {
      this.$mainFileInfo.innerHTML = this.tmpl.info(__getFileInfo(file));
      this.mainFilePath = file.path;
      this.$outputFileName.value = path.basename(file.path, '.js')
    }
    else {
      this.$mainFileInfo.innerHTML = this.tmpl.error();
      this.mainFilePath = null;
      this.$outputFileName.value = '';
    }

    this.checkExec();
  }

  /**
   * Check exec btn is available or NOT
   *
   * @name checkExec
   */
  function _checkExec() {
    var hasMainFile  = !!this.mainFilePath;

    if (hasMainFile) {
      this.enableExecBtn();
    }
    else {
      this.disableExecBtn();
    }
  }

  /**
   * Execute convert file
   *
   * @name execConvert
   */
  function _execConvert() {
    var converter = new Converter({
      target  : this.mainFilePath,
      fileName: this.$outputFileName.value || null
    });

    var converted = converter.convert();
    if (converted) {
      alert('Sucess!\nConverted file size is ' + __calcKB(converted.size) + 'KB');
    }
  }

  /**
   * Enable exec btn
   *
   * @name enableExecBtn
   */
  function _enableExecBtn() {
    this.$execBtn.classList.remove(CONST.CLASS.IS_DISABLED);
  }

  /**
   * Disable exec btn
   *
   * @name disableExecBtn
   */
  function _disableExecBtn() {
    this.$execBtn.classList.add(CONST.CLASS.IS_DISABLED);
  }


  // Start app.
  new Main();


  // Private functions.
  /**
   * Disable exec btn
   *
   * @name getFileInfo
   * @param {Object} fileObj
   *   instanceof File
   * @return {Object}
   *   data for display texts template
   */
  function __getFileInfo(fileObj) {
    return {
      workDir   : path.dirname(fileObj.path),
      targetFile: path.basename(fileObj.path)
    };
  }

  /**
   * Quit app
   *
   * @name exitApp
   */
  function __exitApp() {
    process.exit(1);
  }

  /**
   * Return is this file is **.js or NOT
   *
   * @name isJsFile
   * @param {Object} fileObj
   *   instanceof File
   * @return {Boolean}
   *   this file is **.js or NOT
   */
  function __isJsFile(fileObj) {
    return fileObj.type === CONST.FILE_TYPE.JS;
  }

  /**
   * Calc n byte to n KB
   *
   * @name calcKB
   * @param {Number} byte
   *   byte
   * @return {Number}
   *   kilo byte
   */
  function __calcKB(byte) {
    byte = byte|0;

    return (byte / 1024).toFixed(2);
  }


}(this.self || global));
