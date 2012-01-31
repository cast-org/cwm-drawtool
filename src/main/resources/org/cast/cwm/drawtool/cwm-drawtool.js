/*
 * Allows the server to designate an image path
 * before the scripts are run.
 */
if (typeof serverImagePath == "undefined") {
	serverImagePath = ""
}

if (typeof starterImageUrls == "undefined") {
	starterImageUrls = [];
}

/**
 * Callback controls for the tabs
 */
var CastTabs = {
	
	tabNames: [
		"starters",
		"draw",
		"type",
		"edit",
		"zoom"
	], 
	tabDimensions:  {
		"starters": [70,30],
		"draw": [64,30],
		"type": [64,30],
		"edit": [64,30],
		"zoom":[44,19]
	},
		
	skipActivate: false, // true, if clicking a tab should activate a tool.
	
	drawTools: ["fhpath", "line", "path", "rect", "ellipse"], // Available tools
	
	tabObject: null, // The jQuery UI tabs() object
	
	recentDrawTool: "fhpath", // Most recently used draw tool
	
	editorReady: false, // Has the editor finished loading?
	
	iconsReady: false, // Has the extension (and icons it contains) finished loading?
	
	defaultTabIndex: 0, // The default tab to be selected when the tool starts
	
	init: function() {
		
		/*
		 * Intialize tabs
		 */
		CastTabs.tabObject = $("#tabs").tabs({
			
			selected: CastTabs.defaultTabIndex - 1, // For some reason, must be different
			
			ajaxOptions: {
				async:false, // Async to make sure the tabs are ready.
			},
			
			select: function(event, ui) {
				var clickButton = null;
				var showColors = true;
				var tabName = CastTabs.tabNames[ui.index];
				
				/*
				 * Based on tab selected, identify a submenu button to click,
				 * the name of the selected tab, and whether or not
				 * the color palette should be shown.
				 */
				switch (ui.index) {
					case 0:
						clickButton = $("#tool_select");
						showColors = false;
						break;
					case 1:
						clickButton = $("#tool_" + CastTabs.recentDrawTool);
						break;
					case 2:
						clickButton = $("#tool_text");
						break;
					case 3:
						clickButton = $("#tool_select");
						break;
					case 4:
						clickButton = $("#tool_zoom");
						showColors = false;
						break;	
					default:
						$.alert("Error: Invalid Tab Selected");
						break;
				}
				
				/*
				 * Click the appropriate sub-menu button, if applicable
				 */
				if (clickButton != null && !CastTabs.skipActivate) {
					clickButton.click().mouseup();
					svgCanvas.clearSelection();
				}
				
				/*
				 * Show/Hide color chooser
				 */
				if (showColors)
					$("#stroke_fill").show();
				else	
					$("#stroke_fill").hide();
				
				/*
				 * Set Selected Tab, unselect all others
				 */
				try {
					$.each(CastTabs.tabDimensions, function(name, dimensions) {
						if (name == tabName) {
							if (name != "zoom") { // Zoom has a CSS style hover.
								$("#cast_tab_" + name + "_selected").show();
								$("#cast_tab_" + name).hide();
							}
						} else {
							$("#cast_tab_" + name + "_selected").hide();
							$("#cast_tab_" + name).show();
							$('#zoom_panel').show();
							$('#zoom_dropdown')
								.removeClass('dropup');
						}
					});
				} catch (err) {
					console.log("Could not find select indicator for tab: " + tabName);
				}
			}
		});

		/*
		 * Clicking a drawing tool will register it as most recently used
		 */
		$.each(CastTabs.drawTools, function(index, tool) {
			$("#tool_" + tool).click(function() {
				CastTabs.recentDrawTool = tool;
			});
		});
		
		/*
		 * This enables rollover functionality for all tabs
		 * except for the last (zoom) tab.
		 */		
		$("#tabs li").each(function(index) {
			var tabName = CastTabs.tabNames[index];
			
			$(this).hover(function() {
				if ($(this).hasClass("ui-tabs-selected") || $(this).hasClass("last-tab")) {
					return;
				} else {
					$("#cast_tab_" + tabName + "_selected").show();
					$("#cast_tab_" + tabName).hide();
				}

			}, function() {
				if ($(this).hasClass("ui-tabs-selected") || $(this).hasClass("last-tab")) {
					return;
				} else {
					$("#cast_tab_" + tabName + "_selected").hide();
					$("#cast_tab_" + tabName).show();
				}

			});
		})
		
		/*
		 * Colors are initially hidden - Starters are selected.
		 */
		$("#stroke_fill").hide();
		
		/*
		 * Set the default index (helps reset on a page refresh)
		 */
		CastTabs.setDefaultIndex();
		 
	},
	
	/**
	 * Get the currently selected tab
	 */
	getSelectedIndex: function() {
		return CastTabs.tabObject.tabs('option', 'selected');
	},
	
	/**
	 * Activate the tab at the specified index
	 * @param {Object} index
	 */
	setSelectedIndex: function(index) {
		CastTabs.tabObject.tabs('select', index);
	},
	
	/*
	 * Set default CastTabs Index.
	 */
	setDefaultIndex: function() {
		if (CastTabs.editorReady && CastTabs.iconsReady) {
			CastTabs.setSelectedIndex(CastTabs.defaultTabIndex);
		} else {
			setTimeout(CastTabs.setDefaultIndex, 50);
		}
	},
	
	/**
	 * Add an image to the svgCanvas
	 * 
	 * @param {Object} url
	 */
	addImage: function(url) {
	
		/*
		 * Load Image first so dimensions are known for centering.
		 */
		$(new Image()).load(function() {
			var width = this.width;
			var height = this.height;
			var newImage = svgCanvas.addSvgElementFromJson({
				"element": "image",
				"attr": {
					"x": 0,
					"y": 0,
					"width": width,
					"height": height,
					"id": svgCanvas.getNextId(),
					"style": "pointer-events:inherit",
					"xlink:href": url
				}
			});
			
			svgCanvas.clearSelection();	
			svgCanvas.addToSelection([newImage]);

			svgCanvas.alignSelectedElements("c", "page");
			svgCanvas.alignSelectedElements("m", "page");

		}).attr('src', url);
	},
	dialog: function(content) {
		var $dialog = $('<div class="dialog">\
			<div class="overlay"></div>\
		 	<div class="dialog_container">\
		    	<div class="dialog_content"></div>\
		    	<div class="dialog_buttons"></div>\
		  	</div>\
		</div>')
			.show()
			.css('left', '50%')
			.css('top', '50%')
			.prependTo('body');
		
		var $content = $dialog.find('.dialog_content');
		
		$dialog
			.find('.dialog_container')
			.draggable({
					cancel:'.dialog_content, .dialog_buttons *',
					containment: 'window'
			});
		
		$content.html(content);
		
		$('<input type="button" value="Cancel" />')
			.appendTo($dialog.find('.dialog_buttons'))
			.click(function() {
				$dialog.hide();
			});
		
		return $dialog;
	}
}

/**
 * Add an extension that integrates the tabs with the tool and adds
 * custom buttons.  Unfortunately, the button sizes will be overridden
 * to fit on the standard 's', 'm', 'l' framework.
 */
svgEditor.addExtension("Cast Tabs", function() {

	/**
	 * Actual extension to be added to svg-edit.
	 */	
	return {
		
		name: "Cast Tabs",
		
		svgicons: serverImagePath + "cast/images/cast_icons.svg",
		
		buttons: [{
			id: "cast_drawing_starters",
			
			type: "context",
			
			panel: "buttons_starters",
			
			title: "Click Here to add a Starter",
			
			events: {
				'mouseup': function () {
					$('#drawing_starters_dialog').show();
				}
			}
		},
		
		{
			id: "cast_web_image",
			
			type: "context",
			
			panel: "buttons_starters",
			
			title: "Click Here to add an image from the internet",
			
			events: {
				'mouseup': function () {
					$.prompt(svgEditor.uiStrings.notification.enterNewImgURL, "http://", function(url) {
						if(url) {
							CastTabs.addImage(url);
						}
					});
				}
			}
		}],

		selectedChanged: function(opts) {
			
			// Since the select tool is already active, skip activating it again
			if (opts.selectedElement) {
				CastTabs.skipActivate = true;
				CastTabs.setSelectedIndex(3);
				CastTabs.skipActivate = false;
			}

			/*
			 * Required because svg-editor.js resizes the select tool
			 * icon each time the selection changes.
			 */
			$.resizeSvgIcons({
				"#tool_select .svg_icon": [25,30],
			});			
		},
		
		callback: function() {
			
			/*
			 * Add the tabs
			 */
			var tabSizes = {};
			$.each(CastTabs.tabDimensions, function(name, dimensions) {
				var icon = $.getSvgIcon("cast_tab_" + name).clone();
				$("#cast_tab_" + name).append(icon);
				tabSizes["#cast_tab_" + name + " .svg_icon"] = CastTabs.tabDimensions[name];
				
				// Add "selected" versions of tabs
				if (name != "zoom") {
					var icon2 = $.getSvgIcon("cast_tab_" + name + "_selected").clone();
					$("#cast_tab_" + name + "_selected" ).append(icon2);
					$("#cast_tab_" + name + "_selected" ).hide();
					tabSizes["#cast_tab_" + name + "_selected .svg_icon"] = CastTabs.tabDimensions[name];	
				}
				
			});
			$.resizeSvgIcons(tabSizes);
			
			/*
			 * Fix the extension icons
			 */
			$.resizeSvgIcons({
				"#cast_drawing_starters .svg_icon": [72,30],
				"#cast_web_image .svg_icon": [46,30]
			});
			
			/*
			 * Handle starters (hide or create dialog)
			 */
			if (starterImageUrls.length == 0) {
				$('#cast_drawing_starters').hide();
			} else {
				var $dialog = $("#drawing_starters_dialog");
				var $content = $dialog.find('.dialog_content');
				
				$dialog.find('.dialog_container').draggable({cancel:'.dialog_content, .dialog_buttons *', containment: 'window'});
				
				$content.html("<p>Choose an image to help get you started</p>");	
			
				// Populate Thumbnails
				var thumbs = $("<div class='starterThumbnails'>").appendTo($content);
				if (starterImageUrls.length > 0) {
					$.each(starterImageUrls, function(i, url) {
						$(new Image()).addClass("thumbnail").attr("src", url).appendTo(thumbs).click(function() {
							CastTabs.addImage(url);
							$dialog.hide();
						});
					});
				} else {
					$("<div>").appendTo(thumbs).text("No Drawing Starters Available.");
				}
			
				var $buttonContainer = $dialog.find('.dialog_buttons');
				
				$('<input type="button" value="' + svgEditor.uiStrings.common.cancel + '">')
							.appendTo($buttonContainer)
							.click(function() { $dialog.hide()});
			}

			CastTabs.iconsReady = true;
		}
	};
});

/**
 * Set default configuration for svg-edit
 */
svgEditor.setConfig({
	no_save_warning: true,
	extensions: [],
	imgPath: serverImagePath + "cast/images/",
	jGraduatePath: serverImagePath + "svgedit/jgraduate/images/",
	colorPickerCSS: {'left': -10, 'bottom': -15},
	dimensions: [535,325],
	canvas_expansion: 0,
	show_outside_canvas: false,
	showRulers: false,
	selectNew: false
});

svgEditor.ready(function() {

	/*
	 * Resize Tool Icons to non-default size
	 * 
	 * #tool_select does not need to be resized here
	 * because svg-editor.js continually overrides the
	 * sizing.  Instead, we resize in the extension.
	 */
	
	$.resizeSvgIcons({
		
			// Tools
		 	"#tool_fhpath .svg_icon": [40,30],
			"#tool_line .svg_icon": [20,30],
			"#tool_ellipse .svg_icon": [26,30],
			"#tool_rect .svg_icon": [40,30],
			"#tool_path .svg_icon": [47,30],
			"#tool_text .svg_icon": [17,30],
			
			// Tiny Context Buttons
			"#tool_move_top .svg_icon": [12,12],
			"#tool_move_bottom .svg_icon": [12,12],
			"#tool_clone .svg_icon": [12,12],
			"#tool_delete .svg_icon": [12,12],
			"#tool_group .svg_icon": [12,12],
			"#tool_ungroup .svg_icon": [12,12],
			"#tool_alignleft .svg_icon": [12,12],
			"#tool_aligncenter .svg_icon": [12,12],
			"#tool_alignright .svg_icon": [12,12],
			"#tool_aligntop .svg_icon": [12,12],
			"#tool_alignmiddle .svg_icon": [12,12],
			"#tool_alignbottom .svg_icon": [12,12],
			"#tool_clone_multi .svg_icon": [12,12],
			"#tool_delete_multi .svg_icon": [12,12],
			
			// Undo/Redo
			"#tool_undo .svg_icon": [39,19],
			"#tool_redo .svg_icon": [38,19],
			
	});
	
	/*
	 * Resize Fill/Stroke Color to smaller size
	 */
	
	$("#fill_color svg").attr('width', 12);
	$("#stroke_color svg").attr('width', 12);

	/*
	 * Set default font to something human readable
	 */
	
	svgCanvas.setFontFamily("Georgia");
	
	CastTabs.editorReady = true;
	
});

$(document).ready(function() {
	
	CastTabs.init();
	
	/*
	 * Custom Stroke Style dropdown
	 */
	var strokePatterns = {	
		"2,2" : "&middot&middot&middot",
		"5,5" : "---",
		"5,2,2,2": "-&middot;-",
		"5,2,2,2,2,2": "-&middot;&middot;-"
	}

	svgEditor.addDropDown('#stroke_style_dropdown', function() {
		var style = $(this).attr('id');
		var pattern = "none";
		switch(style) {
			
			case "stroke_style_1":
				pattern = "2,2";
				break;
			case "stroke_style_2":
				pattern = "5,5";
				break;
			case "stroke_style_3":
				pattern = "5,2,2,2";
				break;
			case "stroke_style_4":
				pattern = "5,2,2,2,2,2";
				break;
		}
		$('#stroke_style').val(pattern).change();
	});
	
	$('#stroke_style').change(function() {
		$('#stroke_style_label').html(strokePatterns[$(this).val()]||"&mdash;");
	});
});