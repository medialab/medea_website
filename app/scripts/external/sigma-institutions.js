(function(undefined) {
  'use-strict';


  sigma.canvas.labels.def = function(node, context, settings) {
    var fontSize,
    prefix = settings('prefix') || '',
    size = node[prefix + 'size'];

    if (size < settings('labelThreshold') && node.staticLabel !== true)
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

    newInstance.bind('overNode', function(e) {
      if(Object.keys(e.data.captor).length > 0){  // Sigma bug turnaround
        var containerComponent = document.getElementById(container);
        containerComponent.setAttribute('class', containerComponent.getAttribute('class') + ' pointable');
      }
    })
    newInstance.bind('outNode', function(e) {
      if(Object.keys(e.data.captor).length > 0){  // Sigma bug turnaround
        var containerComponent = document.getElementById(container),
            classes = containerComponent.getAttribute('class').replace(' pointable', '');
        containerComponent.setAttribute('class', classes);
      }
    });

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
          n.originalColor = n.color;
          n.originalLabel = n.label;
          n.originalSize = n.size;
        });
        sigmaInstance.graph.edges().forEach(function(e) {
          e.originalColor = e.color;
        });
        // When a node is clicked, we check for each node
        // if it is a neighbor of the clicked one. If not,
        // we set its color as grey, and else, it takes its
        // original color.
        // We do the same for the edges, and we only keep
        // edges that have both extremities colored.
        sigmaInstance.bind('clickNode', function(e) {
          var nodeId = e.data.node.id,
              toKeep = sigmaInstance.graph.neighbors(nodeId);
          toKeep[nodeId] = e.data.node;
          sigmaInstance.graph.activeNodesUp(nodeId);
          sigmaInstance.graph.activeEdgesUp(nodeId);

          sigmaInstance.graph.nodes().forEach(function(n) {
            if (toKeep[n.id]) {
              n.color = n.originalColor;
              n.label = n.originalLabel;
              if (n.id === nodeId)
                n.staticLabel = true;
              else
                n.staticLabel = true;
            }
            else {
              n.color = '#eee';
              n.label = '';
              n.staticLabel = false;
            }
          });

          sigmaInstance.graph.edges().forEach(function(e) {
            if (toKeep[e.source] && toKeep[e.target])
              e.color = e.originalColor;
            else
              e.color = '#eee';
          });

          // Since the data has been modified, we need to
          // call the refresh method to make the colors
          // update effective.
          sigmaInstance.refresh();
        });

        // When the stage is clicked, we just color each
        // node and edge with its original color.
        sigmaInstance.bind('clickStage', function(e) {
          sigmaInstance.graph.nodes().forEach(function(n) {
            n.color = n.originalColor;
            n.label = n.originalLabel;
            n.size = n.originalSize;
            n.staticLabel = false;
          });

          sigmaInstance.graph.edges().forEach(function(e) {
            e.color = e.originalColor;
          });

          // Same as in the previous event:
          sigmaInstance.refresh();
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
