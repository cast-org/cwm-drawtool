//This is a hack into $.svgIcons because svg-edit doesn't allow for an override on icon width
var svgIcons = $.svgIcons;
$.svgIcons = function(path, conf) {
	if (path.match('cast/images/cast_icons.svg')) {
		conf.w = 70;
		conf.h = 30;
	} else if (path.match('cast/images/svg_edit_icons.svg')) {
		conf.w = 47;
		conf.h = 30;
	} else if (path.match('svgedit/extensions/ext-shapes.xml')) {
		conf.w = 24;
		conf.h = 24;
	} else {
		conf.w = 44;
		conf.h = 19;
	}
	
	var icons = svgIcons(path, conf);
	
	return icons;
};