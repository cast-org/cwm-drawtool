function makeGraph(x, y) {
	//this is required for some odd reason when using a <g /> element in svgedit
	$('#g_title').remove();
	$('<input id="g_title" type="hidden" value=""/>')
		.appendTo('body');
	
	x = $.extend({
		min: 0,
		max: 10
	}, x);
	
	y = $.extend({
		min: 0,
		max: 10
	}, y);
	
	console.log([x,y]);
	
	var g = {
		yPixel: {
			min: 10,
			max: 240
		},
		yBg: {
			template: '<line x1="40" x2="{xPixelMax}" y1="{yPixel}" y2="{yPixel}"/>',
			html: ''
		},
		yEdge: {
			template: '\
				<line x1="35" x2="40" y1="{yPixel}" y2="{yPixel}"/>\
                <line x1="32" x2="40" y1="{yPixelHalf}" y2="{yPixelHalf}"/>',
			html: ''
		},
		yLabel: {
			template: '<text x="35" y="{yPixel}">{yVal}</text>',
			html: ''
		},
		xPixel: {
			min: 40,
			max: 520
		},
		xBg: {
			template: '<line x1="{xPixel}" x2="{xPixel}" y1="10" y2="{yPixelMax}"/>',
			html: ''
		},
		xEdge: {
			template: '\
				<line x1="{xPixelHalf}" x2="{xPixelHalf}" y1="{yPixelMax}" y2="{yPixelMaxPlus}"/>\
				<line x1="{xPixel}" x2="{xPixel}" y1="{yPixelMax}" y2="{yPixelMaxPlus}"/>',
			html: ''
		},
		xLabel: {
			template: '<text x="{xPixel}" y="{yPixelMaxPlusPlus}">{xVal}</text>',
			html: ''
		}
	}
	
	x.size = (x.max - x.min) / 10;
	y.size = (y.max - y.min) / 10;
	g.yPixel.size = (g.yPixel.max - g.yPixel.min) / 10;
	g.xPixel.size = (g.xPixel.max - g.xPixel.min) / 10;
	
	var i = {
		x: x.max,
		y: y.min,
		xPixel: g.xPixel.min,
		yPixel: g.yPixel.min
	};
	
	function proc(template) {
		template = template
			.replace(/[{]xVal[}]/g, i.y)
			.replace(/[{]yVal[}]/g, i.x)
			.replace(/[{]xPixel[}]/g, i.xPixel)
			.replace(/[{]yPixel[}]/g, i.yPixel)
			.replace(/[{]xPixelMin[}]/g, g.xPixel.min)
			.replace(/[{]yPixelMin[}]/g, g.yPixel.min)
			.replace(/[{]xPixelMax[}]/g, g.xPixel.max)
			.replace(/[{]yPixelMax[}]/g, g.yPixel.max)
			.replace(/[{]xPixelMaxPlus[}]/g, g.xPixel.max + 10)
			.replace(/[{]yPixelMaxPlus[}]/g, g.yPixel.max + 10)
			.replace(/[{]xPixelMaxPlusPlus[}]/g, g.xPixel.max + 20)
			.replace(/[{]yPixelMaxPlusPlus[}]/g, g.yPixel.max + 20);
		
		var xHalf = i.xPixel + (g.xPixel.size / 2);
		var yHalf = i.yPixel + (g.yPixel.size / 2);
		
		if (xHalf > g.xPixel.min && xHalf < g.xPixel.max) {
			template = template.replace(/[{]xPixelHalf[}]/g, xHalf);
		} else {
			template = template.replace(/[{]xPixelHalf[}]/g, i.xPixel);
		}
		
		if (yHalf > g.yPixel.min && yHalf < g.yPixel.max) {
			template = template.replace(/[{]yPixelHalf[}]/g, yHalf);
		} else {
			template = template.replace(/[{]yPixelHalf[}]/g, i.yPixel);
		}
		
		return template;
	}
	
	while(i.x >= x.min) {
		g.yBg.html += proc(g.yBg.template);
		g.yEdge.html += proc(g.yEdge.template);
		g.yLabel.html += proc(g.yLabel.template);
		g.xBg.html += proc(g.xBg.template);
		g.xEdge.html += proc(g.xEdge.template);
		g.xLabel.html += proc(g.xLabel.template);
		
		i.x -= x.size;
		i.y += y.size;
		i.xPixel += g.xPixel.size;
		i.yPixel += g.yPixel.size;
	}
	
    var graph = $('<svg>\
        <g id="' + svgCanvas.getNextId() + '" value="Graph">\
            <g>\
                <rect x="40" y="10" width="' + (g.xPixel.max - 40) + '" height="' + (g.yPixel.max - 10) + '" fill="ivory" stroke="gray"/>\
                <g class="yGrid" stroke="gray" stroke-dasharray="2,2">\
                    ' + g.yBg.html + '\
                </g>\
                 <g class="xGrid" stroke="gray" stroke-dasharray="2,2">\
                    ' + g.xBg.html + '\
                </g>\
            </g>\
            <g class="yAxis" stroke="black" stroke-width="1">\
                ' + g.yEdge.html + '\
            </g>\
            <g class="yAxisLabels" text-anchor="end">\
                ' + g.yLabel.html + '\
            </g>\
            <g class="xAxis" stroke="black" stroke-width="1">\
                ' + g.xEdge.html + '\
            </g>\
            <g class="xAxisLabels" text-anchor="middle">\
                ' + g.xLabel.html + '\
            </g>\
            <text style="font-size: .8em;" x="0" y="' + (g.yPixel.max / 2) + '" fill="red">Y Axis</text>\
            <text style="font-size: .8em;" x="' + (g.xPixel.max / 2) + '" y="' + (g.yPixel.max + 30) + '" text-anchor="middle" fill="blue">X Axis</text>\
        </g>\
    </svg>');
	// if shape is a path but we need to create a rect/ellipse, then remove the path
	var drawing = svgCanvas.getCurrentDrawing();
	var g = graph.find('g:first')[0];
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
						title: "Please setup graph axis ranges",
						content: $('<div>\
							x-min:<input id="xmin" type="text" value="0"/>\
							x-max:<input id="xmax" type="text" value="10"/>\
							y-min:<input id="ymin" type="text" value="0"/>\
							x-max:<input id="ymax" type="text" value="10"/>\
						</div>'),
						buttons: {
							Cancel: function(me) {
								me.remove();
							},
							Ok: function(me) {
								makeGraph({
									min: me.find('#xmin').val() * 1,
									max: me.find('#xmax').val() * 1,
								},{
									min: me.find('#ymin').val() * 1,
									max: me.find('#ymax').val() * 1
								});
								
								svgEditor.canvas.setMode('select');
								
								me.remove();
							}
						}
					});
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