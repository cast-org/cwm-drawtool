package org.cast.cwm.drawtool.extension;

import java.io.Serializable;

import org.apache.wicket.ResourceReference;

public interface Extension extends Serializable {
	
	public ResourceReference getJavascriptResource();

}
