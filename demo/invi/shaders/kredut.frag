
uniform float flash;
uniform float beat;

void main() { 
	float time = iGlobalTime;
	vec2 coords = gl_FragCoord.xy / iResolution.xy;
	coords.y=1.0-coords.y;
	vec2 uv = coords;
	uv.x*=iResolution.x/iResolution.y;
	vec2 m=uv-vec2(0.5);
	vec4 c=vec4(0.0);
	float fade=max(iGlobalTime-79.,0.)*0.08+max(iGlobalTime-95.,0.)*0.3;
	float ajoitus=max(pow(iGlobalTime-79.,1.25)*0.01,0.0);
	m*=1.0-fade*0.1;
	for(float i=0.; i<1.0; i+=0.03){
		if(mod(length(m)-(iGlobalTime*ajoitus-i*0.077)*0.25,.3)<0.012 && mod(iGlobalTime*0.3*ajoitus+atan(m.x,m.y),3.74/10.0)>-3.14/60.0+3.14/20.0)
			c += vec4(0.14, 0.5, 0.0, 1.0);
		else if(mod(length(m)-(iGlobalTime*ajoitus-i*0.07)*0.5,.3)<0.012 && mod(atan(m.x,m.y),3.14/10.0)>-3.14/30.0+3.14/20.0)
			c += vec4(0.14, 0.5, 0.3, 1.0);
		else if(mod(length(m)-(iGlobalTime*0.76*ajoitus-i*0.037)*0.75,.1)<0.012 && mod(length(m)*1.4+atan(m.x,m.y),3.14/20.0)>-3.14/30.0+3.14/20.0)
			c += vec4(0.007, 0.008, 0.011, 1.0);
		else if(c.r<0.1)
			c = vec4(0.003,0.004,0.076,1.0);
	}
	c*=vec4(1.0*length(m)*length(m));
	c+=vec4(0.17,0.17,0.19,1.0);
	uv.x*=0.9+0.1*sin(iGlobalTime+uv.y*10.0+uv.x*10.0);
	uv*=0.8;
	uv=vec2(max(min(uv.x,1.0),0.0),max(min(uv.y,1.0),0.0));
	vec3 col=vec3(4.6+0.25*sin((uv.x*10.0+iGlobalTime)*3.141)+0.25*sin((uv.x*7.0+iGlobalTime*0.2)*3.141));
	col.b+=0.1;
	if(uv.y<0.11 && iGlobalTime<93.)
		col *= vec3(1.0)-texture2D(iChannel2, vec2(uv.x,mod(uv.y,0.11))).rgb;
	else if(uv.y*0.5>0.15 && uv.y*0.5<0.25 && iGlobalTime<94.)
		col *= vec3(1.0)-texture2D(iChannel2, vec2(uv.x*0.5-mod((iGlobalTime+1.5)*0.5/32.0,1.0/32.0),0.119+mod(uv.y*0.5,0.14)+floor((iGlobalTime+.5)*0.5)*0.1)).rgb;
	else
		col *= vec3(0.0);
		col+=c.rgb;
	//col = vec3(pow(col.r+0.5,50.0)-0.50);
	float valahdys=max(tan(iGlobalTime*3.141),0.)*0.1;
	gl_FragColor = vec4(vec3(1.0)-col+vec3(valahdys+tan(fade)), 1.0);
}