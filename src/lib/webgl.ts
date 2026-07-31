/**
 * A pre-checked canvas for OGL's `Renderer`.
 *
 * OGL asks for a context and, when the browser hands back `null`, logs
 * `console.error('unable to create webgl context')` before dereferencing it on the
 * very next line. The throw is catchable — both ray backgrounds already bail
 * gracefully on it — but the `console.error` is not, so a machine that simply has
 * no context to give (GPU asleep, driver blocklisted, too many live contexts on
 * the page) surfaces in Next's dev overlay as a hard error for a case the code
 * handles fine.
 *
 * Creating the canvas here and probing it first turns that into a quiet decision to
 * skip the effect. The probe costs nothing: `getContext` returns the same object on
 * repeat calls for a canvas, so the context opened here is the one OGL adopts.
 *
 * That reuse is also why the attributes below must mirror OGL's own defaults —
 * only the first successful `getContext` call decides them, and this is that call.
 * Raw WebGL and OGL disagree on `antialias`, so leaving them out would silently
 * give the ray shaders a different context than they ask for.
 */
const OGL_CONTEXT_DEFAULTS: WebGLContextAttributes = {
  alpha: false,
  depth: true,
  stencil: false,
  antialias: false,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false,
  powerPreference: 'default',
}

export const createWebGLCanvas = (
  attributes: WebGLContextAttributes = {},
): HTMLCanvasElement | null => {
  if (typeof document === 'undefined') return null

  const canvas = document.createElement('canvas')
  const attrs = { ...OGL_CONTEXT_DEFAULTS, ...attributes }

  // WebGL2 first, matching OGL's `webgl: 2` default, then the WebGL1 fallback it
  // makes itself.
  const gl = canvas.getContext('webgl2', attrs) ?? canvas.getContext('webgl', attrs)

  return gl ? canvas : null
}
