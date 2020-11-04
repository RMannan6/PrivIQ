'use strict';

let https = require ('https');

const subscription_key = "659f9c405d9f4c4ca9671ea7eec23117";
const endpoint = "https://text-antlytics-test.cognitiveservices.azure.com/";

let path = '/text/analytics/v3.0/keyPhrases';

let response_handler = function (response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        let body_ = JSON.parse(body);
        let body__ = JSON.stringify(body_, null, '  ');
        console.log(body__);
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

let get_key_phrases = function (documents) {
    let body = JSON.stringify(documents);

    let request_params = {
        method: 'POST',
        hostname: (new URL(endpoint)).hostname,
        path: path,
        headers: {
            'Ocp-Apim-Subscription-Key': subscription_key,
        }
    };

    let req = https.request(request_params, response_handler);
    req.write(body);
    req.end();
}

let documents = {
    'documents': [
        { 'id': '1', 'language': 'en', 'text': 'We collect information. The information we collect includes unique identifiers, browser type and settings, device type and settings, operating system, mobile network information including carrier name and phone number, and application version number.' },
        { 'id': '2', 'language': 'es', 'text': 'We may share Other Information about you with third parties, including, but not limited to, advertising and remarketing providers, or other brand partners, for purposes of personalizing or otherwise understanding how you engage with ads or other content.' }
    ]
};

get_key_phrases(documents);