package org.cast.cwm.drawtool.extension;

import org.apache.wicket.Resource;
import org.apache.wicket.ResourceReference;
import org.apache.wicket.ajax.AjaxRequestTarget;
import org.apache.wicket.ajax.markup.html.form.AjaxButton;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.upload.FileUpload;
import org.apache.wicket.markup.html.form.upload.FileUploadField;
import org.apache.wicket.markup.html.panel.Panel;
import org.apache.wicket.markup.html.resources.JavascriptResourceReference;
import org.apache.wicket.model.Model;
import org.cast.cwm.drawtool.SvgEditor;

public abstract class UploadExtension extends Panel implements Extension {

	public UploadExtension() {
		super(SvgEditor.EXTENSION_MARKUP_ID);
		
		Form<Void> form = new Form<Void>("form");
		
		final FileUploadField file = new FileUploadField("file", new Model<FileUpload>(null));
		form.add(file);
		
		form.add(new AjaxButton("submit") {

			private static final long serialVersionUID = 1L;

			@Override
			protected void onSubmit(AjaxRequestTarget target, Form<?> form) {
				String url = processFile(file.getFileUpload());
				target.appendJavascript("$('#upload_dialog').hide();");
				if (url != null)
					target.appendJavascript("CastTabs.addImage('" + url + "');");
			}
		});
		
		add(form);
	}

	private static final long serialVersionUID = 1L;
	private static final ResourceReference JS = new JavascriptResourceReference(UploadExtension.class, "upload.js") {

		private static final long serialVersionUID = 1L;

		@Override
		protected Resource newResource() {
			// TODO: Drop this when we stop testing
			return super.newResource().setCacheable(false);
		}
	};
	
	public ResourceReference getJavascriptResource() {
		return JS;
	}
	
	/**
	 * Process the uploaded file and return a string that can be used as a URL
	 * to that file.
	 * 
	 * @param file
	 * @return
	 */
	protected abstract String processFile(FileUpload file);
	
	
}
