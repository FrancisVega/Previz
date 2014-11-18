// Photoshop Previz
// Francis Vega 2012
//
// Visualiza el documento activo de photoshop dentro de un navegador
//
// LICENCIA: Usa esto como te de la real gana :)
//
// Notas:
// La imagen se maqueta en el centro
// Por ahora solo funciona en windows (uso .bat y .vbs) pero solo para lanzar el navegador hasta que encuentre como hacerlo dede el propio js
//


// Clases
var Document = {
    isOpen: function () {
        opened = true;
        if(app.documents.length==0)
			opened = false;
		return opened;
    }
};

// Funciones
function saveForWebPNG(outputFolderStr, filename) {
    var opts, file;
    opts = new ExportOptionsSaveForWeb();
    opts.format = SaveDocumentType.PNG;
    opts.PNG8 = false;
    opts.quality = image_quality;

	file = new File(outputFolderStr + "/" + filename + ".png");
    activeDocument.exportDocument(file, ExportType.SAVEFORWEB, opts);
}

function saveForWebJPG(outputFolderStr, filename) {
    var opts, file;
    opts = new ExportOptionsSaveForWeb();
    opts.format = SaveDocumentType.JPEG;
    opts.quality = image_quality;

	file = new File(outputFolderStr + "/" + filename + ".jpg");
    activeDocument.exportDocument(file, ExportType.SAVEFORWEB, opts);
}

try {

	// EDITAR VARIABLES
	var web_title = "Presentacion";
	//var temp_dir = Folder.temp.fsName + "/"
	var dropboxiMacFolder = "/Volumes/Bucanero/Dropbox\ \(Secuoyas\)/Public/sandbox/";
		temp_dir = dropboxiMacFolder;


	//var temp_dir = "C:/Users/francis.vega/Dropbox/Public"
	var base_file_name = "previz";
	var image_format = "jpg" // jpg / png-24
	var image_quality = 80;
	var ext = ""
	var layout_type = "center"

	// system
	var MAC = false;
	var WIN = false;
	if (Folder.system == "/System") {
		MAC = true
	} else {
		WIN = true
	}	

	// CREAMOS (EXPORTAMOS) LA IMAGEN
	if (image_format == "png-24") {
		saveForWebPNG(temp_dir, base_file_name);
		ext = ".png"
	} else if (image_format == "jpg") {
		saveForWebJPG(temp_dir, base_file_name)
		ext = ".jpg"
	}

	// WIN = .bat/.vbs MAC = .sh
	if (WIN) {
		// CREAMOS EL ARCHIVO .BAT
		var a = new File(temp_dir + base_file_name + ".bat");
		a.open('w');
		a.write("@echo off\nstart " + temp_dir + base_file_name + ".html");
		a.close();

		// CREAMOS EL ARCHIVO VBS (PARA OCULTAR LA CONSOLA AL EJECUTAR EL .BAT)
		var a = new File(temp_dir + "/" + base_file_name + ".vbs");
		a.open('w');
		a.write('CreateObject("Wscript.Shell").Run "'+ temp_dir + base_file_name + ".bat" +'", 0, True');
		a.close();

	} else {		
		// Creamos un .sh
		var a = new File(temp_dir + base_file_name + ".sh");
		a.open('w');
		a.write("open " + temp_dir + base_file_name + ".html");
		a.close();	
	}

	// CREAMOS EL ARHIVO .HTML
	var a = new File(temp_dir + base_file_name + ".html");
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
        <title>' + web_title + '</title>\
        <style>\
            * {\
                padding:0;\
                margin:0;\
            }\
            div {\
                height:' + height + 'px;\
                margin:0 auto;\
                background:url("' + base_file_name + ext + '") top center no-repeat;\
            }\
        </style>\
        </head>\
        <body>\
        <div></div>\
        </body>\
    </html>';


	a.open('w');
	a.write(html_file);
	a.close();

	if (WIN) {
		// EJECUTAMOS EL .VBS QUE LANZARA EL NAVEGADOR Y LA PAGINA WEB (HTML+JPG)
		var checkout = new File(temp_dir + base_file_name + ".vbs");
		checkout.execute();
	} else {
		// EJECUTAMOS EL .SH QUE LANZARA EL NAVEGADOR Y LA PAGINA WEB (HTML+JPG)
		var checkout = new File(temp_dir + base_file_name + ".html");
		checkout.execute();	
	}

} catch(e) { }