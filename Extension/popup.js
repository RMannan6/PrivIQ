// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var parser = document.createElement('a');

chrome.tabs.query({
  active: true,
  lastFocusedWindow: true
}, function (tabs) {
  
  // Analyze tab's url
  var url = tabs[0].url;

  if (url != '') {
    parser.href = url;
    var scheme = parser.protocol; // 1. Get protocol
    let div1 = document.createElement('div');
    div1.className = "warning"; // 2. Set its class to "message"
    div1.id = "warning"
    // 3. Set connection message
    div1.innerHTML = "<strong>Is the connection secure?</strong>\nThe site uses " + scheme.substring(0, scheme.length - 1) + "!";

    document.body.append(div1);
  }
});

document.getElementById("privacy").addEventListener("click", Analyze);

// Crawler code
function Analyze() {
  var pb = document.getElementById("privacy");
  if (pb){
    pb.style.display = "none";
  }
  let div = document.createElement('div');
  div.className = "message"; // 2. Set its class to "message"

  // 3. Fill it with the content
  div.innerHTML = "<strong>Great!</strong> You've checked the privacy of " + parser.hostname; // domain

  document.body.append(div);
  document.getElementById("warning").style.display = "none";

  // call analyzeText function
  analyzeText();
}

/* Text Analytics begins here */
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
const objectOutput = document.getElementById("returnedObject");

const license = "<p>Copyright 2020 PRIVIQ</p><p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p><p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p><p>THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>";

// we need to find a way to get the privacy info to this testValue variable!!!
//
let testValue = "Scrapped privacy text would be set to this variable!";
// 
//

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
      console.log(postData.documents[0].text);
      console.log(data);
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
  if (privacyTermMatches > 3) {
    objectOutput.innerHTML +=
      "<h1 class='match-response true'>This site will collect your data</h1>";
  } else {
    objectOutput.innerHTML +=
      "<h1 class='match-response false'>This site may collect your data</h1>";
  }
}