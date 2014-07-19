;(function (global, undefined) {
  'use strict';

  var doc = global.document;

  console.log(this);
  var $mainFile = doc.getElementById('js-main-file');
  var $imageDir = doc.getElementById('js-image-dir');
  var $exitBtn  = doc.getElementById('js-exit');


  $mainFile.addEventListener('change', getSelectedPath, false);
  $imageDir.addEventListener('change', getSelectedPath, false);
  $exitBtn.addEventListener('click', function() {
    process.exit(1);
  }, false);

  function getSelectedPath(ev) {
    ev.preventDefault();
    console.log($mainFile.value);
    console.log($imageDir.value);
  }



}(this.self || global));
