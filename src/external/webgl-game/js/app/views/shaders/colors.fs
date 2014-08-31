#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

void main()
{
	vec2 position = gl_FragCoord.yy / vec2(50.0);
	
	float r = 1.0;//length(position);
	float a = 0.0;//atan(position.y, position.x);
	float t = 2.0/(r+1.0);
	
	float light = 15.0*abs(0.05*(sin(t)+sin(a*10.0)));
	vec3 color = vec3(-sin(r*5.0-a-time+sin(r+t)), sin(r*3.0+a-time+sin(r+t)), cos(r+a*2.0+a+time)-sin(r+t));
	
	gl_FragColor = vec4((normalize(color)+0.9) * light , 1.0);
}