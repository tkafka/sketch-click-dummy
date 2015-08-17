var linkLayerPrefix = "linkto:";

function showLinkLayers () {
  return showOrHideLinkLayers(true);
}

function hideLinkLayers () {
  return showOrHideLinkLayers(false);
}

function toggleLinkLayers() {
  return showOrHideLinkLayers (-1);
}

function showOrHideLinkLayers (shouldShowLayers) {
  var layers = doc.currentPage().children().objectEnumerator();
  while (layer = layers.nextObject()) {

    var name = layer.name();
    if (name == linkLayerPrefix || name.indexOf(linkLayerPrefix) != -1) {

      if (shouldShowLayers === -1) {
        // decide whether to hide or show all layers, based on the visibility of the first layer we find
        shouldShowLayers = ![layer isVisible];
      }

      [layer setIsVisible:shouldShowLayers];
    }
  }
  return shouldShowLayers;
}

function showAlert(title, msg) {
  var app = [NSApplication sharedApplication];
  [app displayDialog:msg withTitle:title]
}

function _debug() {
  return;
  var args = Array.prototype.slice.call(arguments);
  showAlert('', args.map(function(a) { return JSON.stringify(a) }).join(', '));
}

function getLayerClassName(layer) {
  if (layer instanceof MSPage) return 'MSPage';
  if (layer instanceof MSArtboardGroup) return 'MSArtboardGroup';
  if (layer instanceof MSLayerGroup) return 'MSLayerGroup';
  if (layer instanceof MSLayer) return 'MSLayer';
  return null;
}

function getLayerFrame(layer) {
  f = null;
  if (typeof layer.frame === 'function') {
    f = {
      x: layer.frame().x(),
      y: layer.frame().y(),
      w: layer.frame().width(),
      h: layer.frame().height(),
    }
  }
  return f;
}

function getLayerAbsoluteFrame(layer) {
  frame = getLayerFrame(layer);
  parent = layer;

  _debug('getLayerAbsoluteFrame', layer.name(), 'frame:', frame, 'parentClass:', getLayerClassName(layer.parentGroup()));

  if (frame) {
    while (parent.parentGroup() && getLayerClassName(parent.parentGroup()) === 'MSLayerGroup') {
      parent = parent.parentGroup();
      parentClassName = getLayerClassName(parent);
      parentFrame = getLayerFrame(parent);

      _debug('getLayerAbsoluteFrame parent:', parentFrame);

      if (parentFrame) {
        frame.x += parentFrame.x;
        frame.y += parentFrame.y;
      }
    }
  }

  _debug('getLayerAbsoluteFrame result:', frame);

  return frame;
}
