//shadertoy.com
void main( void )
{
	float t=iGlobalTime*1.5; //lyhennysmerkintä

	vec2 coords = gl_FragCoord.xy / iResolution.xy;
	coords.y=1.0-coords.y;
	vec2 uv = coords;
	uv.x*=iResolution.x/iResolution.y;
	vec2 pos = ( gl_FragCoord.xy / vec2(320, 240))*(sin(t)*0.2+2.0);
	float a=t*.2;
	pos= pos+vec2(sin(pos.x*4.0),sin(pos.y*3.0))*0.5;
	pos= vec2(pos.x*cos(a)-pos.y*sin(a),pos.x*sin(a)+pos.y*cos(a)); // pyöritys
	pos= pos+vec2(sin(pos.x*4.0),sin(pos.y*3.0))*sin (pos.y*.01+t)*0.1; //aaldojuddu :DD
	float color_r =  sin( pos.y * 40.0+t*10.0 )+sin(pos.x*10.0+t*10.0);
	float color_g = sin(t*0.5*20.0+ pos.x*6.0)+sin(pos.y*3.0);
	float color_b = sin(pos.x+pos.y);
	float summa = color_r+color_g+color_b;
	summa = summa/3.0;
	vec4 vari = vec4( color_r*0.0+summa,color_g+summa,color_b+summa,0.0);
	vari = vari*sin(pos.y*.01+t);
	vec3 col = texture2D(iChannel1, vec2(coords.x,floor(iGlobalTime*0.5)*0.08+max(min(-0.25+0.1*mod(-iGlobalTime*0.5,1.0)+coords.y*(iResolution.y/iResolution.x),0.08),0.0))).rgb*0.5*(1.+mod(gl_FragCoord.y,2.0));
 	vari=max(vari/2.,vec4(2.0-pow(col.r+0.5,50.0)-0.50));
	gl_FragColor = vari;
}