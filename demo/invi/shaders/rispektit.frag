
uniform float flash;
uniform float beat;

void main() { 
	float time = iGlobalTime;
	vec2 coords = gl_FragCoord.xy / iResolution.xy;
	coords.y=1.0-coords.y;
	vec2 uv = coords;
	uv.x*=iResolution.x/iResolution.y;

	vec3 col = vec3(1.0)-texture2D(iChannel0, vec2(min(max(uv.x,0.0),1.0),uv.y)).rgb;
	//col = vec3(pow(col.r+0.5,50.0)-0.50);
	gl_FragColor = vec4(col, 1.0);
}