// p5.func
//      https://idmnyu.github.io/p5.js-func/#examples
// p5.asciiart
//      https://www.tetoki.eu/asciiart/

// https://unicks.medium.com/creating-a-2d-terrain-generator-with-p5-js-2fcbe3157459
// https://www.youtube.com/watch?v=IKB1hWWedMk

// need a better way to do async await. Supposed to be called after heightmap's setup is done.
var hmap_done_promise = new Promise(function(resolve, reject) {
  // resolve the promise after 1 second
  setTimeout(resolve, 1000);
});

// First Canvas - 2D map
var heightmap = function(m) {
  m.canv;
  m.canv_w = 500;
  m.canv_h = 500;
  (m.r = 255), (m.b = 0), (m.g = 0), (m.a = 255);
  m.heightmap;
  m.is_done = false;

  m.biome_height_dict = {
    oceans: 0,
    plains: 110,
    hills: 140,
    mountains: 170
  };

  m.biome_color_dict = {
    oceans: [0, 105, 148],
    plains: [124, 252, 0],
    hills: [178, 121, 12],
    mountains: [65, 43, 21]
  };

  m.setup = async function() {
    m.pixelDensity(1);
    m.background(0);
    m.canv = m.createCanvas(m.canv_w, m.canv_h);
    m.genHeightmap();
    m.colorHeightmap();
    m.showHeightmap();

    m.processHeightmap().then(hmap => sendHeightmap(hmap));

    // hmap_done_promise = new Promise(function(resolve, reject){
    //     // resolve the promise after 1 second
    //     setTimeout(resolve, 0)
    // });
  };

  m.processHeightmap = async function() {
    m.heightmap = m.pixels.slice();
    return m.heightmap;
    // i wanna send the heightmap data from this point
  };

  m.genHeightmap = function() {
    m.loadPixels();
    for (let y = 0; y < m.canv_h; y++) {
      for (let x = 0; x < m.canv_w; x++) {
        let nx = (x / m.canv_h) * 10;
        let ny = (y / m.canv_w) * 10;
        let val = (m.noise(nx, ny) * 255) | 0;
        let i = y * 4 * m.canv_h + x * 4;
        m.pixels[i] = val;
        m.pixels[i + 1] = val;
        m.pixels[i + 2] = val;
        m.pixels[i + 3] = 255;
      }
    }
    m.updatePixels();
  };

  m.colorHeightmap = function() {
    for (let i = 0; i < m.pixels.length; ) {
      let colorArr = [255, 255, 255];

      if (m.pixels[i] > m.biome_height_dict["mountains"]) {
        colorArr = m.biome_color_dict["mountains"];
      } else if (m.pixels[i] > m.biome_height_dict["hills"]) {
        colorArr = m.biome_color_dict["hills"];
      } else if (m.pixels[i] > m.biome_height_dict["plains"]) {
        colorArr = m.biome_color_dict["plains"];
      } else colorArr = m.biome_color_dict["oceans"];

      m.pixels[i++] = colorArr[0];
      m.pixels[i++] = colorArr[1];
      m.pixels[i++] = colorArr[2];
      i++;
    }
  };

  m.showHeightmap = function() {
    m.updatePixels();
  };

  m.returnMap = function() {
    return m.heightmap;
  };
};

// Second Canvas - 3D map
var meshmap = function(t) {
  t.canv;
  t.canv_w = 500;
  t.canv_h = 500;
  t.heightmap;

  t.setup = async function() {
    t.createCanvas(t.canv_w, t.canv_h, t.WEBGL);
  };

  t.draw = function() {
    t.background(244, 210, 0);

    t.normalMaterial();
    t.rotateY((1 * t.millis()) / 1000.0);
    //t.box(100, 100, 100);
    t.noFill();
    t.strokeWeight(1);
    t.stroke(0);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (t.random() < 0.5) {
          t.quad(
            10 * i,
            10 * j,
            0,
            10 * (i + 1),
            10 * j,
            0,
            10 * i,
            10 * (j + 1),
            0,
            10 * i,
            10 * j,
            0,
          );
        }
      }
    }
  };

  t.printMap = function() {
    t.print(t.heightmap);
  };
};

var heightmap = new p5(heightmap);
var meshmap = new p5(meshmap);

async function sendHeightmap(hmap, mmap) {
  console.log(heightmap.returnMap()); // this should print an array of nums
}

//sendHeightmap(heightmap, meshmap);
