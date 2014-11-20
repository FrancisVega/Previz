//
// Previz
// Francis Vega 2014
//


// System
// Class
function System() { }

// Methods
System.prototype.os = function() {
    if (Folder.system == "/System") {
        return "osx"
    } else {
        return "win"
    }
}

System.prototype.writeFile = function(filePath, str) {
    try {
        var f = new File(filePath);
        f.open('w');
        f.write(str);
        f.close();
    } catch (e) {
        return false
    }
}

System.prototype.wich = function() {
    if (Folder("/var").exists) {
        return "home"
    } else {
        return "work"
    }
}


// Photoshop Doc
// Class
function Doc(settings) {
    // Dictionarty of settings
    this.settings = settings
}

// Methods
Doc.prototype.isOpen = function() {
    if(app.documents.length==0)
        return false
    return true
}

Doc.prototype.saveIMG = function() {
    switch(this.settings["format"]) {
        case "jpg":
            this.saveJPG()
            break;
        case "png":
            this.savePNG()
            break;
    }
}

Doc.prototype.saveJPG = function() {
        var opts, file;
        opts = new ExportOptionsSaveForWeb();
        opts.format = SaveDocumentType.JPEG;
        opts.includeProfile = false ;
        opts.quality = this.settings["jpgQuality"];
        file = new File(this.settings["path"] + "/" + this.settings["baseFileName"] + ".jpg");
        activeDocument.exportDocument(file, ExportType.SAVEFORWEB, opts);
}

Doc.prototype.savePNG = function(outputFolderStr, filename) {
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
        file = new File(this.settings["path"] + "/" + this.settings["baseFileName"] + ".png");
        activeDocument.exportDocument(file, ExportType.SAVEFORWEB, opts);
}

// Previz
// Class
function Previz(path, format) {

    // User settings
    this.settings = {
        "title":"Presentacion",
        "baseFileName":"previz",
        "path":path,
        "format":format,
        "jpgQuality":100
    }

}

// Methods
Previz.prototype.setpath = function() {
    // Construct file paths
    var baseFilePath = this.settings["path"] + this.settings["baseFileName"]
    this.shFile = baseFilePath + ".sh"
    this.htmlFile = baseFilePath + ".html"
    this.imageFile = baseFilePath + this.settings["format"]
    this.batFile = baseFilePath + ".bat"
    this.vbsFile = baseFilePath + ".vbs"
}

Previz.prototype.writeScriptFile = function() {

    if (MY_COMPUTER == "home") {
        MY_SYSTEM.writeFile( this.shFile, "open " + this.htmlFile )
    }

    if (MY_COMPUTER == "work") {
        MY_SYSTEM.writeFile( this.batFile, "@echo off\nstart " + this.htmlFile )
        MY_SYSTEM.writeFile( this.vbsFile, 'CreateObject("Wscript.Shell").Run "'+ this.batFile +'", 0, True' )
    }
}

Previz.prototype.writeHTMLFile = function() {
    var f = new File(this.settings["path"] + this.settings["baseFileName"] + ".html");
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
        <title>' + this.settings["title"] + '</title>\
        <style>\
            * {\
                padding:0;\
                margin:0;\
            }\
            div {\
                height:' + height + 'px;\
                margin:0 auto;\
                background:url("' + this.settings["baseFileName"] + "." + this.settings["format"] + '") top center no-repeat;\
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
}

Previz.prototype.launch = function() {

        if (MY_COMPUTER == "work") {
            var checkout = new File(this.settings["path"] + this.settings["baseFileName"] + ".vbs");
            checkout.execute();
        }

        if (MY_COMPUTER == "home") {
            // Html file
            var htmlFile = this.settings["path"] + this.settings["baseFileName"] + ".html"
            // Apple quarantine
            app.system('xattr -w com.apple.quarantine "0000;4b3a40d0;Safari;|com.apple.Safari" ' + htmlFile)
            var checkout = new File(htmlFile);
            checkout.execute();
        }
}

Previz.prototype.go = function() {

    // New Photoshop doc with settings
    var doc = new Doc(this.settings)

    if (doc.isOpen()) {

        // Set correct (OS related) temp dir and file paths
        this.setpath()

        // Image file export
        doc.saveIMG()

        // // Script file creation
        this.writeScriptFile()

        // // HTML file creation
        this.writeHTMLFile()

        // // Launch html with .sh/.bat
        this.launch()

    } else {
        alert ("No hay documento abierto")
    }
}

// Main
// Globals
var DESTINATION_PATH = Folder.temp.fsName + "/"
var FORMAT = "jpg"
var MY_SYSTEM = new System()
var MYOS = MY_SYSTEM.os()
var MY_COMPUTER = MY_SYSTEM.wich()

// Main
var previz = new Previz(DESTINATION_PATH, FORMAT).go()
