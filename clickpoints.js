/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Teiknar punkt á strigann þar sem notandinn smellir
//     með músinni
//
//    Hjálmtýr Hafsteinsson, ágúst 2025
/////////////////////////////////////////////////////////////////
(function () {
var canvas;
var gl;

// Þarf hámarksfjölda punkta til að taka frá pláss í grafíkminni
var maxNumPoints = 200;
var maxNumVertices = maxNumPoints * 3;
var index = 0;
var sidePx = 36.0;

function init() {

    canvas = document.getElementById( "gl-clickpoints" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumPoints, gl.DYNAMIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Hjálparföll
    function toNDC(px, py) {
        var x = 2 * px / canvas.width - 1;
        var y = 2 * (canvas.height - py) / canvas.height - 1;
        return vec2(x, y);
    }

    function pushVertexNDC(ndc) {
        if (index >= maxNumVertices) return; // fylltur buffer
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(ndc));
        index++;
    }
    
    canvas.addEventListener("mousedown", function(e){
      if (index > maxNumVertices) return;

        var xp = e.offsetX;
        var yp = e.offsetY;

        var s = sidePx;
        var h = Math.sqrt(3) * 0.5 * sidePx;

        var Ax = xp + 0.0;
        var Ay = yp - (2 * h / 3);
        var Bx = xp - (s / 2);
        var By = yp + (h / 3);
        var Cx = xp + (s / 2);
        var Cy = yp + (h / 3);

        pushVertexNDC(toNDC(Ax, Ay));
        pushVertexNDC(toNDC(Bx, By));
        pushVertexNDC(toNDC(Cx, Cy));
    });

    render();
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, index );

    window.requestAnimFrame(render);
}

window.addEventListener("load", init);
})();