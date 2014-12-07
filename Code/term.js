
const NumCubes = 27;
const NumCubeVertices = 36;

// Global
var canvas;
var gl;
var projectionMatrix;
var viewMatrix;
var modelViewMatrix;
var program;

// camera attributes
const DEFAULT_EYE = vec3(7, 7, 7);
const DEFAULT_AT = vec3(0, 0, 0);
const DEFAULT_UP = vec3(0, 1, 0);
const initial_position = lookAt(DEFAULT_EYE, DEFAULT_AT, DEFAULT_UP);

var cameraX = 0;
var cameraY = 0;
var cameraZ = 25;
var angle = 270;
var fovy = 30;
var aspect;

// Cubes attributes
var length = 0.5;

// Cubes spinning and scaling
const SCALE_MIN = 2.7;
const SCALE_MAX = 3.3;
const rotation_speed = 1;

const TOP = 0;
const BOTTOM = 1;
const LEFT = 2;
const RIGHT = 3;
const BACK = 4;
const FRONT = 5;

const rotation_rubiks = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],           // rotate top
  [18, 19, 20, 21, 22, 23, 24, 25, 26],  // rotate bottom
  [0, 3, 6, 9, 12, 15, 18, 21, 24],      // rotate left
  [2, 5, 8, 11, 14, 17, 20, 23, 26],     // rotate right
  [6, 7, 8, 15, 16, 17, 24, 25, 26],     // rotate back
  [0, 1, 2, 9, 10, 11, 18, 19, 20]       // rotate forward
];

const axes = [
  [0, -1, 0],
  [0, 1, 0],
  [1, 0, 0],
  [-1, 0, 0],
  [0, 0, 1],
  [0, 0, -1]
];

var cube_positions = [];

var deg = 0;
var scale_speed = 0.01;
var scale_factor = 3;

var translate_cubes = [
        vec3(-1, 1, 1),
        vec3(0, 1, 1),
        vec3(1, 1, 1),
        vec3(-1, 1, 0),
        vec3(0, 1, 0),
        vec3(1, 1, 0),
        vec3(-1, 1, -1),
        vec3(0, 1, -1),
        vec3(1, 1, -1),

        vec3(-1, 0, 1),
        vec3(0, 0, 1),
        vec3(1, 0, 1),
        vec3(-1, 0, 0),
        vec3(0, 0, 0),
        vec3(1, 0, 0),
        vec3(-1, 0, -1),
        vec3(0, 0, -1),
        vec3(1, 0, -1),

        vec3(-1, -1, 1),
        vec3(0, -1, 1),
        vec3(1, -1, 1),
        vec3(-1, -1, 0),
        vec3(0, -1, 0),
        vec3(1, -1, 0),
        vec3(-1, -1, -1),
        vec3(0, -1, -1),
        vec3(1, -1, -1)
   ];

// Cubes color
const SURFACE_COLORS = [
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(1.0, 1.0, 1.0, 1.0),  // white
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(1.0, 0.5, 0.0, 1.0),  // orange
        vec4(0.6, 0.6, 0.6, 1.0)  // grey
];

var paintColors = [
        [0, 6, 1, 2, 6, 6],
        [0, 6, 6, 2, 6, 6],
        [0, 4, 6, 2, 6, 6],
        [6, 6, 1, 2, 6, 6],
        [6, 6, 6, 2, 6, 6],
        [6, 4, 6, 2, 6, 6],
        [6, 6, 1, 2, 6, 5],
        [6, 6, 6, 2, 6, 5],
        [6, 4, 6, 2, 6, 5],

        [0, 6, 1, 6, 6, 6],
        [0, 6, 6, 6, 6, 6],
        [0, 4, 6, 6, 6, 6],
        [6, 6, 1, 6, 6, 6],
        [6, 6, 6, 6, 6, 6],
        [6, 4, 6, 6, 6, 6],
        [6, 6, 1, 6, 6, 5],
        [6, 6, 6, 6, 6, 5],
        [6, 4, 6, 6, 6, 5],

        [0, 6, 1, 6, 3, 6],
        [0, 6, 6, 6, 3, 6],
        [0, 4, 6, 6, 3, 6],
        [6, 6, 1, 6, 3, 6],
        [6, 6, 6, 6, 3, 6],
        [6, 4, 6, 6, 3, 6],
        [6, 6, 1, 6, 3, 5],
        [6, 6, 6, 6, 3, 5],
        [6, 4, 6, 6, 3, 5]
    ];

var cube_matrices = [];

window.onload = function init(){

  //  Setup WebGL
  canvas = document.getElementById( "gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport(0, 0, canvas.width, canvas.height);
  aspect = canvas.width / canvas.height;
    
  //  Configure WebGL
  gl.clearColor( 0.8, 0.8, 0.8, 1.0 );    //background: grey
  gl.enable(gl.DEPTH_TEST);
    
  // Set up cubes
  vertices = [
    vec3(  length,   length,  length ), //vertex 1
    vec3(  length,  -length,  length ), //vertex 2
    vec3( -length,   length,  length ), //vertex 3
    vec3( -length,  -length,  length ), //vertex 4    
    vec3(  length,   length, -length ), //vertex 5
    vec3(  length,  -length, -length ), //vertex 6
    vec3( -length,   length, -length ), //vertex 7
    vec3( -length,  -length, -length )  //vertex 8    
  ];

  for (var i = 0; i < NumCubes; i++) {
    cube_positions[i] = i;
    cube_matrices[i] = mat4();
  }

  // points to draw cubes
  var points = [];
  Cube(vertices, points);

  //  Load shaders and initialize attribute buffers
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );
    
  // Load the data into the GPU
  var vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray( vPosition );

  // initialize transformation matrices
  modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
  viewMatrix = initial_position;
  projectionMatrix = perspective(fovy, aspect, 1, 10000);

  render();
};

// points to draw in TRIANGLES mode
function Cube(vertices, points) {
  Quad(vertices, points, 0, 1, 2, 3);
  Quad(vertices, points, 4, 5, 0, 1);
  Quad(vertices, points, 2, 3, 6, 7);
  Quad(vertices, points, 4, 0, 6, 2);
  Quad(vertices, points, 1, 5, 3, 7);
  Quad(vertices, points, 6, 7, 4, 5);
}

function Quad(vertices, points, v1, v2, v3, v4) {
  points.push(vertices[v1]);
  points.push(vertices[v3]);
  points.push(vertices[v4]);
  points.push(vertices[v1]);
  points.push(vertices[v4]);
  points.push(vertices[v2]);
}

var corner = [
        [0, 2, 8, 6],
        [0, 6, 8, 2]
];

var edge = [
        [1, 5, 7, 3],
        [1, 3, 7, 5]
];

function update_cube_positions(surface, clockwise) {
  var m = rotation_rubiks[surface];
  var c = corner[(surface + clockwise) % 2];
  var e = edge[(surface + clockwise) % 2];
  var temp;

  temp = cube_positions[m[c[0]]];
  for (var i = 0; i < 3; i++)
    cube_positions[m[c[i]]] = cube_positions[m[c[i+1]]];
  cube_positions[m[c[3]]] = temp;

  temp = cube_positions[m[e[0]]];
  for (var i = 0; i < 3; i++)
    cube_positions[m[e[i]]] = cube_positions[m[e[i+1]]];
  cube_positions[m[e[3]]] = temp;
}

// keyboard event
window.addEventListener("keydown", function() {

  var toColor;
  var displacement_x = 0;
  var displacement_z = 0;
  var surface = 6;
  var clockwise = 0;
  /*
    Press
      't' to rotate top
  */
  switch (event.keyCode) {
    case 81:
    case 65:
      surface = TOP;
    break;
    case 87:
    case 83:
      surface = BOTTOM;
    break;
    case 69:
    case 68:
      surface = LEFT;
    break;
    case 82:
    case 70:
      surface = RIGHT;
    break;
    case 84:
    case 71:
      surface = FRONT;
    break;
    case 89:
    case 72:
      surface = BACK;
    break;
  }

  switch (event.keyCode) {
    case 81:
    case 87:
    case 69:
    case 82:
    case 84:
    case 89:
      clockwise = 1;
    break;
    case 65:
    case 83:
    case 68:
    case 70:
    case 71:
    case 72:
      clockwise = -1;
    break;
  }

  switch (event.keyCode) {
    case 80:
      for (var i = 0; i < NumCubes; i++) {
        cube_positions[i] = i;
        cube_matrices[i] = mat4();
      }
      viewMatrix = initial_position;
    break;
    // rotate magic cube along z axis
    case 90:
      viewMatrix = mult(viewMatrix, rotate(90, [0, 0, 1]));
    break;
    // rotate magic cube along x axis
    case 88:
      viewMatrix = mult(viewMatrix, rotate(90, [1, 0, 0]));
    break;
    // rotate magic cube along y axis
    case 67:
      viewMatrix = mult(viewMatrix, rotate(90, [0, 1, 0]));
    break;
  }

  if (clockwise != 0) {
    for (var i = 0; i < 9; i++) {
      var myPosition = cube_positions[rotation_rubiks[surface][i]];
      cube_matrices[myPosition] = mult(rotate(clockwise * 90, axes[surface]), cube_matrices[myPosition]);
    }
    update_cube_positions(surface, clockwise > 0 ? 0 : 1);
  }
});

function toRadians(theta) {
  return theta * (Math.PI / 180);
}

// rotate respect to a fixed point
function rotate_point(theta, point) {
  var ctm = mat4();
  ctm = mult(ctm, translate(point));
  ctm = mult(ctm, rotate(theta, [0, 1, 0]));
  ctm = mult(ctm, translate(negate(point)));
  return ctm;
}

function render() {

  // Cubes self motion parameters
  scale_factor += scale_speed;
  if (scale_factor <= SCALE_MIN || scale_factor >= SCALE_MAX) scale_speed = -scale_speed;

  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // draw all cubes
  for (var i = 0; i < NumCubes; i++) {

    // color cubes
    var colors = [];
    for (var j = 0; j < 6; j++) {
      for (var k = 0; k < 6; k++) {
        colors.push(SURFACE_COLORS[paintColors[i][j]]);
      }
    }

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var scale_cube = vec3(scale_factor, scale_factor, scale_factor);
    
    var ctm = mat4();
    ctm = mult(ctm, projectionMatrix);
    ctm = mult(ctm, viewMatrix); 
    ctm = mult(ctm, cube_matrices[i]);
    ctm = mult(ctm, translate(translate_cubes[i]));
    //ctm = mult(ctm, scale(scale_cube));
    //ctm = mult(ctm, rotate(deg, [0, 1, 0]));
    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));
    gl.drawArrays(gl.TRIANGLES, 0, NumCubeVertices);
  }

    window.requestAnimFrame(render);
}