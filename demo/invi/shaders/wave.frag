void main(void)
{
	float t = iGlobalTime + 1000.0;
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	uv.x = uv.x*1.5;
	uv += uv*uv.x-.5;
	

	vec3 final_color = vec3(1.0);

	vec3 wave_color = vec3(0.0);
		
	// To create the waves
	float wave_width = 0.01;
	uv  = -1.0 + 2.0 * uv;
	uv.y += sin(t*1.0);
	//for(float i = 0.0; i < 8.0; i++) {
	for(float i = 0.0; i < 8.0; i++) {
		
		uv.y += (0.02 * sin(uv.x + i/70.0 + t*2.+i));
		uv.y += 0.2+(0.1 * sin(uv.x + i/10.0 + t*5.+i ));
		uv.y -= 0.1+(0.05 * sin(uv.x + i/80.0 + t*3.));
		float arvo = (sin(t*3.)*.5+.1) / (50.0 * uv.y);
		wave_width = abs(arvo);
	

		wave_color += vec3(wave_width * 1.9, wave_width, wave_width * clamp(sin(t*sin(t*5.)*0.0001*uv.x)*2.8,0.5,1.0));
	}
	
	final_color = wave_color + vec3(0.1,0.0,uv.y*0.2);
	
	
	gl_FragColor = vec4(final_color /* * sin(t)*/, 1.0)+mod(iGlobalTime*1.0,1.0);
}