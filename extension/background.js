chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("about:")) {
    console.warn("Cannot inject content script into protected browser pages.");
    return;
  }
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});
