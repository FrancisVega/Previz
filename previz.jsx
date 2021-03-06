//
// Previz
// Francis Vega 2014
//


//
// System Class
//

function System() { }


// methods
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
        alert("Estoy en el trabajo")
        return "work"
    } else {
        return "home"
    }
};

//
// Photoshop Doc Class
//

function Doc(settings) {
    // User settings
    this.settings = settings
    this.system = new System()

}


// methods

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
        file = new File(this.settings["tempDir"] + "/" + this.settings["baseFileName"] + ".jpg");
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
        file = new File(this.settings["tempDir"] + "/" + this.settings["baseFileName"] + ".png");
        activeDocument.exportDocument(file, ExportType.SAVEFORWEB, opts);
}



//
// Previz Class
//

function Previz(format) {
    this.system = new System()
    this.platform = this.system.platform()

    // User settings
    this.settings = {
        "title":"Presentacion",
        "dropboxHomeFolder": "/Volumes/Bucanero/Dropbox\ \(Secuoyas\)/Public/sandbox2/",
        "dropboxWorkFolder": "/",
        "tempDir": "",
        "tempSystemDir": Folder.temp.fsName+"/",
        "jpgQuality":80,
        "baseFileName":"previz",
        "format":"jpg",
        "ext":""
    }

    // New Photoshop doc with settings
    this.doc = new Doc(this.settings)
}


// methods

Previz.prototype.setTempDir = function() {
    var mySystem = new System()
    var computer = mySystem.wich()

    if (computer == "home") {
    if ()
        this.settings["tempDir"] = this.settings["dropboxHomeFolder"]
    } else {
        this.settings["tempDir"] = this.settings["dropboxWorkFolder"]
    }

    // Construct file paths
    this.baseFilePath = this.settings["tempDir"] + this.settings["baseFileName"]
    this.shFile = this.baseFilePath + ".sh"
    this.htmlFile = this.baseFilePath + ".html"
    this.imageFile = this.baseFilePath + this.settings["format"]
    this.batFile = this.baseFilePath + ".bat"
    this.vbsFile = this.baseFilePath + ".vbs"
}

Previz.prototype.writeScriptFile = function() {
    if (this.platform == "osx") {
        mySystem.writeFile( this.shFile, "open " + this.htmlFile )
    }

    if (this.platform == "win") {
        mySystem.writeFile( this.batFile, "@echo off\nstart " + this.htmlFile )
        mySystem.writeFile( this.vbsFile, 'CreateObject("Wscript.Shell").Run "'+ this.batFile +'", 0, True' )
    }
}

Previz.prototype.writeHTMLFile = function() {
    var f = new File(this.settings["tempDir"] + this.settings["baseFileName"] + ".html");
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
        if (this.platform == "win") {
            var checkout = new File(this.settings["tempDir"] + this.settings["baseFileName"] + ".vbs");
            checkout.execute();
        } else {
            //var checkout = new File(Settings["tempDir"] + Settings["baseFileName"] + ".sh");
            var checkout = new File(this.settings["tempDir"] + this.settings["baseFileName"] + ".html");
            var k = checkout.execute();
        }
}

Previz.prototype.go = function() {

    if (this.doc.isOpen()) {

        // Get system
        this.platform = new System().platform()

        // Set correct (os related) temp dir and file paths
        this.setTempDir()

        // Image file export
        this.doc.saveIMG()

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
var previz = new Previz("jpg").go()
