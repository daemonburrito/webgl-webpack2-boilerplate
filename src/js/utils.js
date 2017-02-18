// Helper functions

// Compile glsl.
// Returns the compiled shader.
export const compileShader = (gl, src, glShaderType) => {
  const shader = gl.createShader(glShaderType);

  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }

  return shader;
};


// Link one or more shaders with a program.
// If an already-created program is provided, it will be used.
// Returns the linked program.
export const link = (gl, shaders, program) => {
  if (!program) {
    const program = gl.createProgram();
  }

  shaders.forEach(s => {
    gl.attachShader(program, s);
  });

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
  }

  return program;
};

export default {
  compileShader, link
};