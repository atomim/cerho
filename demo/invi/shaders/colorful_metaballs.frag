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


vec3 palautaPallo(vec2 pos, float koko, vec2 uv){			//palauttaa rgb-arvona
	float etaisyysPalloon=length(uv-pos)/koko;			//nykyisen pikselin etäisyys keskipisteeseen
	etaisyysPalloon=min(max((1.0-etaisyysPalloon),0.0),1.0);		//rajataan arvot 0.0..1.0 välille, huomaa invertoidaan väritys
	etaisyysPalloon*=etaisyysPalloon; //tehdään pisteestä pallomaisempi
	return vec3(etaisyysPalloon);
}
void main(void)
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	uv.x*=iResolution.x/iResolution.y;							//kuvasuhteen korjaus
	vec3 variarvot=vec3(0.0, 0.0, 0.0);
	for(float i=0.; i<10.; i++){
		//pallon paikka
		//keksitään jotain sattuman varaisia i:hin sidottuja arvoja pallolle		
		vec2 palloPaikka=vec2(0.5+0.5*sin(iGlobalTime+i)+0.1*i, 0.5+0.3*cos(iGlobalTime+sin(i)+0.54*i));		
		float palloKoko=0.35;
		variarvot+=palautaPallo(palloPaikka,palloKoko,uv);
	}
	
	variarvot *= vec3(sin(uv.x), sin(uv.y), cos(uv)) - vec3(sin(iGlobalTime) + 0.1, 0.0, 0.0);
	
	gl_FragColor = vec4(variarvot*2.0,1.0)*(0.9+image()*0.1);					//rgb-arvot esittävät etäisyyttä palloon nykyiseestä käsiteltävästä pikselistä
}