mat2 makerot(float alpha) {
	return 	mat2(cos(alpha), sin(alpha), 
						-sin(alpha), 
						cos(alpha));
}

void main(void)
{
	vec2 uv = gl_FragCoord.xy / iResolution.x;
	vec2 origuv = uv;
	
	vec3 col = vec3(1.0, 0.0, 0.0);
	
	float rotationstart = 4.0;
	float jumpstart = 6.0;
	float swim = min(1.0, max(0.0, (iGlobalTime-132.0)*0.5 - 4.0));
	float slices = 3.0;
	float ind2 = floor(mod(uv.x*slices, slices));
	
	float rot = (iGlobalTime-132.0)*0.5 > rotationstart ? 1.0 : 0.0;
	float jump = (iGlobalTime-132.0)*0.5 > jumpstart ? 0.55 : 0.0;
	

	mat2 uvrot = makerot((iGlobalTime-132.0)*0.5 * rot);
	//uv += vec2(-0.5, -0.5);
	uv *= 1.0 + pow(sin((iGlobalTime-132.0)*0.5	*4.0*jump), 2.5);
	uv = uvrot * uv;
	
	float z = mix(1.0, (uv.y + 0.5), swim) ;
	z = max(min(0.2, z), -0.2);
	uv.x = mix(uv.x, ((uv.x + 0.5) / z), swim)*mix(1.0, 0.2, swim);
	uv.y += z*4.0;
	vec3 fade = vec3(1.0, 1.0, 1.0);
	fade.rgb *= mix(vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0), 
					abs(z))*6.0;
	;
	
	float ind = floor(mod(uv.x*slices, slices));
	vec3 alter = vec3(ind < (iGlobalTime-132.0)*0.5);
	
	vec2 dir = vec2(cos(ind), sin(ind));
	
	float alpha = floor((iGlobalTime-132.0)*0.5 + ind*0.1);
	mat2 matmove = makerot(alpha);
	
	dir = matmove * dir;
	
	
	dir = normalize(dir);
	float ofs = (iGlobalTime-132.0)*0.5;
	
	vec3 sampl = vec3(0.0);
	
	for (float i = -2.0; i < 3.0; i+=1.0) {
		float plus = 1.0 + i*0.000010;
		sampl += texture2D(iChannel3, uv + (dir*plus) * ofs).rgb;
	}
	
	sampl.rgb *= (1.0/5.0);
	
	col.rgb = sampl.rgb * alter * fade;
	
	gl_FragColor = vec4(col,1.0);
}