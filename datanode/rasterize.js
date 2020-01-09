function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()), //< defensive code
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
				//console.log("Waiting for condition to be", (!condition));
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'ERROR: Time out");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 1000); //< repeat check every 250ms
};


var page = require('webpage').create(),
    system = require('system'),
    address, output, size;

if (system.args.length < 3 || system.args.length > 5) {
    console.log('Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat] [zoom]');
    console.log('  paper (pdf output) examples: "5in*7.5in", "10cm*20cm", "A4", "Letter"');
    phantom.exit(1);
} else {
    address = system.args[1];
    output = system.args[2];
    //page.viewportSize = { width: 600, height: 600 };
	page.viewportSize = { width: 1280, height: 1024 };
    if (system.args.length > 3 && system.args[2].substr(-4) === ".pdf") {
        size = system.args[3].split('*');
        page.paperSize = size.length === 2 ? { width: size[0], height: size[1], margin: '0px' }
                                           : { format: system.args[3], orientation: 'portrait', margin: '1cm' };
    }
    if (system.args.length > 4) {
        page.zoomFactor = system.args[4];
    }
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
            phantom.exit();
        } else {
			waitFor(function(){
				return page.evaluate(function(){
				// We wait until the diagram is positioned
				if(document.getElementsByTagName("svg") && document.getElementsByTagName('svg')[0].getAttribute("data-done") && document.getElementsByTagName('svg')[0].getAttribute("data-done") == "1"){
					return true;
				}else{
					return false;
				}});
			},function () {
				// We only want to render the SVG picture
				page.clipRect = page.evaluate(function () { 
					return document.getElementsByTagName('svg')[0].getBoundingClientRect(); 
				});        
                page.render(output);
                phantom.exit();
            }, 10000);
        }
    });
}
