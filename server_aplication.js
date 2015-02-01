var soap = require('soap-server');
var fs = require("fs");
var gm = require('gm');
var easyimg = require('easyimage');

var Data;
var serverInstance = new soap.SoapServer();

var imgSizeMob = 320;
var imgSizeOrg = 1000;
var image = "mapa.jpg";
var out_image = "out.jpg";


fs.readFile(image, function(err, original_data){
	if (err) {
		throw err;
	}
    Data= new Buffer(original_data, 'binary').toString('base64');
});

/**
 *
 * @constructor
 */
function Service(){};
Service.prototype.customCb = function(d) {};
Service.prototype.getmapfragment = function(sx, sy, ex, ey){
    var that = this;
    if (sx == 0 && sy == 0 && ex == 0 && ey == 0)
        that.customCb(Data);
    else
        __loadImage(sx, sy, ex, ey, function(data) { that.customCb(data); });
};

soapService = serverInstance.addService('getmapfragment', new Service());
serverInstance.listen(process.env.PORT||777, '0.0.0.0');


/**
 * This loads and image form the mobile resolution to org res and
 * get back the result
 
 */
function __loadImage(sx, sy, ex, ey, cb) {
    var _x = (sx/imgSizeMob)*imgSizeOrg;
    var _y = (sy/imgSizeMob)*imgSizeOrg;
    var width = (ex/imgSizeMob)*imgSizeOrg;
    var height = (ey/imgSizeMob)*imgSizeOrg;
    easyimg.crop(
        {
            src:image, dst:out_image,
            cropwidth: width, cropheight:height,
            gravity:'NorthWest',
            x:_x, y:_y
        }).then(function(){
            fs.readFile(out_image, function(err, original_data){
				if (err) {
					return cb(err);
				}
                cb(new Buffer(original_data, 'binary').toString('base64'));
            });
        }).catch(function(err) {
			return cb.err;
		});
};