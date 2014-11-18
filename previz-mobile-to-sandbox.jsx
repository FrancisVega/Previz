//
// Previz
// Francis Vega 2014
//


/*
    Classes
*/

// System
function System() { }

// Photoshop Doc
function Doc(settings) {
    this.settings = settings
    this.system = new System()
}

// Previz
function Previz(path, format) {
    this.system = new System()
    this.platform = this.system.platform()

    // User settings
    this.settings = {
        "title":"Presentacion",
        "baseFileName":"previz",
        "path":path,
        "format":format,
        "jpgQuality":100
    }

    // New Photoshop doc with settings
    this.doc = new Doc(this.settings)
}


/*
    Prototype methods
*/

// system methods

System.prototype.platform = function() {
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
    if (Folder("C:/Users").exists) {
        return "work"
    } else {
        return "home"
    }
}

// doc methods

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

// previz methods

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
    if (this.platform == "osx") {
        this.system.writeFile( this.shFile, "open " + this.htmlFile )
    }

    if (this.platform == "win") {
        this.system.writeFile( this.batFile, "@echo off\nstart " + this.htmlFile )
        this.system.writeFile( this.vbsFile, 'CreateObject("Wscript.Shell").Run "'+ this.batFile +'", 0, True' )
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
            .image {\
                width: 100%;\
                margin:0 auto;\
            }\
        </style>\
        </head>\
        <body>\
        <img class="image" src="'+ this.settings["baseFileName"] + "." + this.settings["format"] + '">\
        </body>\
    </html>';

    f.open('w');
    f.write(html_file);
    f.close();
}

Previz.prototype.launch = function() {
        if (this.platform == "win") {
            var checkout = new File(this.settings["path"] + this.settings["baseFileName"] + ".vbs");
            checkout.execute();
        } else {
            //var checkout = new File(Settings["path"] + Settings["baseFileName"] + ".sh");
            var checkout = new File(this.settings["path"] + this.settings["baseFileName"] + ".html");
            var k = checkout.execute();
        }
}

Previz.prototype.go = function() {

    if (this.doc.isOpen()) {

        // Get system
        this.platform = new System().platform()

        // Set correct (os related) temp dir and file paths
        this.setpath()

        // Image file export
        this.doc.saveIMG()

        // // Script file creation
        //this.writeScriptFile()

        // // HTML file creation
        this.writeHTMLFile()

        // // Launch html with .sh/.bat
        //this.launch()

    } else {
        alert ("No hay documento abierto")
    }
}



// Main
var os = new System()

var destinationPath
var format = "jpg"
var workPath = "C://Users//francis.vega//Dropbox (Secuoyas)//Public//sandbox//"
var homePath = ""

if (os.wich() == "work") {
    // Windows
    destinationPath = workPath
} else {
    // Osx
    destinationPath = homePath
}

// Main
var previz = new Previz(destinationPath, format).go()