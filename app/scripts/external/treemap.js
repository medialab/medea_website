  var
    arFilter = 'ALL',
    refreshTreemap = function(){};

  // privately(function(){
  //   var
  //     ids = [
  //       'radio-ar1',
  //       'radio-ar2',
  //       'radio-ar3',
  //       'radio-ar4',
  //       'radio-ar5',
  //       'radio-all-ar'
  //     ];

  //   forEach( ids, function( id ) {
  //     var input = document.getElementById( id );
  //     input.onclick = function() {
  //       arFilter = input.value;
  //       refreshTreemap();
  //     };
  //   });

  //   document.getElementById( ids[ids.length-1] ).checked = true;
  // });

function drawTreemap(heightViz) {
  // Clear content
  $('#chart').html('');
  $('#legend').html('');

  var margin = {top: 40, right: 0, bottom: 0, left: 0},
      width = $("#chart").width(),
      height = heightViz - margin.top - margin.bottom,
      formatNumber = d3.format(",d"),
      transitioning;
  var x = d3.scale.linear()
      .domain([0, width])
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([0, height])
      .range([0, height]);

  function getValue( node ) {
    return node[ arFilter ];
  }

  var treemap = d3.layout.treemap()
      .children(function(d, depth) { return depth ? null : d._children; })
      .sort(function(a, b) { return getValue(a) - getValue(b); })
      .value( getValue )
      .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
      .round(false);

  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .style("margin-left", -margin.left + "px")
      .style("margin.right", -margin.right + "px")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("shape-rendering", "crispEdges");

  var grandparent = svg.append("g")
      .attr("class", "grandparent");

  grandparent.append("rect")
      .attr("y", -margin.top)
      .attr("width", $('#chart svg').width())
      .attr("height", margin.top);

  grandparent.append("text")
      .attr("x", 0)
      .attr("y", 12 - margin.top)
      .attr("dy", ".75em");

  function createTreeNode( name, type ) {
    return {
      name: name,
      type: type,
      _children: [],
      AR1: 0,
      AR2: 0,
      AR3: 0,
      AR4: 0,
      AR5: 0,
      ALL: 0
    };
  }

  var
    TEXT_PADDING_X = 5,
    TEXT_BASELINE_Y = 10;

  var
    CONTINENT_KEY = 'WMO Region Symbol',
    ROOT_NODE = 'root';

  // Continents settings for the TreeMap
  // The color attribute is used to set the color of the tile
  // The name attribute is used to translate the WMO Region Symbol
  var continentsSettings = {
    'AFR' : {
      'color' : '#cccf5f',
      'name' : 'AFR'
    },
    'ASI' : {
      'color' : '#d7832e',
      'name' : 'ASI'
    },
    'EUR' : {
      'color' : '#315b66',
      'name' : 'EUR'
    },
    'NAC' : {
      'color' : '#44a3c7',
      'name' : 'NAC'
    },
    'SAM' : {
      'color' : '#5bae66',
      'name' : 'SAM'
    },
    'SWP' : {
      'color' : '#953a24',
      'name' : 'SWP'
    },
    'WMONA' : {
      'color' : '#695e9f',
      'name' : 'N/A'
    }
  };

  d3.csv(
    "contents/data/treemap/participations.csv",
    function(rows) {
      var
        root = createTreeNode( "IPCC", ROOT_NODE );

      forEach( rows, function( row ) {
        var
          AR = "AR",
          COUNT_KEY = "Total",
          ar = row[AR],
          count = Number( row[COUNT_KEY] ),
          node = root,
          color = null;

        forEachProperty( row, function( value, key ) {
          node[ar] += count;
          node.ALL += count;
          node.color = color;

          color = getNodeColor(node);

          if ( key === AR || key === COUNT_KEY ) {
            delete node._children;
            return;
          }

          var childNode = find( node._children, function( child ) {
            return child.name === value;
          });

          if ( childNode === null ) {
            childNode = createTreeNode( value, key );
            childNode.parent = node;
            node._children.push( childNode );
          }

          node = childNode;
        });
      });

    initialize(root);
    layout(root);
    var g = display(root);

    function initialize(root) {
      root.x = root.y = 0;
      root.dx = width;
      root.dy = height;
      root.depth = 0;
    }

    // Compute the treemap layout recursively such that each group of siblings
    // uses the same size (1×1) rather than the dimensions of the parent cell.
    // This optimizes the layout for the current zoom state. Note that a wrapper
    // object is created for the parent node for each group of siblings so that
    // the parent’s dimensions are not discarded as we recurse. Since each group
    // of sibling was laid out in 1×1, we must rescale to fit using absolute
    // coordinates. This lets us use a viewport to zoom.
    function layout(d) {
      if (d._children) {
        treemap.nodes({_children: d._children});
        d._children.forEach(function(c) {
          c.x = d.x + c.x * d.dx;
          c.y = d.y + c.y * d.dy;
          c.dx *= d.dx;
          c.dy *= d.dy;
          c.parent = d;
          layout(c);
        });
      }
    }

    function display(d) {
      grandparent
          .datum(d.parent)
          .on("click", function(d) { transition(d, 500); })
          .select("text")
          .text(name(d));

      var g1 = svg.insert("g", ".grandparent")
          .datum(d)
          .attr("class", "depth");

      var g = g1.selectAll("g")
          .data(d._children)
        .enter().append("g");

      g.filter(function(d) { return d._children; })
          .classed("children", true);

      g.append("rect")
          .attr("class", "parent")
          .call(rect);

      var childCell =
        g.selectAll(".child")
          .data(function(d) { return d._children || [d]; })
        .enter();

      childCell.append("rect")
          .attr("class", "child")
          .call(rect)
          .append("title")
          .text(function(d) { return d.parent.name.toUpperCase() + ': ' + d.name; });

      childCell.append("text")
            .attr("dy", ".35em")
            .text(function(d) { return d.name; })
            .call(text);

      // Add interaction on click on tiles
      // Add interaction only if this object has children to display
      g.selectAll(".child")
        .on('mouseenter', function(d) {
          grandparent.select('text').text(name(d.parent));
        })
        .on('mouseleave', function(d) {
          grandparent.select('text').text(name(d.parent.parent));
        })
        .on('click', function(d) {
          if(d.hasOwnProperty('_children')) {
            transition(d.parent, 1000);
          } else {
            return false;
          }
        });

      function transition(d, duration) {
        if (transitioning || !d) return;
        duration = or(duration, 0);
        transitioning = true;

        var g2 = display(d),
            t1 = g1.transition().duration(duration),
            t2 = g2.transition().duration(duration);

        // Update the domain only after entering new elements.
        x.domain([d.x, d.x + d.dx]);
        y.domain([d.y, d.y + d.dy]);

        // Enable anti-aliasing during the transition.
        svg.style("shape-rendering", null);

        // Draw child nodes on top of parent nodes.
        svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

        // Fade-in entering text.
        g2.selectAll("text").style("fill-opacity", 0);

        // Transition to the new view.
        t1.selectAll("text").call(text).style("fill-opacity", 0);
        t2.selectAll("text").call(text).style("fill-opacity", 1);
        t1.selectAll("rect").call(rect);
        t2.selectAll("rect").call(rect);

        // Remove the old node when the transition is finished.
        t1.remove().each("end", function() {
          svg.style("shape-rendering", "crispEdges");
          transitioning = false;
        });
      }

      refreshTreemap = function() {
        layout(d);
        transition(d);
      };

      return g;
    }

    function rectWidth(d) {
      return x(d.x + d.dx) - x(d.x);
    }

    function rectHeight(d) {
      return y(d.y + d.dy) - y(d.y);
    }

    function text(text) {
      text.attr("x", function(d) { return x(d.x) + TEXT_PADDING_X; })
          .attr("y", function(d) { return y(d.y) + TEXT_BASELINE_Y; })
          .style("opacity", function(d) {
            return rectWidth(d) > this.getComputedTextLength() + TEXT_PADDING_X
              && rectHeight(d) > $(this)[0].clientHeight + TEXT_BASELINE_Y
              ? 1
              : 0;
          });
    }

    function rect(rect) {
      rect.attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y); })
          .attr("width", rectWidth)
          .attr("height", rectHeight)
          .attr("fill", function(d) { return d.color; });
    }

    function name(d) {
      return d.parent
          ? name(d.parent) + " > " + translate(continentsSettings, d.name)
          : translate(continentsSettings, d.name);
    }

    // If 'string' is a key of 'dictionary', return its value
    // Else return 'string'
    function translate(dictionary, string) {
      if( dictionary.hasOwnProperty(string) ) {
        string = dictionary[string].name;
      }
      return string;
    }

    // Generate the code node
    // It should be the color of the continent attached to this tile
    function getNodeColor(node) {
      if(node.type == ROOT_NODE) {
        result = null;
      } else if(node.type == CONTINENT_KEY) {
        result = continentsSettings[node.name].color;
      } else if(node.parent) {
        result = getNodeColor(node.parent);
      // Default fallback color as red
      // This should never happen
      } else {
        result = '#ff0000';
      }
      return result;
    }
  });
}

  // drawTreemap();

  // $(window).resize(function () {
  //   drawTreemap();
  // });

