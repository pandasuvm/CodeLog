let questions = [];
let isAscending = true;

// Fetch and display the questions initially
chrome.storage.local.get({ questions: [] }, (data) => {
    questions = data.questions;
    displayQuestions(questions);
});

// Search functionality
document.getElementById("searchBar").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filteredQuestions = questions.filter(q => q.question.toLowerCase().includes(query));
    displayQuestions(filteredQuestions);
});

// Sorting functionality by S. No
document.getElementById("sortSNo").addEventListener("click", () => {
    isAscending = !isAscending;
    const sortedQuestions = [...questions].sort((a, b) => {
        const indexA = questions.indexOf(a) + 1;
        const indexB = questions.indexOf(b) + 1;
        return isAscending ? indexA - indexB : indexB - indexA;
    });
    displayQuestions(sortedQuestions);
});

// Function to display questions in the table
function displayQuestions(questions) {
    const tableBody = document.querySelector("#questionTable tbody");
    tableBody.innerHTML = ''; // Clear previous rows

    questions.forEach((q, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${q.question}</td>
          <td><a href="${q.url}" target="_blank">${q.url}</a></td>
          <td>${q.status}</td>
          <td>${q.notes || "No notes added"}</td>`;
        tableBody.appendChild(row);
    });
}
document.getElementById('exportCsvBtn').addEventListener('click', () => {
  exportTableToCSV('saved_questions.csv');
});

function exportTableToCSV(filename) {
  let csv = [];
  let rows = document.querySelectorAll("#questionTable tr");

  // Loop through each row and extract data for CSV
  for (let i = 0; i < rows.length; i++) {
      let row = [], cols = rows[i].querySelectorAll("td, th");
      
      for (let j = 0; j < cols.length; j++) {
          // Clean up text and escape double quotes
          let cell = cols[j].innerText.replace(/"/g, '""');
          row.push('"' + cell + '"');
      }
      csv.push(row.join(","));
  }

  // Create a CSV string
  let csvString = csv.join("\n");

  // Create a downloadable link
  let csvFile = new Blob([csvString], { type: 'text/csv' });
  let downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";

  // Append and trigger download
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

