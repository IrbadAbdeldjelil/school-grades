const fs = require("fs");
const path = require('path');
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

function tkwinShahadat(grades) {

const content = fs.readFileSync(path.join(__dirname, 'shahadat.docx'));
	const zip = new PizZip(content);
	
	const doc = new Docxtemplater(zip, {
		paragraphLoop: true,
		linebreaks: true,
		nullGetter: ()=>" " // في حالة undefinedيطبع مسافة 
	})
	
	doc.render({students:grades});
	const buffer = doc.getZip().generate({type:'nodebuffer'});
	
	return buffer;
}

module.exports = {tkwinShahadat}