struct polygon{
	vec2 A, B, C;
};
float roundBox(vec2 coord, vec2 pos, vec2 b ){
  return length(max(abs(coord-pos)-b,0.0));
}
mat2 rotate(float Angle)
{
    mat2 rotation = mat2(
        vec2( cos(Angle),  sin(Angle)),
        vec2(-sin(Angle),  cos(Angle))
    );
	return rotation;
}
float box(vec2 coord, vec2 pos, vec2 size){
	if((coord.x<(pos.x+size.x)) &&
	   (coord.x>(pos.x-size.x)) &&
	   (coord.y<(pos.y+size.y)) && 
	   (coord.y>(pos.y-size.y)) ) 
		return 1.0;
	return 0.0;
}
float sun(vec2 coord, vec2 pos, float size){
	if(length(coord-pos)<size)
		return 1.0;
	return 0.0;
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float sign(vec2 p1, vec2 p2, vec2 p3){
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

int PointInTriangle(vec2 pt, vec2 v1, vec2 v2, vec2 v3){
	int b1, b2, b3;

	if(sign(pt, v1, v2) < 0.0) b1=1;
	if(sign(pt, v2, v3) < 0.0) b2=1;
	if(sign(pt, v3, v1) < 0.0) b3=1;
	if((b1 == b2) && (b2 == b3))
		return 1;
	return 0;
}

int PointInTriangle(vec2 pt, polygon X){
	int b1, b2, b3;

	if(sign(pt, X.A, X.B) < 0.0) b1=1;
	if(sign(pt, X.B, X.C) < 0.0) b2=1;
	if(sign(pt, X.C, X.A) < 0.0) b3=1;
	if((b1 == b2) && (b2 == b3))
		return 1;
	return 0;
}


void main(void)
{
	float vasenKulmakarva=floor(mod(iGlobalTime*0.8,2.0))*0.1;
	float oikeaKulmakarva=floor(mod(iGlobalTime*0.3,2.0))*0.1;
	float vasenSilma=min(max(0.24*sin(iGlobalTime),0.006),0.06);
	float oikeaSilma=min(max(0.24*sin(iGlobalTime),0.006),0.06);
	float suu=iGlobalTime*10.0;
	vec4 tulos;
	vec4 lopullinentulos=vec4(1.0);
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	float aspectCorrection = (iResolution.x/iResolution.y);
	vec2 coordinate_entered = 2.0 * uv - 1.0;
	for(float rgbare=0.0; rgbare<2.0; rgbare++){
	vec2 coord = vec2(aspectCorrection,1.0) *coordinate_entered;
	vec2 c=coord;
	coord*=2.0/(1.+iGlobalTime*0.03);
	coord.x*=1.0+rgbare*0.009;
	coord*=rotate(iGlobalTime*0.4)*coord.x;
	coord.y+=iGlobalTime*0.5;
	tulos=vec4(vec3(220.0/255.0, 20.0/255.0, 95.0/255.0),1.0);
	float asfg=0.;
	if(mod(c.x+c.y,0.1)>0.05){
		for(float n=0.; n<30.; n+=2.)
		if(sun(coord,vec2(-4.0+rand(vec2(n,40.234))*8.,n*0.5),(n*0.05+1.)*0.7*min(-n+iGlobalTime*2.3,1.0))==1.0)
		   	if(mod(n,3.0)==1.) tulos.xyz=vec3(1.0,262.0/512.0, 94.0/255.0);
			else if(mod(n,3.0)==2.) tulos.xyz=vec3(0.0,0.0,0.0);
			else tulos.xyz=vec3(1.0,1.0, 1.0);
		asfg+=2.99999;
		if(asfg==1000.) break;
	}
	for(float n=0.; n<9.; n++){
		float vinkuu=roundBox(coord, vec2(-4.0+rand(vec2(n,20.5334))*8.,n*0.5), vec2(0.263));	
		if(vinkuu<0.01)
		tulos.xyz+=vec3(0.6, 0.4, 0.2);
		asfg+=1.99999;
		if(asfg==1000.) break;
	}
	if(rgbare==0.0)
		lopullinentulos.r=tulos.r;
	if(rgbare==1.0)
		lopullinentulos.rgb=tulos.rgb;
	}
	if(mod(gl_FragCoord.y,2.0)<1.0)   /////////////////////////
	lopullinentulos.xyz=lopullinentulos.xyz/1.3;
	lopullinentulos.xyz=vec3(1.5,0.9,1.2)-lopullinentulos.xyz;
	gl_FragColor = lopullinentulos;
}