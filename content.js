console.log("Content script loaded");

function getQuestionTitle() {
  const url = window.location.href;
  console.log(`Current URL: ${url}`);

  if (url.includes("leetcode.com")) {
    const titleElement = document.querySelector("a[href*='/problems/'].no-underline");
    return titleElement ? titleElement.innerText : "Unknown Question";
  } else if (url.includes("codingninjas.com")) {
    // Ensure the selector accurately targets the title
    const titleElement = document.querySelector("h1.problem-title");
    return titleElement ? titleElement.innerText.trim() : "Unknown Question";
  }  if (url.includes("naukri.com")) {
    const titleElement = document.querySelector("h1.problem-title");
    return titleElement ? titleElement.innerText : "Unknown Question";
  
  } else if (url.includes("codechef.com")) {
    // Ensure the selector accurately targets the title
    const titleElement = document.querySelector("h3.notranslate"); // Example selector, verify on the page
    return titleElement ? titleElement.innerText.trim() : "Unknown Question";
  } else {
    return "Unknown Question";
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`Message received: ${message.action}`);
  if (message.action === "getTitle") {
    const title = getQuestionTitle();
    console.log(`Title found: ${title}`);
    sendResponse({ title });
  }
});

