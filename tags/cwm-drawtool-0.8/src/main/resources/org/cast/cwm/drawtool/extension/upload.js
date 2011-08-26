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

