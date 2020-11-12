/* declare some variables */
const functionURL =
  "https://eastus.api.cognitive.microsoft.com/text/analytics/v3.0/keyPhrases";
// array of privacy terms that we are looking for a match on
const privacyTerms = [
  "address",
  "cookies",
  "credit card",
  "credit card information",
  "ip address",
  "personal data",
  "personal information",
  "third-party",
  "use of personal information"
];
const input = document.getElementById("testValue");
const analyzeButton = document.getElementById("analyzeButton");
const objectOutput = document.getElementById("returnedObject");
const testValue = input.value;
/* set value of input field as the body to be sent via the POST request */
const postData = {
  documents: [
    {
      language: "en",
      id: "1",
      text: testValue
    }
  ]
};

/* update value of input to pass */
input.addEventListener("input", updateValue);
function updateValue(e) {
  // trim text to 5000 characters to pass to Azure
  let inputString = e.target.value;
  inputString.substring(1,5000);
  
  postData.documents[0].text = inputString;
}

analyzeButton.addEventListener("click", analyzeText);
/* call Azure Function via HTTP POST and return a very simple object  */
function analyzeText(e) {
  fetch(functionURL, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": "659f9c405d9f4c4ca9671ea7eec23117",
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(postData)
  })
    .then(res => res.json())
    .then(data => {
      evaluateKeyPhrases(data);
    })
    .catch(error => {
      console.error(error);
    });
}

// evaluate the returend Key Phrases
function evaluateKeyPhrases(data) {
  objectOutput.innerHTML = "";
  let keyPhrasesArray = data.documents[0].keyPhrases;

  // check to see if Key Phrases match any of our Privacy Terms
  let privacyTermMatches = 0;
  keyPhrasesArray.forEach(phrase => {
    privacyTerms.forEach(term => {
      if (term.toLowerCase() === phrase.toLowerCase()) {
        privacyTermMatches++;
      }
    });
  });
  if (privacyTermMatches > 2) {
    objectOutput.innerHTML +=
      "<h1 class='match-response true'>This site collects your data</h1>";
  } else {
    objectOutput.innerHTML +=
      "<h1 class='match-response false'>This site may collect your data</h1>";
  }

  // output phrases for web app demo
  objectOutput.innerHTML += "<ul>";
  keyPhrasesArray.forEach(
    element => (objectOutput.innerHTML += "<li>" + element + "</li>")
  );
  objectOutput.innerHTML += "</ul>";
  objectOutput.innerHTML += "<h2>Privacy Terms</h2>";
  objectOutput.innerHTML += "<ul>";
  privacyTerms.forEach(
    element => (objectOutput.innerHTML += "<li>" + element + "</li>")
  );
  objectOutput.innerHTML += "</ul>";
}

