//
// Previz
// Francis Vega 2014
//


// User settings
// 
var Settings = {
	"title":"Presentacion",
	"dropboxiMacFolder": "/Volumes/Bucanero/Dropbox\ \(Secuoyas\)/Public/sandbox2/",
	"dropboxWinFolder": "/",
	"tempDir": "",
	"tempSystemDir": Folder.temp.fsName+"/",
	"jpgQuality":80,
	"baseFileName":"previz",
	"imageFormat":"jpg",
	"ext":""
};


// Photoshop Document Object
//
var Document = {


    isOpen: function () {
        opened = true;
        if(app.documents.length==0)
			opened = false;
		return opened;
    },

    savePNG: function (outputFolderStr, filename) {
	    var opts, file;

	    opts = new ExportOptionsSaveForWeb();    
	    opts.format = SaveDocumentType.PNG;
	    opts.transparency = true
	    opts.blur = 0.0
	    opts.includeProfile = false
	    opts.interlaced = false
	    opts.optimized = true
	    opts.quality = 100
	    opts.PNG8 = false

		file = new File(outputFolderStr + "/" + filename + ".png");
	    activeDocument.exportDocument(file, ExportType.SAVEFORWEB, opts);
    },

	saveJPG: function (outputFolderStr, filename) {
	    var opts, file;

	    opts = new ExportOptionsSaveForWeb();
	    opts.format = SaveDocumentType.JPEG;    
	    opts.includeProfile = false ;   
	    opts.quality = Settings["jpgQuality"];

		file = new File(outputFolderStr + "/" + filename + ".jpg");
	    activeDocument.exportDocument(file, ExportType.SAVEFORWEB, opts);
	}    


};


// Main function
//
function previz() {

	// system
	var MAC = false;
	var WIN = false;
	if (Folder.system == "/System") {
		MAC = true;
	} else {
		WIN = true;
	}	

	try {

		// Settings
		if (MAC) {
			Settings["tempDir"] = Settings["dropboxiMacFolder"]
		}

		if (WIN) {
			Settings["tempDir"] = Settings["dropboxWinFolder"]
		}

		// Image file export
		if (Settings["imageFormat"] == "png-24") {
			Document.savePNG(Settings["tempDir"], Settings["baseFileName"])
			Settings["ext"] = ".png"
		} else if (Settings["imageFormat"] == "jpg") {
			Document.saveJPG(Settings["tempDir"], Settings["baseFileName"])
			Settings["ext"] = ".jpg"
		}

		// WIN = .bat/.vbs
		// OSX = .sh

		if (WIN) {
			// .bat file
			var f = new File(Settings["tempDir"] + Settings["baseFileName"] + ".bat");
			f.open('w');
			f.write("@echo off\nstart " + Settings["tempDir"] + Settings["baseFileName"] + ".html");
			f.close();
			// VBS file. Hides the windows terminal when its open .bat
			var f = new File(Settings["tempDir"] + "/" + Settings["baseFileName"] + ".vbs");
			f.open('w');
			f.write('CreateObject("Wscript.Shell").Run "'+ Settings["tempDir"] + Settings["baseFileName"] + ".bat" +'", 0, True');
			f.close();
		} else {		
			// .sh file
			var f = new File(Settings["tempDir"] + Settings["baseFileName"] + ".sh");
			f.open('w');
			f.write("open " + Settings["tempDir"] + Settings["baseFileName"] + ".html");
			f.close();
		}


		// build html file
		var f = new File(Settings["tempDir"] + Settings["baseFileName"] + ".html");
		var width = app.activeDocument.width.as('px');
		var height = app.activeDocument.height.as('px');
		
		var html_file =
		'\
		<!--\
		\
			Browser Preview\
			Francis Vega\
		\
		-->\
		\
		<!DOCTYPE html>\
		<html>\
			<head>\
			<title>' + Settings["title"] + '</title>\
			<style>\
				* {\
					padding:0;\
					margin:0;\
				}\
				div {\
					height:' + height + 'px;\
					margin:0 auto;\
					background:url("' + Settings["baseFileName"] + Settings["ext"] + '") top center no-repeat;\
				}\
			</style>\
			</head>\
			<body>\
			<div></div>\
			</body>\
		</html>';

		f.open('w');
		f.write(html_file);
		f.close();

		if (WIN) {
			var checkout = new File(Settings["tempDir"] + Settings["baseFileName"] + ".vbs");
			checkout.execute();
		} else {	

			//var checkout = new File(Settings["tempDir"] + Settings["baseFileName"] + ".sh");
			var checkout = new File(Settings["tempDir"] + Settings["baseFileName"] + ".html");
			var k = checkout.execute();
		}

	} catch(e) { alert("No hay documentos abiertos") }

}


// Go :)
previz();
