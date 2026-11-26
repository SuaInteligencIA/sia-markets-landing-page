// Gradiente animado (shader WebGL) do topo do site da Sua InteligêncIA, trazido sem mudanças de
// comportamento: só desenha com o elemento na tela e a aba visível, e para com "reduzir movimento".
import { FRAGMENT_SHADER } from './shader';

/** A small, offscreen-aware renderer for the gradient provided by the user. */
export function mountAnimatedGradient(canvas: HTMLCanvasElement, onReady: () => void, options: { fps?: number; maxPixels?: number } = {}) {
  const gl = canvas.getContext('webgl2', {
    alpha: false, antialias: false, depth: false, stencil: false,
    powerPreference: 'low-power', preserveDrawingBuffer: false,
  });
  if (!gl) return undefined;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Hero gradient shader failed:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, '#version 300 es\nin vec2 a_position; void main() { gl_Position = vec4(a_position, 0.0, 1.0); }');
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    if (program) gl.deleteProgram(program);
    return undefined;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Hero gradient program failed:', gl.getProgramInfoLog(program));
    gl.deleteShader(vertex); gl.deleteShader(fragment); gl.deleteProgram(program);
    return undefined;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  if (!buffer) { gl.deleteShader(vertex); gl.deleteShader(fragment); gl.deleteProgram(program); return undefined; }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const u = {
    time: uniform('u_time'), resolution: uniform('u_resolution'), pixelRatio: uniform('u_pixelRatio'),
    scale: uniform('u_scale'), rotation: uniform('u_rotation'), color1: uniform('u_color1'),
    color2: uniform('u_color2'), color3: uniform('u_color3'), proportion: uniform('u_proportion'),
    softness: uniform('u_softness'), shape: uniform('u_shape'), shapeScale: uniform('u_shapeScale'),
    distortion: uniform('u_distortion'), swirl: uniform('u_swirl'), swirlIterations: uniform('u_swirlIterations'),
  };
  const color = (location: WebGLUniformLocation | null, hex: string) => {
    const value = Number.parseInt(hex.slice(1), 16);
    gl.uniform4f(location, (value >> 16 & 255) / 255, (value >> 8 & 255) / 255, (value & 255) / 255, 1);
  };
  // Prism's original dark / light / white structure, with the brand's navy and blues.
  color(u.color1, '#07142e');
  color(u.color2, '#2359df');
  color(u.color3, '#91beff');
  gl.uniform1f(u.scale, .01);
  gl.uniform1f(u.rotation, -50 * Math.PI / 180);
  gl.uniform1f(u.proportion, .45);
  gl.uniform1f(u.softness, .65);
  gl.uniform1f(u.shape, 0);
  gl.uniform1f(u.shapeScale, .45);
  gl.uniform1f(u.distortion, 0);
  gl.uniform1f(u.swirl, .5);
  gl.uniform1f(u.swirlIterations, 12);

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const frameInterval = 1000 / (options.fps ?? 60);
  const maxPixels = options.maxPixels ?? 350000;
  let visible = false, disposed = false, frame = 0, lastFrame = 0, nextFrame = 0, elapsed = 0, ready = false;
  let ratio = 1;
  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    // Fewer fragments leave room for smooth motion even on integrated GPUs.
    const scale = Math.min(1, 900 / bounds.width, 450 / bounds.height, Math.sqrt(maxPixels / (bounds.width * bounds.height)));
    canvas.width = Math.max(1, Math.round(bounds.width * scale));
    canvas.height = Math.max(1, Math.round(bounds.height * scale));
    ratio = canvas.width / bounds.width;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  const draw = () => {
    if (disposed || gl.isContextLost() || !canvas.width) return;
    gl.uniform1f(u.time, elapsed * 1.5 - 2.99);
    gl.uniform2f(u.resolution, canvas.width, canvas.height);
    gl.uniform1f(u.pixelRatio, ratio);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (!ready) { ready = true; onReady(); }
  };
  const stop = () => { cancelAnimationFrame(frame); frame = 0; lastFrame = 0; nextFrame = 0; };
  const canAnimate = () => !disposed && visible && !motion.matches && document.visibilityState === 'visible';
  const loop = (now: number) => {
    frame = 0;
    if (!canAnimate()) return;
    // Respect the requested cadence across 60/75/120 Hz screens without extra draws.
    if (!nextFrame || now + 1 >= nextFrame) {
      if (lastFrame) elapsed += Math.min((now - lastFrame) / 1000, .1);
      lastFrame = now;
      draw();
      nextFrame = nextFrame ? nextFrame + frameInterval : now + frameInterval;
      if (nextFrame < now - frameInterval) nextFrame = now + frameInterval;
    }
    frame = requestAnimationFrame(loop);
  };
  const sync = () => { stop(); if (visible) draw(); if (canAnimate()) frame = requestAnimationFrame(loop); };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  const resizeObserver = new ResizeObserver(() => { resize(); if (visible) draw(); });
  const lost = (event: Event) => { event.preventDefault(); stop(); };
  canvas.addEventListener('webglcontextlost', lost);
  observer.observe(canvas);
  resizeObserver.observe(canvas);
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  resize();
  return {
    dispose() {
      disposed = true; stop(); observer.disconnect(); resizeObserver.disconnect();
      canvas.removeEventListener('webglcontextlost', lost);
      motion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment);
    },
  };
}
