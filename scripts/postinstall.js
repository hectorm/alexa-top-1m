#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const decompress = require('decompress-unzip')();
const papa = require('papaparse');

https.get('https://s3.amazonaws.com/alexa-static/top-1m.csv.zip', response => {
	const data = [];
	response.on('data', chunk => data.push(chunk));
	response.on('end', () => {
		const zipBuf = Buffer.concat(data);
		decompress(zipBuf).then(files => {
			const csv = files[0].data.toString('utf8');
			const domains = papa.parse(csv).data.map(row => row[1]);
			fs.writeFileSync('top-1m.json', JSON.stringify(domains));
		});
	});
});
