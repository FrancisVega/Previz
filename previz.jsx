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



//
// Photoshop Doc Class
//

function Doc(format) {

    // Export format
    this.format = format

    // User settings
    this.settings = {
        "title":"Presentacion",
        "dropboxiMacFolder": "/Volumes/Bucanero/Dropbox\ \(Secuoyas\)/Public/sandbox2/",
        "dropboxWinFolder": "/",
        "tempDir": "",
        "tempSystemDir": Folder.temp.fsName+"/",
        "jpgQuality":80,
        "baseFileName":"previz",
        "imageFormat":"jpg",
        "ext":""
    }

}


// methods

Doc.prototype.isOpen = function() {
    if(app.documents.length==0)
        return false
    return true
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
        activeDocument.exportDocument(file, ExportType.SAVEFORWEB, opts);}

Doc.prototype.saveIMG = function() {
    switch(this.format) {
        case "jpg":
            this.saveJPG()
            break;
        case "png":
            this.savePNG()
            break;
    }
}

Doc.prototype.writeScriptFile = function() {
    if (this.platform == "osx") {
        var f = new File(this.settings["tempDir"] + this.settings["baseFileName"] + ".sh")
        f.open("w")
        f.write("open " + this.settings["tempDir"] + this.settings["baseFileName"] + ".html")
        f.close()
    } else if (this.platform == "win") {
        var f = new File(this.settings["tempDir"] + this.settings["baseFileName"] + ".bat")
        f.open('w');
        f.write("@echo off\nstart " + this.settings["tempDir"] + this.settings["baseFileName"] + ".html");
        f.close();
        // VBS file. Hides the windows terminal when its open .bat
        var f = new File(this.settings["tempDir"] + "/" + this.settings["baseFileName"] + ".vbs");
        f.open('w');
        f.write('CreateObject("Wscript.Shell").Run "'+ this.settings["tempDir"] + this.settings["baseFileName"] + ".bat" +'", 0, True');
        f.close();
    }
}

Doc.prototype.writeHTMLFile = function() {
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
                background:url("' + this.settings["baseFileName"] + "." + this.format + '") top center no-repeat;\
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

Doc.prototype.launch = function() {
        if (this.platform == "win") {
            var checkout = new File(this.settings["tempDir"] + this.settings["baseFileName"] + ".vbs");
            checkout.execute();
        } else {
            //var checkout = new File(Settings["tempDir"] + Settings["baseFileName"] + ".sh");
            var checkout = new File(this.settings["tempDir"] + this.settings["baseFileName"] + ".html");
            var k = checkout.execute();
        }
}

Doc.prototype.setTempDir = function() {
    if (this.platform == "osx") {
        this.settings["tempDir"] = this.settings["dropboxiMacFolder"]
    } else {
        this.settings["tempDir"] = this.settings["dropboxWinFolder"]
    }
}

Doc.prototype.previz = function() {
    
    this.system = new System()
    this.platform = this.system.platform()

    try {

        // Set correct temp dir
        this.setTempDir()

        // Image file export
        this.saveIMG()

        // Script file creation
        this.writeScriptFile()

        // HTML file creation
        this.writeHTMLFile()

        // Launch html with .sh/.bat
        this.launch()

    } catch(e) {
        alert ("error")
    }
}


// Main
var doc = new Doc("jpg").previz()

