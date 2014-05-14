struct polygon{
	vec2 A, B, C;
};
vec3 color= vec3(0.4,0.4,0.4);
float sign(vec2 p1, vec2 p2, vec2 p3){
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
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
vec4 rasternoise(vec2 p){
	return vec4(vec3(max(mod(-p.y*10.0-iGlobalTime*2.,3.0)-2.0,0.0)*rand(p+vec2(iGlobalTime))),1.0);
}
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
void main(void){
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	float aspectCorrection = (iResolution.x/iResolution.y);
	vec2 coordinate_entered = 2.0 * uv - 1.0;
	vec2 coord = vec2(aspectCorrection,1.0) *coordinate_entered;
	coord.x+=rand(vec2(coord.y+iGlobalTime))*0.005;
	coord*=0.52;
	coord.y*=-1.;
	coord=Distort(coord);
	vec4 color=vec4(vec3(0.0),1.0);
	coord-=vec2(0.5);
	if(coord.x<1.0 && coord.x>0.0 && coord.y<1.0 && coord.y>0.0)
		color = texture2D(iChannel7,coord);
	else
		color = texture2D(iChannel7,vec2(0.))/2.0;
	color+=rasternoise(uv)*0.09;
	if(mod(gl_FragCoord.y+gl_FragCoord.x,4.0)<1.0)
		color/=1.1;
	gl_FragColor=color;
}	