# Usage Instructions #

The source code contains CAST's plugin to SVG-edit, but not SVG-edit itself.  The current version should work with the latest SVG-edit trunk code - which is version 1.6 alpha as of February 2012.

  1. Check out the source from [the source page](http://code.google.com/p/cwm-drawtool/source/checkout).
  1. Confirm that your subversion client has correctly followed the external reference and included the proper version of SVG-edit in a subdirectory called `src/main/resources/org/cast/cwm/drawtool/svgedit`.
  1. Look in `src/main/resources/org/cast/cwm/drawtool/` for HTML files you can use:
    * view `SvgEditor.html` for a full screen version (not for general use)
    * view `TestFrame.html` for a properly sized version of the interface which can be included (as an `<iframe>`) in your page.


For usage as a Wicket module, you would do something like this:

```
    String defaultContent = ... your svg here ...;
    ArrayList<String> starterUrls = ... urls of starter imgs here...;

    SvgEditor svgEditor = new SvgEditor();
    if (defaultContent != null)
        svgEditor.setSvg(defaultContent);
    if (starterUrls != null)
        svgEditor.setDrawingStarters(starterUrls);
    InlineFrame frame = svgEditor.getEditor("svgeditor");
    add(frame);
```

TODO: document how to save SVG; how to use image-upload extension.