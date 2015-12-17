var Graph = (function(document, undefined) {
  function Graph(width, height) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    
    this.context = this.canvas.getContext('2d');
    
    this.functions = [];
    this.domain    = {lo: -10, hi: 10, range: 20};
    this.codomain  = {lo: -10, hi: 10, range: 20};
  }
  Graph.prototype.setDomain = function(x1, x2) {
    this.domain.lo = x1;
    this.domain.hi = x2;
    this.domain.range = x2 - x1;
  }
  Graph.prototype.setCodomain = function(y1, y2) {
    this.codomain.lo = y1;
    this.codomain.hi = y2;
    this.codomain.range = y2 - y1;
  }
  /**
   * Adds a function definition to the graph, which can either be a
   * literal function or an object with `function` defined, and
   * optionally `color`, `thickness` and `step` defined too.
   *
   * @param  f literal function or function definition object with
   *           optional parameters
   * @return added function definition
   */
  Graph.prototype.addFunction = function(f, color) {
    if (typeof f === 'function') {
      f = {
        function: f,
        color: color
      };
    }
    f.color     = f.color     || '#000';
    f.thickness = f.thickness || 2;
    f.step      = f.step > 0 ? f.step : this.domain.range / this.canvas.width;
    this.functions.push(f);
    return f;
  };
  Graph.prototype.removeFunction = function(f) {
    var i = this.functions.indexOf(f);
    if (i !== -1)
      this.functions.splice(i, 1);
  };
  Graph.prototype.draw = function() {
    var canvas  = this.canvas,
        context = this.context;
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // draw axes
    var zero = this.pointToCanvas({x: 0, y: 0});
    context.beginPath();
    context.moveTo(0, zero.y);
    context.lineTo(canvas.width, zero.y);
    context.moveTo(zero.x, 0);
    context.lineTo(zero.x, canvas.height);
    context.lineWidth = 1;
    context.strokeStyle = '#000';
    context.stroke();
    // draw functions
    for (var i = 0; i < this.functions.length; i++) {
      var functionDefinition = this.functions[i];
          f  = functionDefinition.function,
          x  = this.domain.lo,
          y  = f(x),
          pt = this.pointToCanvas({x: x, y: y});
      context.beginPath();
      context.moveTo(pt.x, pt.y);
      do {
        x  = x + functionDefinition.step;
        y  = f(x);
        pt = this.pointToCanvas({x: x, y: y});
        context.lineTo(pt.x, pt.y);
      } while (x < this.domain.hi);
      context.lineWidth   = functionDefinition.thickness;
      context.strokeStyle = functionDefinition.color;
      context.stroke();
    }
  };
  Graph.prototype.pointToCanvas = function(pt) {
    return {
      x: (pt.x - this.domain.lo)   * this.canvas.width  / this.domain.range,
      y: (this.codomain.hi - pt.y) * this.canvas.height / this.codomain.range
    };
  };
  return Graph;
})(document);


// test functions
function polynomial(x) {
  return 0.1 * (0.1 * Math.pow(x, 3) - Math.pow(x, 2));
}
function trigometric(x) {
  return Math.cos(4 * x) * polynomial(x);
}

function parabolic(x) {
  return Math.pow(x, 2);
}

function cubic(x) {
  return Math.pow(x, 3);
}

function absoluteValue(x) {
  return Math.abs(x);
}

function goldenRatio(x) {
  
}

// draw 
var graph = new Graph(900, 540);
graph.setDomain(-4, 14);
graph.setCodomain(-2, 4);

graph.addFunction(polynomial);
graph.draw();

document.body.appendChild(graph.canvas);