/*
 * Copyright 2011-2012 CAST, Inc.
 *
 * This file is part of the CAST extension of SVG Edit;
 * see http://code.google.com/p/cwm-drawtool for more information.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Extension that allows file uploads.
 */
svgEditor.addExtension("Cast Upload", function() {

	/**
	 * Add i18n strings and dialog close behavior to buttons
	 */
	var initUploadDialog = function() {

		var $dialog = $('#upload_dialog');
		var uiStrings = svgEditor.uiStrings.common;
		
		var $ok = $dialog.find("input[type='submit']");
		$ok.attr("value", uiStrings.ok);
		$ok.click(function() { $dialog.hide(); });
		
		var $cancel = $('#upload_cancel_button');
		$cancel.attr("value", uiStrings.cancel);
		$cancel.click(function() { $dialog.hide(); });
	};
	
	/**
	 * Actual extension to be added to svg-edit.
	 */	
	return {
		
		name: "Cast Upload",
		
		svgicons: serverImagePath + "cast/images/cast_icons.svg",
		
		buttons: [{
			id: "cast_upload",
			
			type: "context",
			
			panel: "buttons_starters",
			
			title: "Click Here to upload an Image",
			
			events: {
				'mouseup': function() {
					$('#upload_dialog').show();
				}
			}
		}],
				
		callback: function() {
			
			/**
			 * Populate the dialog
			 */
			initUploadDialog();
			
			/*
			 * Fix the extension icons
			 */
			$.resizeSvgIcons({
				"#cast_upload .svg_icon": [28,30]
			});
			
		}
	};
});

