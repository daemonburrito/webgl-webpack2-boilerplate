// Draws the triangle Hello World.
import * as glMatrix from 'gl-matrix';

import vertexShaderSrc from 'shaders/demo-vertex.glsl';
import fragShaderSrc from 'shaders/demo-frag.glsl';


const init = (...args) => {
  let canvas = document.querySelector('canvas');
  let gl = canvas.getContext('webgl');

  const checkShader = (shader) => {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return;
    }
  }

  const checkLinker = (program) => {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
  }

  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

  const vertexShader = gl.createShader(gl.VERTEX_SHADER),
    fragShader = gl.createShader(gl.FRAGMENT_SHADER),
    program = gl.createProgram();

  gl.shaderSource(vertexShader, vertexShaderSrc);
  gl.shaderSource(fragShader, fragShaderSrc);

  gl.compileShader(vertexShader);
  gl.compileShader(fragShader);
  checkShader(vertexShader);
  checkShader(fragShader);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);
  checkLinker(program);

  let triangleVertices = new Float32Array([
    0.0, 0.5, 0.0,    1.0, 0.0, 0.0,
    -0.5, -0.5, 0.0,  0.0, 1.0, 0.0,
    0.5, -0.5, 0.0,   0.0, 0.0, 1.0
  ]);

  let triangleVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVBO);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);

  let posAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

  gl.useProgram(program);

  let matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  let matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  let matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

  let worldMatrix = new Float32Array(16);
  let viewMatrix = new Float32Array(16);
  let projMatrix = new Float32Array(16);

  glMatrix.mat4.identity(worldMatrix);
  glMatrix.mat4.lookAt(viewMatrix, [0,0,-2], [0,0,0], [0,1,0]);
  glMatrix.mat4.perspective(projMatrix,
    glMatrix.glMatrix.toRadian(45), canvas.width/ canvas.height, 0.1, 1000);

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

  gl.vertexAttribPointer(
    posAttribLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT,
    0
  )

  gl.vertexAttribPointer(
    colorAttribLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT
  )

  gl.enableVertexAttribArray(posAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  let identityMatrix = glMatrix.mat4.identity(new Float32Array(16)),
    angle = 0;

  let loop = () => {
    angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0,1,0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

init();