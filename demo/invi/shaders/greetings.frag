float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
mat2 rotate(float Angle)
{
    mat2 rotation = mat2(
        vec2( cos(Angle),  sin(Angle)),
        vec2(-sin(Angle),  cos(Angle))
    );
	return rotation;
}
struct polygon{
	vec2 A, B, C;
};
float roundBox(vec2 coord, vec2 pos, vec2 b ){
  return length(max(abs(coord-pos)-b,0.0));
}
float sun(vec2 coord, vec2 pos, float size){
	if(length(coord-pos)<size)
		return 1.0;
	return 0.0;
}
float sign(vec2 p1, vec2 p2, vec2 p3){
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

vec4 magik()
{
	vec4 tulos;
	vec4 lopullinentulos=vec4(1.0);
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	float time=(iGlobalTime-160.)*.5;
	float aspectCorrection = (iResolution.x/iResolution.y);
	vec2 coordinate_entered = 2.0 * uv - 1.0;
	vec2 coord = vec2(aspectCorrection,1.0) *coordinate_entered;
	vec2 c=coord;
	coord*=2.0/(1.1+time*0.07);
	coord*=rotate(time*0.4)*coord.x;
	coord.y+=time*0.5;
	tulos=vec4(vec3(220.0/255.0, 20.0/255.0, 95.0/255.0),1.0);
	float asfg=0.;
	if(mod(c.x+c.y,0.1)>0.05){
		for(float n=0.; n<30.; n++)
		if(sun(coord,vec2(-4.0+rand(vec2(n,40.234))*8.,n*0.5),(n*0.05+1.)*0.7*min(-n+time*2.3,1.0)+mod(floor((iGlobalTime-1.5)*(1./4.)),3.0))==1.0)
		   	if(mod(n,3.0)==1.) tulos.xyz=vec3(1.0,262.0/512.0, 94.0/255.0);
			else if(mod(n,3.0)==2.) tulos.xyz=vec3(0.0,0.0,0.0);
			else tulos.xyz=vec3(1.0,1.0, 1.0);
	}
		lopullinentulos.rgb=tulos.rgb;
	
	if(mod(gl_FragCoord.y,2.0)<1.0)   /////////////////////////
	lopullinentulos.xyz=lopullinentulos.xyz/1.3;
	lopullinentulos.xyz=vec3(1.5,0.9,1.2)-lopullinentulos.xyz;
	return lopullinentulos;
}


void main(void)
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	float time=iGlobalTime*0.5-8.;
	float aspectCorrection = (iResolution.x/iResolution.y);
	vec2 coordinate_entered = 2.0 * uv - 1.0;
	vec2 coord = vec2(aspectCorrection,1.0) *coordinate_entered;
	coord*=0.005+0.05/mod((time)*1.,1.0);
	coord*=rotate(time*3.141*1.);
	vec4 o=vec4(vec3(0.),1.);
	if(coord.x>-.25 && coord.x<.25 && coord.y>-(38./1024.) && coord.y<(38./1024.)){
		coord.y=1.-coord.y;
		coord.x-=0.5;
		coord.y-=0.5;
		coord.y+=floor(time)*(64./1024.)+(64./2048.);
		coord=coord+vec2(.25,0.);
		o=texture2D(iChannel2,coord)/(1.+0.5*mod(gl_FragCoord.y+gl_FragCoord.x,2.0));
	}
	o+=vec4(tan((-0.5+iGlobalTime)*3.141)*0.4);
	o+=vec4(max(-191.5+iGlobalTime,0.)*2.);
	gl_FragColor = o+vec4(vec3(0.05*rand(uv*vec2(iGlobalTime,0.2141))),1.0)+magik()*0.1;
}