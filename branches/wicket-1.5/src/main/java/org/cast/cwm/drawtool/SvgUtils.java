package org.cast.cwm.drawtool;

public class SvgUtils {

	public static String blankSvgImage(int width, int height) {
		return "<svg width=\"" + width 
				+ "\" height=\"" + height
				+ "\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">"
				+ "<g display=\"inline\"><title>Layer 1</title></g>"
				+ "</svg>";
	}
	
	public static String blankSvgImage() {
		return blankSvgImage(SvgEditor.CANVAS_WIDTH, SvgEditor.CANVAS_HEIGHT);
	}
	
}
