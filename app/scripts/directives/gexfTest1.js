'use strict';

/**
 * @ngdoc directive
 * @name driveoutApp.directive:participationByChapters
 * @description
 * # bricks diagram
 */
angular.module('driveoutApp.directives.gexftestone', [])
  .directive('gexftestone', function () {
    return {
      restrict: 'EA',
      scope: {},
      link: function postLink(scope, element, attrs) {

          /**
    * Helpers
    */
  // Add a method to the graph model that returns an
  // object with every neighbors of a node inside:
  sigma.classes.graph.addMethod('neighbors', function(nodeId) {
  var k,
      neighbors = {},
      index = this.allNeighborsIndex[nodeId] || {};

  for (k in index)
    neighbors[k] = this.nodesIndex[k];

    return neighbors;
  });
  //Puts all the given node and its neighbors
  sigma.classes.graph.addMethod('activeNodesUp', function(nodeId) {
    console.log(this);
    var neighbors = this.neighbors(nodeId);
    neighbors[nodeId] = this.nodesIndex[nodeId];
    var array = this.nodesArray.sort(function(a, b) {
      if (neighbors[a.id] !== undefined && neighbors[b.id] === undefined)
        return 1;
      else if (neighbors[a.id] === undefined && neighbors[b.id] !== undefined)
        return -1;
      else
        return 0;
    });
    this.nodesArray = array;
  });

  sigma.classes.graph.addMethod('activeEdgesUp', function(nodeId) {
    var selector = nodeId.search('author') !== -1 ? 'source' : 'target';
    var array = this.edgesArray.sort(function(a, b) {
      if (a[selector] !== nodeId && b[selector] === nodeId)
        return -1;
      else if (a[selector] === nodeId && b[selector] !== nodeId)
        return 1;
      else
        return 0;
    });
    this.edgesArray = array;
  });

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

  function drawGraph(container, selectContainer) {

    var newInstance = new sigma({container: container});

    var select =  document.getElementById(selectContainer);
    select.addEventListener('change', function(e){
      update(container, e.target.value, newInstance);
    });


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
      // singleHover: true,
      labelThreshold: 100
    });

    update(container, '1', newInstance);
  }

  function update(container, ar, sigmaInstance) {
    /**
    * Graph displaying
    */
    var arFileHash = {
      1: 'Bridges_AR_1.gexf',
      2: 'Bridges_AR_2.gexf',
      3: 'Bridges_AR_3.gexf',
      4: 'Bridges_AR_4.gexf',
      5: 'Bridges_AR_5.gexf'
    }
    sigma.parsers.gexf(
      'media/sigma-bridges/' + arFileHash[ar],
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
                n.staticLabel = false;
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
  drawGraph('sigma-container', 'currentAR');
    }
  };
});
