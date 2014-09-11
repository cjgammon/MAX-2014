#ifdef GL_ES
    precision highp float;
#endif

uniform vec2 resolution;
uniform float time;
uniform float delta;

varying vec2 vUv;        

void main(void)
{
    vec2 position = vUv;

    float red = 0.5 + sin(2.0 * position.y + position.x + delta) * 0.25;
    float green = 0.2 + sin(4.0 * position.y + position.x + delta) * 0.1;
    float blue = 0.75 + sin(position.y + position.x + delta) * 0.25;

    vec3 rgb = vec3(red, green, blue);
    vec4 color = vec4(rgb, 1.0);
    
    gl_FragColor = color;
}