//shadertoy.com

vec3 color= vec3(0.4,0.4,0.4);
vec2 Distort(vec2 p){
    float theta  = atan(p.y, p.x);
    float radius = length(p);
    radius = pow(radius, 1.05);
    p.x = radius * cos(theta);
    p.y = radius * sin(theta);
    color.r=0.5 * (p.y + 1.0);
    color.b=radius;
    return (p + 1.0);
}
vec4 image(void){
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	float aspectCorrection = (iResolution.x/iResolution.y);
	vec2 coordinate_entered = 2.0 * uv - 1.0;
	vec2 coord = vec2(aspectCorrection,1.0) *coordinate_entered;
	coord*=0.52;
	coord.y*=-1.;
	coord=Distort(coord);
	vec4 color=vec4(vec3(0.0),1.0);
	coord-=vec2(0.5);
	if(coord.x<1.0 && coord.x>0.0 && coord.y<1.0 && coord.y>0.0)
		return vec4(1.0)-texture2D(iChannel4,coord);
	return vec4(0.);
}

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
	vec3 col = (0.4+mod(gl_FragCoord.y,2.0))*(vec3(1.0)-texture2D(iChannel1, vec2(coords.x,floor(iGlobalTime*0.5)*0.08+max(min(-0.25+0.1*mod(-iGlobalTime*0.5,1.0)+coords.y*(iResolution.y/iResolution.x),0.081),0.005))).rgb);
 	vari.rgb=max(vari.rgb,col);
	vari.rgb=vec3(min(max(vari.r,0.),1.),min(max(vari.g,0.),1.),min(max(vari.b,0.),1.));
	if(vari.r<0.1)
	vari/=1.+mod(gl_FragCoord.y,2.0);
	gl_FragColor = vari+image()*0.1;
}