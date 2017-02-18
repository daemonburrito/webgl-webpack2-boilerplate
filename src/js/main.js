// Draws a box Hello World
import * as glMatrix from 'gl-matrix';

// shader sources
import vertexShaderSrc from 'shaders/demo-vertex.glsl';
import fragShaderSrc from 'shaders/demo-frag.glsl';

// data
import boxData from '../data/box.json';

// helpers
import {
  compileShader,
  link
} from './utils';


const setup = gl => {
  gl.clearColor(0.5, 0.5, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);
}


const init = (...args) => {
  const canvas = document.querySelector('canvas'),
    gl = canvas.getContext('webgl2');

  setup(gl);

  const vertexShader = compileShader(gl, vertexShaderSrc, gl.VERTEX_SHADER),
    fragShader = compileShader(gl, fragShaderSrc, gl.FRAGMENT_SHADER),

    program = link(gl, [vertexShader, fragShader], gl.createProgram());

  gl.useProgram(program);

  const boxVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVBO);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxData.v), gl.STATIC_DRAW);

  const boxIBO = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIBO);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(boxData.i),
      gl.STATIC_DRAW);

  const posAttribLocation = gl.getAttribLocation(program, 'vertPosition'),
    colorAttribLocation = gl.getAttribLocation(program, 'vertColor'),

    matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld'),
    matViewUniformLocation = gl.getUniformLocation(program, 'mView'),
    matProjUniformLocation = gl.getUniformLocation(program, 'mProj'),

    worldMatrix = new Float32Array(16),
    viewMatrix = new Float32Array(16),
    projMatrix = new Float32Array(16);


  glMatrix.mat4.identity(worldMatrix);
  glMatrix.mat4.lookAt(viewMatrix, [0,0,-8], [0,0,0], [0,1,0]);
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
    angle = 0,
    xRotationMatrix = new Float32Array(16),
    yRotationMatrix = new Float32Array(16);

  let loop = () => {
    setup(gl);

    angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle, [0,1,0]);
    glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle/4, [1,0,0]);
    glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);

    gl.drawElements(gl.TRIANGLES, boxData.i.length, gl.UNSIGNED_SHORT, 0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

init();