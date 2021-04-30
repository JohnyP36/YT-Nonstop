chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    getSavedAutoplayDisabled((autoplayValue) => {
      console.log(autoplayValue);
      var actualAutoplay = autoplayValue;
      if(autoplayValue==null) {
        actualAutoplay=true;
        saveAutoplayDisabled(true);
      }
      setAutoplay(actualAutoplay);
    });
  }
});

function getSavedAutoplayDisabled(callback) {
  chrome.storage.sync.get("autoplayDisabled", (items) => {
    callback(chrome.runtime.lastError ? null : items["autoplayDisabled"]);
  });
}

function saveAutoplayDisabled(value) {
  var items = {};
  items["autoplayDisabled"] = value;
  
  chrome.storage.sync.set(items);
}

function setAutoplay(value, tabId) {
  //stackoverflow code
  var script = 'function waitForElementToDisplay(selector, time, callback) {if(document.querySelector(selector)!=null) {callback();return;}else{setTimeout(function(){waitForElementToDisplay(selector, time, callback);},time);}}';
  
  script += 'waitForElementToDisplay(\"#toggle\",1000,function() {console.log($(\"#toggle\").attr(\"checked\"));var wantDisabled='+value+'; var autoplayButton= document.getElementById(\"toggle\");if(($(\"#toggle\").attr(\"checked\")==\'checked\' && wantDisabled)||($(\"#toggle\").attr(\"checked\")!=\'checked\' && !wantDisabled)){console.log(\"clicked!\");autoplayButton.click();}else{console.log(\"NO CLICK!\");} });';

  script += 'waitForElementToDisplay(\"#improved-toggle\",1000,function() {console.log($(\"#improved-toggle\").attr(\"checked\"));var wantDisabled='+value+'; var autoplayButton= document.getElementById(\"improved-toggle\");if(($(\"#improved-toggle\").attr(\"checked\")==\'checked\' && wantDisabled)||($(\"#improved-toggle\").attr(\"checked\")!=\'checked\' && !wantDisabled)){console.log(\"clicked!\");autoplayButton.click();}else{console.log(\"NO CLICK!\");} });';

  chrome.tabs.executeScript(tabId, { file: "js/jquery-3.2.1.min.js" }, function() {
    chrome.tabs.executeScript(tabId, {code: script});
  });
}

//from stackoverflow
/*
;(function ($, window) {var intervals = {};var removeListener = function(selector) {if (intervals[selector]) {window.clearInterval(intervals[selector]);intervals[selector] = null;}};var found = 'waitUntilExists.found';$.fn.waitUntilExists = function(handler, shouldRunHandlerOnce, isChild) {var selector = this.selector;var $this = $(selector);var $elements = $this.not(function() { return $(this).data(found); });if (handler === 'remove') {removeListener(selector);}else {$elements.each(handler).data(found, true);if (shouldRunHandlerOnce && $this.length) {removeListener(selector);}else if (!isChild) {intervals[selector] = window.setInterval(function () {$this.waitUntilExists(handler, shouldRunHandlerOnce, true);}, 500);}}return $this;};}(jQuery, window));
*/