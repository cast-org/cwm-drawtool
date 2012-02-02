function makeGraph(x, y, showGrid) {
	//this is required for some odd reason when using a <g /> element in svgedit
	$('#g_title').remove();
	$('<input id="g_title" type="hidden" value=""/>')
		.appendTo('body');
	
	x = $.extend({
		i: 0,
		min: 0,
		max: 10,
		size: 0,
		pixel: {
			i: 0,
			min: 50,
			max: 520,
			size: 0
		}
	}, x);
	
	y = $.extend({
		i: 0,
		min: 0,
		max: 10,
		size: 0,
		pixel: {
			i: 0,
			min: 10,
			max: 240,
			size: 0
		}
	}, y);
	
	x.template = {
		bg: 	'<line x1="' + x.pixel.min + '" x2="' + x.pixel.max + '" y1="{yPixel}" y2="{yPixel}"/>',
		edge: 	'<line x1="' + (x.pixel.min - 5) + '" x2="' + x.pixel.min + '" y1="{yPixel}" y2="{yPixel}"/>\
				<line x1="' + (x.pixel.min - 2) + '" x2="' + x.pixel.min + '" y1="{yPixelHalf}" y2="{yPixelHalf}"/>',
		label: 	'<text x="{xPixel}" y="' + (y.pixel.max + 15) + '">{xVal}</text>'
	};
	
	y.template = {
		bg: 	'<line x1="{xPixel}" x2="{xPixel}" y1="' + y.pixel.min + '" y2="' + y.pixel.max + '"/>',
		edge: 	'<line x1="{xPixel}" x2="{xPixel}" y1="' + y.pixel.max + '" y2="' + (y.pixel.max + 5) + '"/>\
				<line x1="{xPixelHalf}" x2="{xPixelHalf}" y1="' + y.pixel.max + '" y2="' + (y.pixel.max + 2) + '"/>',
		label: 	'<text x="' + (x.pixel.min - 7) + '" y="{yPixelText}" style="top: 10px; position: relative;">{yVal}</text>'
	};
	
	x.html = {
		bg: '',
		edge: '',
		label: ''
	};
	
	y.html = {
		bg: '',
		edge: '',
		label: ''
	};
	
	function dec(v) {
		if (parseInt(v) != v) {
			return v.toFixed(2) * 1;
		}
		
		return v;
	}
	
	function proc(template) {
		template = template
			.replace(/[{]xVal[}]/g, dec(x.i))
			.replace(/[{]yVal[}]/g, dec(y.i))
			.replace(/[{]xPixel[}]/g, dec(x.pixel.i))
			.replace(/[{]yPixel[}]/g, dec(y.pixel.i))
			.replace(/[{]yPixelText[}]/g, dec(y.pixel.i) + 3);
		
		var xHalf = x.pixel.i + (x.pixel.size / 2);
		var yHalf = y.pixel.i + (y.pixel.size / 2);
		
		if (xHalf > x.pixel.min && xHalf < x.pixel.max) {
			template = template.replace(/[{]xPixelHalf[}]/g, xHalf);
		} else {
			template = template.replace(/[{]xPixelHalf[}]/g, x.pixel.i);
		}
		
		if (yHalf > y.pixel.min && yHalf < y.pixel.max) {
			template = template.replace(/[{]yPixelHalf[}]/g, yHalf);
		} else {
			template = template.replace(/[{]yPixelHalf[}]/g, y.pixel.i);
		}
		
		return template;
	}
	
	x.size = (x.max - x.min) / 10;
	y.size = (y.max - y.min) / 10;

	x.pixel.size = (x.pixel.max - x.pixel.min) / 10;
	y.pixel.size = (y.pixel.max - y.pixel.min) / 10;
	
	x.i = x.min;
	y.i = y.max;
	
	x.pixel.i = x.pixel.min;
	y.pixel.i = y.pixel.min;
	
	while(y.i >= y.min) {
		y.html.bg 		+= 	proc(y.template.bg);
		y.html.edge 	+= 	proc(y.template.edge);
		y.html.label 	+=	proc(y.template.label);
		
		x.html.bg 		+= 	proc(x.template.bg);
		x.html.edge 	+= 	proc(x.template.edge);
		x.html.label 	+=	proc(x.template.label);
		
		x.i += x.size;
		y.i -= y.size;
		
		x.pixel.i += x.pixel.size;
		y.pixel.i += y.pixel.size;
	}
	
    var graph = $('<svg>\
        <g id="' + svgCanvas.getNextId() + '" value="Graph">\
            <g>\
                <rect x="' + x.pixel.min + '" y="' + y.pixel.min + '" width="' + (x.pixel.max - 50) + '" height="' + (y.pixel.max - 10) + '" style="fill:ivory;opacity:0.8;stroke:gray;"/>\
                ' + (showGrid ? '<g class="yGrid" stroke="gray" stroke-dasharray="2,2">\
                    ' + y.html.bg + '\
                </g>\
                 <g class="xGrid" stroke="gray" stroke-dasharray="2,2">\
                    ' + x.html.bg + '\
                </g>\
                ' : '') + '\
            </g>\
            <g class="yAxis" stroke="black" stroke-width="1">\
                ' + y.html.edge + '\
            </g>\
            <g class="yAxisLabels" text-anchor="end">\
                ' + y.html.label + '\
            </g>\
            <g class="xAxis" stroke="black" stroke-width="1">\
                ' + x.html.edge + '\
            </g>\
            <g class="xAxisLabels" text-anchor="middle">\
                ' + x.html.label + '\
            </g>\
            <text style="font-size: .8em;" x="0" y="' + (y.pixel.max / 2) + '"	>Y Axis</text>\
            <text style="font-size: .8em;" x="' + (x.pixel.max / 2) + '" y="' + (y.pixel.max + 30) + '">X Axis</text>\
        </g>\
    </svg>');
   	
	// if shape is a path but we need to create a rect/ellipse, then remove the path
	var drawing = svgCanvas.getCurrentDrawing();
	var g = graph.children()[0];
	var current_layer = drawing.getCurrentLayer();
	current_layer.appendChild(g);
}

svgEditor.addExtension("cwm-graph-axis", function() {
	return {
		svgicons: "svgedit/extensions/ext-shapes.xml",
		buttons: [{
			id: "cast_drawing_graph_axis",
			type: "context",
			panel: "buttons_starters",
			title: "Graph Axis",
			events: {
				"mouseup": function() {
					CastTabs.dialog({
						title: "Setup your graph",
						content: $('<table style="width: 100%;border-collapse:collapse; border: none;">\
							<tr>\
								<td style="width: 80px; vertical-align: top;">Y max:<input id="ymax" type="text" value="10" style="width: 25px;"/></td>\
								<td style="width: 1px; background-color: black;"></td>\
								<td colspan="2" rowspan="3">\
									<style type="text/css">\
									.genGraph {\
										border-collapse:collapse;\
										width: 100%;\
										border-collapse:collapse;\
									}\
									.genGraph, .genGraph td {\
										border:1px dashed black;\
									}\
									</style>\
									<table class="genGraph">\
										<tr>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
										</tr>\
										<tr>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
										</tr>\
										<tr>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
										</tr>\
										<tr>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
										</tr>\
										<tr>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
										</tr>\
										<tr>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
										</tr>\
										<tr>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
										</tr>\
										<tr>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
										</tr>\
										<tr>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
										</tr>\
										<tr>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
											<td>&nbsp;</td>\
										</tr>\
									</table>\
								</td>\
							</tr>\
							<tr>\
								<td></td>\
								<td style="background-color: black;"></td>\
							</tr>\
							<tr>\
								<td>Y min:<input id="ymin" type="text" value="0" style="width: 25px;"/></td>\
								<td style="background-color: black; height: 1px;"></td>\
							</tr>\
							<tr>\
								<td></td>\
								<td style="background-color: black; height: 1px;"></td>\
								<td style="background-color: black; height: 1px;"></td>\
								<td style="background-color: black; height: 1px; width: 50px;"></td>\
							</tr>\
							<tr>\
								<td></td>\
								<td></td>\
								<td><input id="xmin" type="text" value="0" style="width: 25px;"/></td>\
								<td><input id="xmax" type="text" value="10" style="width: 25px;"/></td>\
							</tr>\
							<tr>\
								<td></td>\
								<td></td>\
								<td>X min:</td>\
								<td>X max:</td>\
							</tr>\
						</div>'),
						inputs: [{
							value: 'true',
							label: 'include grid lines',
							type: 'checkbox',
							events: {
								mouseup: function() {
									var o = $(this);
									setTimeout(function() {
										if (o.is(':checked')) {
											$('.genGraph').show();
										} else {
											$('.genGraph').hide();
										}
									}, 1);
								}
							}
						}],
						buttons: {
							Cancel: function(me) {
								me.remove();
							},
							Ok: function(me, inputs) {
								var x = {
									min: me.find('#xmin').val() * 1,
									max: me.find('#xmax').val() * 1
								};
								var y = {
									min: me.find('#ymin').val() * 1,
									max: me.find('#ymax').val() * 1
								};
								
								console.log([isNaN(y.min) , isNaN(y.max) , isNaN(x.min) , isNaN(x.max)]);
								
								if (x.min >= x.max || y.min >= y.max || isNaN(y.min) || isNaN(y.max) || isNaN(x.min) || isNaN(x.max)) {
									me.hide();
									CastTabs.dialog({
										title: "Problem with your settings",
										content: 'It looks like there is a problem with your settings. Please ensure that min is smaller than max and that you have input numbers.',
										buttons: {
											Ok: function(me1) {
												me1.remove();
												me.show();
											}
										}
									});
									return;
								} 
								
								makeGraph(x, y, inputs[0].obj.is(':checked'));
								
								svgEditor.canvas.setMode('select');
								
								me.remove();
							}
						},
						width: 350
					});
					
					$('.genGraph')
						.parent()
						.height(
							$('.genGraph').height() + 4
						);
					
					$('.genGraph').hide();
				}
			}
		}],
		callback: function() {
			$.resizeSvgIcons({
				"#cast_drawing_graph_axis .svg_icon": [46,30],
			});
		}
	}
});