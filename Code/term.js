var shift=0;
var smtplr=1;
var randomShift=[0,0,0,0,0,0,0,0];
var mtplr=[1,1,1,1,1,1,1,1];
var reUnite=false;
var tremble=false;

var rotHis = [];
var clkHis = [];
var HisSub=0;

var resetMode=0,exp=-1,expall=-1;

var timer = new Timer();
var time=0;

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

// surface constants
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
var translate_cubes;
var scale_cubes;

function initCubeScals(){
  scale_cubes = [
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),

        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),

        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1),
        vec3(1, 1, 1)
   ];
 }


function initCubeTrans(){
  translate_cubes = [
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
 }

initCubeTrans();
initCubeScals();

function explode(){
  shiftUnit=time*0.03;
    if(shift>1||shift<0)smtplr=-smtplr;
    shift+=shiftUnit*smtplr;
   translate_cubes = [
        vec3(-1-shift, 1+shift, 1+shift),
        vec3(0, 1, 1),
        vec3(1+shift, 1+shift, 1+shift),
        vec3(-1, 1, 0),
        vec3(0, 1, 0),
        vec3(1, 1, 0),
        vec3(-1-shift, 1+shift, -1-shift),
        vec3(0, 1, -1),
        vec3(1+shift, 1+shift, -1-shift),

        vec3(-1, 0, 1),
        vec3(0, 0, 1),
        vec3(1, 0, 1),
        vec3(-1, 0, 0),
        vec3(0, 0, 0),
        vec3(1, 0, 0),
        vec3(-1, 0, -1),
        vec3(0, 0, -1),
        vec3(1, 0, -1),

        vec3(-1-shift, -1-shift, 1+shift),
        vec3(0, -1, 1),
        vec3(1+shift, -1-shift, 1+shift),
        vec3(-1, -1, 0),
        vec3(0, -1, 0),
        vec3(1, -1, 0),
        vec3(-1-shift, -1-shift, -1-shift),
        vec3(0, -1, -1),
        vec3(1+shift, -1-shift, -1-shift)
   ];
    scale_cubes = [
            vec3(1+shift*0.3, 1+shift*0.3, 1+shift*0.3),
            vec3(1, 1, 1),
            vec3(1+shift*0.3, 1+shift*0.3, 1+shift*0.3),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1+shift*0.3, 1+shift*0.3, 1+shift*0.3),
            vec3(1, 1, 1),
            vec3(1+shift*0.3, 1+shift*0.3, 1+shift*0.3),

            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),

            vec3(1+shift*0.3, 1+shift*0.3, 1+shift*0.3),
            vec3(1, 1, 1),
            vec3(1+shift*0.3, 1+shift*0.3, 1+shift*0.3),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1+shift*0.3, 1+shift*0.3, 1+shift*0.3),
            vec3(1, 1, 1),
            vec3(1+shift*0.3, 1+shift*0.3, 1+shift*0.3)
       ];
 }


 function explodeWhenReset(){
  shiftUnit=Math.random()*0.1;

  for(var i=0;i<8;i++)
  {
    if(randomShift[i]<=0)
      {
        if(reUnite)
        {
          randomShift[i]=0;
          mtplr[i]=0;
        }
        else
          mtplr[i]=-mtplr[i];
      }
    if(!reUnite && randomShift[i]>=1)
      mtplr[i]=-mtplr[i];
  }
  
  randomShift[0]+=shiftUnit*0.73*mtplr[0];
  if(!reUnite)
    randomShift[1]+=shiftUnit*0.56*mtplr[1];
  else
    randomShift[1]+=shiftUnit*0.90*mtplr[1];
  if(!reUnite)
    randomShift[2]+=shiftUnit*0.16*mtplr[2];
  else
    randomShift[2]+=shiftUnit*0.74*mtplr[2];
  if(!reUnite)
    randomShift[3]+=shiftUnit*0.20*mtplr[3];
  else
    randomShift[3]+=shiftUnit*0.69*mtplr[3];
  if(!reUnite)
    randomShift[4]+=shiftUnit*0.47*mtplr[4];
  else
    randomShift[4]+=shiftUnit*0.77*mtplr[4];
  randomShift[5]+=shiftUnit*0.86*mtplr[5];
  if(!reUnite)
    randomShift[6]+=shiftUnit*0.24*mtplr[6];
  else
    randomShift[6]+=shiftUnit*0.74*mtplr[6];
  randomShift[7]+=shiftUnit*0.82*mtplr[7];

   translate_cubes = [
        vec3(-1-randomShift[0], 1+randomShift[0], 1+randomShift[0]),
        vec3(0, 1, 1),
        vec3(1+randomShift[1], 1+randomShift[1], 1+randomShift[1]),
        vec3(-1, 1, 0),
        vec3(0, 1, 0),
        vec3(1, 1, 0),
        vec3(-1-randomShift[2], 1+randomShift[2], -1-randomShift[2]),
        vec3(0, 1, -1),
        vec3(1+randomShift[3], 1+randomShift[3], -1-randomShift[3]),

        vec3(-1, 0, 1),
        vec3(0, 0, 1),
        vec3(1, 0, 1),
        vec3(-1, 0, 0),
        vec3(0, 0, 0),
        vec3(1, 0, 0),
        vec3(-1, 0, -1),
        vec3(0, 0, -1),
        vec3(1, 0, -1),

        vec3(-1-randomShift[4], -1-randomShift[4], 1+randomShift[4]),
        vec3(0, -1, 1),
        vec3(1+randomShift[7], -1-randomShift[7], 1+randomShift[7]),
        vec3(-1, -1, 0),
        vec3(0, -1, 0),
        vec3(1, -1, 0),
        vec3(-1-randomShift[5], -1-randomShift[5], -1-randomShift[5]),
        vec3(0, -1, -1),
        vec3(1+randomShift[6], -1-randomShift[6], -1-randomShift[6])
   ];

    scale_cubes = [
            vec3(1+randomShift[0]*0.7, 1+randomShift[0]*0.7, 1+randomShift[0]*0.7),
            vec3(1, 1, 1),
            vec3(1+randomShift[1]*0.7, 1+randomShift[1]*0.7, 1+randomShift[1]*0.7),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1+randomShift[2]*0.7, 1+randomShift[2]*0.7, 1+randomShift[2]*0.7),
            vec3(1, 1, 1),
            vec3(1+randomShift[3]*0.7, 1+randomShift[3]*0.7, 1+randomShift[3]*0.7),

            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),

            vec3(1+randomShift[4]*0.7, 1+randomShift[4]*0.7, 1+randomShift[4]*0.7),
            vec3(1, 1, 1),
            vec3(1+randomShift[7]*0.7, 1+randomShift[7]*0.7, 1+randomShift[7]*0.7),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1, 1, 1),
            vec3(1+randomShift[5]*0.7, 1+randomShift[5]*0.7, 1+randomShift[5]*0.7),
            vec3(1, 1, 1),
            vec3(1+randomShift[6]*0.7, 1+randomShift[6]*0.7, 1+randomShift[6]*0.7)
       ];

  
  if(reUnite)
   {
     var doneOrNot=true; 
     for(var i=0;i<8;i++)
        if(randomShift[i]!=0)doneOrNot=false;
     if(doneOrNot)
     {
      reUnite=false;
      resetMode=0;
      mtplr=[1,1,1,1,1,1,1,1];
     }
   }
 }

 function explodeAll(){
  shiftUnit=time*0.03;
    if(shift>1||shift<0)smtplr=-smtplr;
    shift+=shiftUnit*smtplr;
    translate_cubes = [
        vec3(-1-shift, 1+shift, 1+shift),
        vec3(0, 1+shift, 1+shift),
        vec3(1+shift, 1+shift, 1+shift),
        vec3(-1-shift, 1+shift, 0),
        vec3(0, 1+shift, 0),
        vec3(1+shift, 1+shift, 0),
        vec3(-1-shift, 1+shift, -1-shift),
        vec3(0, 1+shift, -1-shift),
        vec3(1+shift, 1+shift, -1-shift),

        vec3(-1-shift, 0, 1+shift),
        vec3(0, 0, 1+shift),
        vec3(1+shift, 0, 1+shift),
        vec3(-1-shift, 0, 0),
        vec3(0, 0, 0),
        vec3(1+shift, 0, 0),
        vec3(-1-shift, 0, -1-shift),
        vec3(0, 0, -1-shift),
        vec3(1+shift, 0, -1-shift),

        vec3(-1-shift, -1-shift, 1+shift),
        vec3(0, -1-shift, 1+shift),
        vec3(1+shift, -1-shift, 1+shift),
        vec3(-1-shift, -1-shift, 0),
        vec3(0, -1-shift, 0),
        vec3(1+shift, -1-shift, 0),
        vec3(-1-shift, -1-shift, -1-shift),
        vec3(0, -1-shift, -1-shift),
        vec3(1+shift, -1-shift, -1-shift)
   ];

   if(tremble)
       scale_cubes = [
            vec3(1+shift*0.1, 1+shift*0.5, 1+shift*0.2),
            vec3(1+shift*0.05, 1+shift*0.74, 1+shift*0.3),
            vec3(1+shift*0.3, 1+shift*0.67, 1+shift*0.35),
            vec3(1+shift*0.3, 1+shift*Math.random(), 1+shift*0.3),
            vec3(1+shift*Math.random(), 1+shift*0.3, 1+shift*0.4),
            vec3(1+shift*0.46, 1+shift*0.3, 1+shift*0.3),
            vec3(1+shift*Math.random(), 1+shift*0.24, 1+shift*0.3),
            vec3(1+shift*Math.random(), 1+shift*0.3, 1+shift*0.3),
            vec3(1+shift*0.3, 1+shift*0.3, 1+shift*0.3),

            vec3(1+shift*0.3, 1+shift*0.3, 1+shift*Math.random()),
            vec3(1+shift*Math.random(), 1+shift*0.3, 1+shift*0.3),
            vec3(1+shift*0.3, 1+shift*0.3, 1+shift*Math.random()),
            vec3(1+shift*0.3, 1+shift*Math.random(), 1+shift*0.3),
            vec3(1+shift*Math.random(), 1+shift*0.3, 1+shift*0.3),
            vec3(1+shift*0.3, 1+shift*Math.random(), 1+shift*0.3),
            vec3(1+shift*0.8, 1+shift*0.3, 1+shift*Math.random()),
            vec3(1+shift*0.2, 1+shift*Math.random(), 1+shift*0.3),
            vec3(1+shift*0.1, 1+shift*0.3, 1+shift*0.3),

            vec3(1+shift*0.26, 1+shift*Math.random(), 1+shift*0.84),
            vec3(1+shift*0.57, 1+shift*Math.random(), 1+shift*0.73),
            vec3(1+shift*0.55, 1+shift*0.15, 1+shift*Math.random()),
            vec3(1+shift*0.36, 1+shift*0.7, 1+shift*0.3),
            vec3(1+shift*0.5, 1+shift*Math.random(), 1+shift*0.3),
            vec3(1+shift*0.4, 1+shift*Math.random(), 1+shift*0.3),
            vec3(1+shift*Math.random(), 1+shift*Math.random(), 1+shift*0.6),
            vec3(1+shift*0.3, 1+shift*0.3, 1+shift*0.54),
            vec3(1+shift*0.12, 1+shift*0.63, 1+shift*Math.random())
       ];

 }

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

// Animation constants and variables
const ANIM_NO_ANIM = -1;
const ANIM_SURFACE = 0;
const ANIM_ROTATE = 1;
var anim_surface;
var anim_surface_clockwise;
var anim_rotate_axis;
var anim = ANIM_NO_ANIM;

const ANIM_SURFACE_TIME = 10;
var time_surface = ANIM_SURFACE_TIME;
var omega_rotate = 10;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];
var texCoordsArray = [];
var image;

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

  var image = new Image();
    image.onload = function() { 
       configureTexture( image );
    }
  
  image.src = "white_black.png";

  var image = document.getElementById("texImage");
 
  configureTexture( image );
  timer.reset(); 
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
  texCoordsArray.push(texCoord[0]);
  points.push(vertices[v3]);
  texCoordsArray.push(texCoord[1]);
  points.push(vertices[v4]);
  texCoordsArray.push(texCoord[2]);
  points.push(vertices[v1]);
  texCoordsArray.push(texCoord[0]);
  points.push(vertices[v4]);
  texCoordsArray.push(texCoord[2]);
  points.push(vertices[v2]);
  texCoordsArray.push(texCoord[3]);
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

/*--------------keyboard event------------------*/
window.addEventListener("keydown", function() {

  
  if(!resetMode)
  {
    if (anim != ANIM_NO_ANIM) return;
    var toColor;
    anim_surface = 6;
    anim_surface_clockwise = 0;
    anim = ANIM_NO_ANIM;
    // switch for type of explosion
    switch (event.keyCode) {
      case 49:  //'1' key
        exp=-exp;
        break;
      case 50:  //'2' key
        expall=-expall;
        break;
      case 51:  //'3' key
        shift=0;
        expall=-1;
        exp=-1;
        initCubeTrans();
        initCubeScals();
        break;
      case 52: // '4' key
        if(tremble)
          tremble=false;
        else
          tremble=true;
        break;
    }
    /*
      Press
        't' to rotate top
    */
    // switch for surface of rotation
    switch (event.keyCode) {
      case 81:
      case 65:
        anim_surface = TOP;
        rotHis.push(TOP);
      break;
      case 87:
      case 83:
        anim_surface = BOTTOM;
        rotHis.push(BOTTOM);
      break;
      case 69:
      case 68:
        anim_surface = LEFT;
        rotHis.push(LEFT);
      break;
      case 82:
      case 70:
        anim_surface = RIGHT;
        rotHis.push(RIGHT);
      break;
      case 84:
      case 71:
        anim_surface = FRONT;
        rotHis.push(FRONT);
      break;
      case 89:
      case 72:
        anim_surface = BACK;
        rotHis.push(BACK);
        
      break;
      case 77:
      case 109:
        if(rotHis.length>0)
        {
          shift=0;
          shiftUnit=0.001;
          exp=-1;
          expall=-1;
          anim_surface=rotHis[rotHis.length-1];
          anim_surface_clockwise=clkHis[clkHis.length-1];
          time_surface = 0;
          anim = ANIM_SURFACE;
          resetMode=1;
        }
      break;
    }
    // switch for surface rotation clockwise
    switch (event.keyCode) {
      case 81:
      case 87:
      case 69:
      case 82:
      case 84:
      case 89:
        anim_surface_clockwise = 1;
        clkHis.push(-1);
      break;
      case 65:
      case 83:
      case 68:
      case 70:
      case 71:
      case 72:
        anim_surface_clockwise = -1;
        clkHis.push(1);
      break;
    }

    // switch for rotation axis
    switch (event.keyCode) {
      case 90:
        anim_rotate_axis = [0, 0, 1];
        break;
      case 88:
        anim_rotate_axis = [1, 0, 0];
        break;
      case 67:
        anim_rotate_axis = [0, 1, 0];
        break;
    }

    // switch for type of action
    switch (event.keyCode) {
      // reset
      case 80:
        // for (var i = 0; i < NumCubes; i++) {
        //   cube_positions[i] = i;
        //   cube_matrices[i] = mat4();
        // }
        viewMatrix = initial_position;
      break;
      // rotate surface
      case 81:
      case 87:
      case 69:
      case 82:
      case 84:
      case 89:
      case 65:
      case 83:
      case 68:
      case 70:
      case 71:
      case 72:
        time_surface = 0;
        anim = ANIM_SURFACE;
      break;
      // rotate cube
      case 90:
      case 88:
      case 67:
        anim = ANIM_ROTATE;
      break;
    }
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

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function TexCoordArray() {
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
}

function render() {

  time = timer.getElapsedTime() / 1000;
  // Cubes self motion parameters
  scale_factor += scale_speed;
  if (scale_factor <= SCALE_MIN || scale_factor >= SCALE_MAX) scale_speed = -scale_speed;

  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  if(resetMode==0)
  {
    switch (anim) {
      case ANIM_ROTATE:
        viewMatrix = mult(viewMatrix, rotate(omega_rotate, anim_rotate_axis));
        anim = ANIM_NO_ANIM;
        break;
      case ANIM_SURFACE:
        time_surface++;
      for (var i = 0; i < 9; i++) {
          var myPosition = cube_positions[rotation_rubiks[anim_surface][i]];
          cube_matrices[myPosition] = mult(rotate(anim_surface_clockwise * (90 / ANIM_SURFACE_TIME), axes[anim_surface]), cube_matrices[myPosition]);
        }
        if (time_surface == ANIM_SURFACE_TIME) {
          anim = ANIM_NO_ANIM;
          update_cube_positions(anim_surface, anim_surface_clockwise > 0 ? 0 : 1);
        }
      break;
    }
  }
  else
  {
    explodeWhenReset();
    var temp=Math.random();
    viewMatrix = mult(viewMatrix, rotate(1*temp, [0, 0, 1]));
    viewMatrix = mult(viewMatrix, rotate(0.7*temp, [1, 0, 0]));
    viewMatrix = mult(viewMatrix, rotate(1.3*temp, [0, 1, 0]));
    if(anim!=ANIM_NO_ANIM)
    {
      time_surface++;
      for (var i = 0; i < 9; i++) {
          var myPosition = cube_positions[rotation_rubiks[anim_surface][i]];
          cube_matrices[myPosition] = mult(rotate(anim_surface_clockwise * (90 / ANIM_SURFACE_TIME), axes[anim_surface]), cube_matrices[myPosition]);
        }
        if (time_surface == ANIM_SURFACE_TIME) {
          anim = ANIM_NO_ANIM;
          update_cube_positions(anim_surface, anim_surface_clockwise > 0 ? 0 : 1);
          rotHis.pop();
          clkHis.pop();
          if(rotHis.length!=0)
          {
            anim_surface=rotHis[rotHis.length-1];
            anim_surface_clockwise=clkHis[clkHis.length-1];
            time_surface = 0;
            anim = ANIM_SURFACE;
          }
          else
          {
            mtplr=[-1,-1,-1,-1,-1,-1,-1,-1];
            reUnite=true;
            anim = ANIM_NO_ANIM;
          }
        }
      }



  }

  // draw all cubes
  for (var i = 0; i < NumCubes; i++) {
    
    // var image = new Image();
    // image.src = "white_black.png"; 
    // configureTexture( image );

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
    
    TexCoordArray();
    if(expall==1||exp==1)
    {
      var temp=Math.random();
      viewMatrix = mult(viewMatrix, rotate(1*temp*0.03, [0, 0, 1]));
      viewMatrix = mult(viewMatrix, rotate(0.7*temp*0.03, [-1, 0, 0]));
      viewMatrix = mult(viewMatrix, rotate(1.3*temp*0.03, [0, 1, 0]));
    }
    var ctm = mat4();
    ctm = mult(ctm, projectionMatrix);
    ctm = mult(ctm, viewMatrix); 
    ctm = mult(ctm, cube_matrices[i]);
    
    if(exp==1)explode();
    if(expall==1)explodeAll();
    ctm = mult(ctm, translate(translate_cubes[i]));
    ctm=mult(ctm, scale(scale_cubes[i]));
    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));
    gl.drawArrays(gl.TRIANGLES, 0, NumCubeVertices);
  }
    window.requestAnimFrame(render);
}
