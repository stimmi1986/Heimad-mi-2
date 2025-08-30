"use strict";

(function() {
var canvas;
var gl;

var points = [];

var NumTimesToSubdivide = 4;

function init()
{
    canvas = document.getElementById( "gl-gasket2" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); return; }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var A = vec2(-1, -1),
        B = vec2( 1, -1),
        C = vec2( 1,  1),
        D = vec2(-1,  1);

    divideSquare(A, B, C, D, NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function square( a, b, c, d )
{
    points.push( a, b, c );
    points.push( a, c, d );
}

function divideSquare( a, b, c, d, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        square( a, b, c, d );
        return;
    }
    

    //bisect the sides

    var ab1 = mix( a, b, 1/3 ), ab2 = mix( a, b, 2/3 );
    var bc1 = mix( b, c, 1/3 ), bc2 = mix( b, c, 2/3 );
    var cd1 = mix( d, c, 1/3 ), cd2 = mix( d, c, 2/3 );
    var da1 = mix( a, d, 1/3 ), da2 = mix( a, d, 2/3 );

    var p11 = mix(da1, bc1, 1/3), p21 = mix(da1, bc1, 2/3);
    var p12 = mix(da2, bc2, 1/3), p22 = mix(da2, bc2, 2/3);

    --count;

    // three new triangles

    divideSquare(a,   ab1, p11, da1, count);
    divideSquare(ab1, ab2, p21, p11, count);
    divideSquare(ab2, b,   bc1, p21, count);

    divideSquare(da1, p11, p12, da2, count);
    divideSquare(p21, bc1, bc2, p22, count);

    divideSquare(da2, p12, cd1, d,   count);
    divideSquare(p12, p22, cd2, cd1, count);
    divideSquare(p22, bc2, c,   cd2, count);
    
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}

window.addEventListener("load", init);
})();
