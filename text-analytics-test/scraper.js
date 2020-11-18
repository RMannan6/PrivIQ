
var urls = [];
// the privacy URL of the website
var privacyURL;
for(var i = document.links.length; i --> 0;)
	var name = document.links[i].href;
	if (name.indexOf("privacy-policy") > -1) {
		privacyURL = name;
	} else if (name.indexOf("privacy") > -1) {
		privacyURL = name;
	}
	// saving all the URLs for future work
	urls.push(name);
	
	
const axios = require('axios');
const cheerio = require('cheerio');
// text that stores the privacy policy of the web page
var data;

axios.get(url)
  .then(response => {
    const html = response.data;
	const $ = cheerio.load(html);
	// console.log(html);
	$('p, h1, h2').each(function(i, elem) {
		data = $(this).text().trim();
		console.log($(this).find('p').text().trim());
	});
  })
  .catch(error => {
    console.log(error);
  })
	
	
	