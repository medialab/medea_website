(function(undefined) {
  'use-strict';


  sigma.canvas.labels.def = function(node, context, settings) {
    var fontSize,
    prefix = settings('prefix') || '',
    size = node[prefix + 'size'];

    if (node.staticLabel !== true)
      return;

    if (!node.label || typeof node.label !== 'string')
      return;

    fontSize = (settings('labelSize') === 'fixed') ?
      settings('defaultLabelSize') :
      settings('labelSizeRatio') * size;

    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
      fontSize + 'px ' + settings('font');
    context.fillStyle = (settings('labelColor') === 'node') ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultLabelColor');

    context.fillText(
      node.label,
      Math.round(node[prefix + 'x'] + size + 3),
      Math.round(node[prefix + 'y'] + fontSize / 3)
    );
  };

  function drawGraphInstitutions(container, callback) {
    $('#' + container + ' canvas').remove();
    var newInstance = new sigma({container: container});

    newInstance.settings({
      labelThreshold: 100
    });

    updateInstitutions(container, newInstance);
    callback(newInstance);
  }

  function updateInstitutions(container, sigmaInstance) {
    /**
    * Graph displaying
    */
    sigma.parsers.gexf(
      'contents/data/sigma-institutions/institutions.gexf',
      sigmaInstance,
      function() {
        // We first need to save the original colors of our
        // nodes and edges, like this:
        sigmaInstance.graph.nodes().forEach(function(n) {
          console.log('node', n.attributes.attr_type);
          if (n.attributes.attr_type === 'Institution')
            n.staticLabel = true;
          n.originalColor = n.color;
          n.originalLabel = n.label;
          n.originalSize = n.size;
        });
        sigmaInstance.graph.edges().forEach(function(e) {
          e.originalColor = e.color;
        });

        sigmaInstance.refresh();
      }
    );
  }

  // Exporting
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      exports = module.exports = drawGraphInstitutions;
    exports.drawGraphInstitutions = drawGraphInstitutions;
  } else if (typeof define === 'function' && define.amd)
    define('drawGraphInstitutions', [], function() {
      return drawGraphInstitutions;
    });
  else
    this.drawGraphInstitutions = drawGraphInstitutions;
}).call(this);
