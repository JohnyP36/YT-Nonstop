

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

/**
 * Gets the saved background color for url.
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
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

function setAutoplay(value) {
  
  var script = 'var wantDisabled='+value+'; var autoplayButton = document.getElementByClassName("ytp-autonav-toggle-button");if(($(".ytp-autonav-toggle-button").attr("true")==\'checked\' && wantDisabled)||($(".ytp-autonav-toggle-button").attr("true")!=\'checked\' && !wantDisabled)){autoplayButton.click();console.log($(".ytp-autonav-toggle-button").attr("true"));}';

  script += 'var wantDisabled='+value+'; var autoplayButton = document.getElementById("improved-toggle");if(($("#improved-toggle").attr("checked")==\'checked\' && wantDisabled)||($("#improved-toggle").attr("checked")!=\'checked\' && !wantDisabled)){autoplayButton.click();console.log($("#improved-toggle").attr("checked"));}';

  chrome.tabs.executeScript(null, { file: "js/jquery-3.2.1.min.js" }, function() {
    chrome.tabs.executeScript({
      code: script
    });
  });

  
}

document.addEventListener('DOMContentLoaded', () => {
	var checkbox = document.getElementById('disableAutoplayCheckbox');
   checkbox.addEventListener('click', () => {
    	getCurrentTabUrl((url) => {
    		var checkbox = document.getElementById('disableAutoplayCheckbox');
    		saveAutoplayDisabled(checkbox.checked);
    		if(url.indexOf("www.youtube.com/watch")>=0){
		        
		        setAutoplay(checkbox.checked);
		        
		   }
		});
   });
   

  getCurrentTabUrl((url) => {
      getSavedAutoplayDisabled((autoplayValue) => {
        console.log(autoplayValue);
        
        var checkbox = document.getElementById('disableAutoplayCheckbox');
        
        checkbox.checked=autoplayValue;
        
        if(url.indexOf("www.youtube.com/watch")>=0){
        	setAutoplay(autoplayValue);
        
        }
      });
      
  });
});

