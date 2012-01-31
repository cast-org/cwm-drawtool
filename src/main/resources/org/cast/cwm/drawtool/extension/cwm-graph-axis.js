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
	
    var graph = $('<svg>\
        <g id="' + svgCanvas.getNextId() + '" transform="scale(0.3,0.3)" value="Graph">\
            <g>\
                <rect x="117.30000000000001" y="60" width="997.05" height="480" fill="ivory" stroke="gray"/>\
                <g stroke="gray" stroke-dasharray="2,2">\
                    <line x1="117.30000000000001" y1="540" x2="1114.35" y2="540"/>\
                    <line x1="117.30000000000001" y1="492" x2="1114.35" y2="492"/>\
                    <line x1="117.30000000000001" y1="444" x2="1114.35" y2="444"/>\
                    <line x1="117.30000000000001" y1="396" x2="1114.35" y2="396"/>\
                    <line x1="117.30000000000001" y1="348" x2="1114.35" y2="348"/>\
                    <line x1="117.30000000000001" y1="300" x2="1114.35" y2="300"/>\
                    <line x1="117.30000000000001" y1="252" x2="1114.35" y2="252"/>\
                    <line x1="117.30000000000001" y1="204" x2="1114.35" y2="204"/>\
                    <line x1="117.30000000000001" y1="156" x2="1114.35" y2="156"/>\
                    <line x1="117.30000000000001" y1="108" x2="1114.35" y2="108"/>\
                    <line x1="117.30000000000001" y1="60" x2="1114.35" y2="60"/>\
                </g>\
            </g>\
            <g class="yAxis" stroke="black" stroke-width="1">\
                <line x1="117.30000000000001" y1="60" x2="117.30000000000001" y2="540"/>\
                <line x1="107.30000000000001" y1="540" x2="117.30000000000001" y2="540"/>\
                <line x1="112.30000000000001" y1="516" x2="117.30000000000001" y2="516"/>\
                <line x1="107.30000000000001" y1="492" x2="117.30000000000001" y2="492"/>\
                <line x1="112.30000000000001" y1="468" x2="117.30000000000001" y2="468"/>\
                <line x1="107.30000000000001" y1="444" x2="117.30000000000001" y2="444"/>\
                <line x1="112.30000000000001" y1="420" x2="117.30000000000001" y2="420"/>\
                <line x1="107.30000000000001" y1="396" x2="117.30000000000001" y2="396"/>\
                <line x1="112.30000000000001" y1="372" x2="117.30000000000001" y2="372"/>\
                <line x1="107.30000000000001" y1="348" x2="117.30000000000001" y2="348"/>\
                <line x1="112.30000000000001" y1="324" x2="117.30000000000001" y2="324"/>\
                <line x1="107.30000000000001" y1="300" x2="117.30000000000001" y2="300"/>\
                <line x1="112.30000000000001" y1="276" x2="117.30000000000001" y2="276"/>\
                <line x1="107.30000000000001" y1="252" x2="117.30000000000001" y2="252"/>\
                <line x1="112.30000000000001" y1="228" x2="117.30000000000001" y2="228"/>\
                <line x1="107.30000000000001" y1="204" x2="117.30000000000001" y2="204"/>\
                <line x1="112.30000000000001" y1="180" x2="117.30000000000001" y2="180"/>\
                <line x1="107.30000000000001" y1="156" x2="117.30000000000001" y2="156"/>\
                <line x1="112.30000000000001" y1="132" x2="117.30000000000001" y2="132"/>\
                <line x1="107.30000000000001" y1="108" x2="117.30000000000001" y2="108"/>\
                <line x1="112.30000000000001" y1="84" x2="117.30000000000001" y2="84"/>\
                <line x1="107.30000000000001" y1="60" x2="117.30000000000001" y2="60"/>\
            </g>\
            <g class="yAxisLabels" text-anchor="end">\
                <text x="107.30000000000001" y="540">0</text>\
                <text x="107.30000000000001" y="492">10</text>\
                <text x="107.30000000000001" y="444">20</text>\
                <text x="107.30000000000001" y="396">30</text>\
                <text x="107.30000000000001" y="348">40</text>\
                <text x="107.30000000000001" y="300">50</text>\
                <text x="107.30000000000001" y="252">60</text>\
                <text x="107.30000000000001" y="204">70</text>\
                <text x="107.30000000000001" y="156">80</text>\
                <text x="107.30000000000001" y="108">90</text>\
                <text x="107.30000000000001" y="60">100</text>\
            </g>\
            <g class="xAxis" stroke="black" stroke-width="1">\
                <line x1="117.30000000000001" y1="540" x2="1114.35" y2="540"/>\
                <line x1="117.30000000000001" y1="540" x2="117.30000000000001" y2="550"/>\
                <line x1="381.22499999999997" y1="540" x2="381.22499999999997" y2="550"/>\
                <line x1="615.8249999999999" y1="540" x2="615.8249999999999" y2="550"/>\
                <line x1="850.425" y1="540" x2="850.425" y2="550"/>\
            </g>\
            <g class="xAxisLabels" text-anchor="middle">\
            	<text x="115.92499999999995" y="560">2000</text>\
                <text x="379.92499999999995" y="560">2002</text>\
                <text x="615.525" y="560">2004</text>\
                <text x="850.125" y="560">2005</text>\
                <text x="1099.7249999999999" y="560">2006</text>\
            </g>\
            <!--<text x="0" y="0" text-anchor="middle" transform="translate(77.30000000000001,300) rotate(-90)">Percentage</text>\
            <text x="615.825" y="580" text-anchor="middle" fill="green">Year</text>-->\
        </g>\
    </svg>');
	// if shape is a path but we need to create a rect/ellipse, then remove the path
	var drawing = svgCanvas.getCurrentDrawing();
	var element = $(drawing.svgElem_);
	var width = element.width();
	var height = element.height();
	var g = graph.find('g:first')[0];
	var current_layer = drawing.getCurrentLayer();
	if (current_layer) {
		current_layer.appendChild(g);
	}
	
	//this tricks the resize to stay transformed
	$(g)
		.trigger('mousedown')
		.trigger('mouseup');

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
					//CastTabs.dialog("Test");
					makeGraph();
					svgEditor.canvas.setMode('select');
				}
			}
		}],
		callback: function() {
			$.resizeSvgIcons({
				"#cast_drawing_graph_axis .svg_icon": [46,30],
			});
		},
		mouseDown: function(opts) {

		},
		mouseMove: function(opts) {

		},
		mouseUp: function(opts) {
		}
	}
});