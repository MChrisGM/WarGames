(function() {
    var globe = planetaryjs.planet();
    // Load our custom `autorotate` plugin; see below.
    globe.loadPlugin(autorotate(0));
    globe.loadPlugin(autoscale({extraHeight: -120}));
    globe.loadPlugin(autocenter({extraHeight: -120}));
    // The `earth` plugin draws the oceans and the land; it's actually
    // a combination of several separate built-in plugins.
    //
    // Note that we're loading a special TopoJSON file
    // (world-110m-withlakes.json) so we can render lakes.
    globe.loadPlugin(planetaryjs.plugins.earth({
      topojson: { file:   './scripts/datasets/world-110m-withlakes.json' },
      oceans:   { fill:   '#0043ad' },
      land:     { fill:   '#777777' },
      borders:  { stroke: '#111111' }
    }));
    // Load our custom `lakes` plugin to draw lakes; see below.
    globe.loadPlugin(lakes({
      fill: '#0043ad'
    }));
    
    // The `zoom` and `drag` plugins enable
    // manipulating the globe with the mouse.
    globe.loadPlugin(planetaryjs.plugins.zoom({
      scaleExtent: [300, 2000]
    }));
    globe.loadPlugin(planetaryjs.plugins.drag({
      // Dragging the globe should pause the
      // automatic rotation until we release the mouse.
      onDragStart: function() {
        this.plugins.autorotate.pause();
      },
      onDragEnd: function() {
        this.plugins.autorotate.resume();
      }
    }));
    // Set up the globe's initial scale, offset, and rotation.
    globe.projection.scale(300).translate([400, 200]).rotate([0, -10, 0]);
  
    var canvas = document.getElementById('globe');
    // Special code to handle high-density displays (e.g. retina, some phones)
    // In the future, Planetary.js will handle this by itself (or via a plugin).
    if (window.devicePixelRatio == 2) {
      canvas.width = 800;
      canvas.height = 800;
      context = canvas.getContext('2d');
      context.scale(2, 2);
    }
    // Draw that globe!
    globe.draw(canvas);

    function autoscale(options) {
        options = options || {};
        return function(planet) {
          planet.onInit(function() {
            var width  = window.innerWidth + (options.extraWidth || 0);
            var height = window.innerHeight + (options.extraHeight || 0);
            planet.projection.scale(Math.min(width, height) / 2);
          });
        };
      };

      // Plugin to resize the canvas to fill the window and to
  // automatically center the planet when the window size changes
  function autocenter(options) {
    options = options || {};
    var needsCentering = false;
    var globe = null;

    var resize = function() {
      var width  = window.innerWidth + (options.extraWidth || 0);
      var height = window.innerHeight + (options.extraHeight || 0);
      globe.canvas.width = width;
      globe.canvas.height = height;
      globe.projection.translate([width / 2, height / 2]);
    };

    return function(planet) {
      globe = planet;
      planet.onInit(function() {
        needsCentering = true;
        d3.select(window).on('resize', function() {
          needsCentering = true;
        });
      });

      planet.onDraw(function() {
        if (needsCentering) { resize(); needsCentering = false; }
      });
    };
  };
  
    // This plugin will automatically rotate the globe around its vertical
    // axis a configured number of degrees every second.
    function autorotate(degPerSec) {
      // Planetary.js plugins are functions that take a `planet` instance
      // as an argument...
      return function(planet) {
        var lastTick = null;
        var paused = false;
        planet.plugins.autorotate = {
          pause:  function() { paused = true;  },
          resume: function() { paused = false; }
        };
        // ...and configure hooks into certain pieces of its lifecycle.
        planet.onDraw(function() {
          if (paused || !lastTick) {
            lastTick = new Date();
          } else {
            var now = new Date();
            var delta = now - lastTick;
            // This plugin uses the built-in projection (provided by D3)
            // to rotate the globe each time we draw it.
            var rotation = planet.projection.rotate();
            rotation[0] += degPerSec * delta / 1000;
            if (rotation[0] >= 180) rotation[0] -= 360;
            planet.projection.rotate(rotation);
            lastTick = now;
          }
        });
      };
    };
  
    // This plugin takes lake data from the special
    // TopoJSON we're loading and draws them on the map.
    function lakes(options) {
      options = options || {};
      var lakes = null;
  
      return function(planet) {
        planet.onInit(function() {
          // We can access the data loaded from the TopoJSON plugin
          // on its namespace on `planet.plugins`. We're loading a custom
          // TopoJSON file with an object called "ne_110m_lakes".
          var world = planet.plugins.topojson.world;
          lakes = topojson.feature(world, world.objects.ne_110m_lakes);
        });
  
        planet.onDraw(function() {
          planet.withSavedContext(function(context) {
            context.beginPath();
            planet.path.context(context)(lakes);
            context.fillStyle = options.fill || 'black';
            context.fill();
          });
        });
      };
    };
  })();