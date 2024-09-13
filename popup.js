document.getElementById("saveForLater").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: "getTitle" }, (response) => {
      if (response && response.title) {
        const title = response.title;
        const url = activeTab.url;

        chrome.storage.local.get({ questions: [] }, (data) => {
          let questions = data.questions;
          const existingQuestionIndex = questions.findIndex(q => q.url === url);
          if (existingQuestionIndex === -1) {
            questions.push({ question: title, url, status: "saved", notes: "No notes added" });
            chrome.storage.local.set({ questions });
          } else {
            console.log("Question already saved.");
          }
        });
      } else {
        console.error("Failed to get title from content script.");
      }
    });
  });
});

document.getElementById("markAsDone").addEventListener("click", () => {
  document.getElementById("notePrompt").style.display = "block";
});

document.getElementById("noteYes").addEventListener("click", () => {
  document.getElementById("noteEntry").style.display = "block";
  document.getElementById("notePrompt").style.display = "none"; // Hide prompt after Yes
});

document.getElementById("noteNo").addEventListener("click", () => {
  saveQuestionWithStatus("done", "No notes added");
  document.getElementById("notePrompt").style.display = "none"; // Hide prompt after No
});

document.getElementById("confirmNote").addEventListener("click", () => {
  const note = document.getElementById("noteInput").value;
  saveQuestionWithStatus("done", note);
  document.getElementById("noteEntry").style.display = "none"; // Hide note entry after confirming
  document.getElementById("notePrompt").style.display = "none"; // Hide prompt after confirming
});

document.getElementById("viewSaved").addEventListener("click", () => {
  chrome.tabs.create({ url: "saved.html" });
});

function saveQuestionWithStatus(status, note) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: "getTitle" }, (response) => {
      if (response && response.title) {
        const title = response.title;
        const url = activeTab.url;

        chrome.storage.local.get({ questions: [] }, (data) => {
          let questions = data.questions;
          const existingQuestionIndex = questions.findIndex(q => q.url === url);
          if (existingQuestionIndex !== -1) {
            questions[existingQuestionIndex].status = status;
            questions[existingQuestionIndex].notes = note;
          } else {
            questions.push({ question: title, url, status: status, notes: note });
          }
          chrome.storage.local.set({ questions });
        });
      } else {
        console.error("Failed to get title from content script.");
      }
    });
  });
}
