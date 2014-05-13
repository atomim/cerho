void main(void)
{
	float t = iGlobalTime + 1000.0;
	vec2 uv = gl_FragCoord.xy / iResolution.xy*2.-1.;
	uv.x*=iResolution.x/iResolution.y;
	uv*=uv*uv/uv;
	vec3 colors=vec3(0.0);
	
	vec3 colour=vec3(0);
	colour.r=sin(uv.y*2.5+t*cos(t*0.004));
	colour.g=cos(uv.x*5.0+t*2.0);
	colour.g-=sin(uv.x*t*0.0003/t*100.*uv.y*t*0.5);
	colour.b =colour.r-colour.g*t;
	
	for(float i=0.0;i<20.0;i++){
	vec2 ballPos=vec2(0.5*i*0.1+sin(t+i*2.),cos(t*2.+i)-0.5*0.1*i);
	float ballSize=1.5+i*0.001;
	float ballDistance=length(uv-ballPos)*ballSize-i*0.01;
	float centerDistance=length(vec2(0.0,0.0)-ballPos)*ballSize-i*0.01;
	ballDistance=min(max(1.0-ballDistance,0.0),1.0);
	ballSize =min(max(1.0-ballSize,0.),1.);	
	//ballDistance*=ballDistance;
	//colors += vec3(1.0+0.3*sin(sin(t*1.5)*0.01),ballDistance*colour.r,ballSize);
	
	float vaaristus = 0.02*sin(colour.r*colour.g*((t*ballDistance*0.001)+(t*ballDistance*i*0.05))*0.03);
	//colors += vec3(sin(ballDistance*t*0.03)+ballPos.x*0.1*i*0.01,0.5*cos(colour.r*t*0.01)*0.1+sin(ballDistance*t*0.03+0.1)+ballPos.x*0.1*i*0.01,vaaristus);
	if(mod(iGlobalTime,1.0)<0.5){
		colors += vec3(sin(vaaristus*t*0.03)+ballPos.x*0.1*i*0.01,cos(t*0.01)+sin(vaaristus*t*0.1*i*0.1)-1.0,sin(vaaristus*t*0.1));
	}
 	else{
		colors -= vec3(colour.b,colour.b,colour.b);
	}
		//colors *= vec3((uv*i*0.000001),i*0.1);
	}
	
	vec2 pallo2paikka=vec2(1.+0.5*sin(t*1.5), 0.5+0.2*sin(t*2.4));
	float pallo2koko=2.5;
	float etaisyysPalloKakkoseen=length(uv-pallo2paikka)*pallo2koko;
	etaisyysPalloKakkoseen=min(max(1.0-etaisyysPalloKakkoseen,0.0),1.0);
	etaisyysPalloKakkoseen*=etaisyysPalloKakkoseen;
	

	
	//float vaaristus = 0.02*sin(colour.r*colour.g*((t*etaisyysPalloYkkoseen)+(t*etaisyysPalloKakkoseen))*0.03);
	//etaisyysPalloYkkoseen+=etaisyysPalloYkkoseen/0.8; //tehdään pisteestä pallomaisempi
	
	//if(etaisyysPalloYkkoseen+etaisyysPalloKakkoseen> 0.5+0.2 * sin(t*1.0)*1.0)
	gl_FragColor = vec4(colors*0.26,1.0);
	//gl_FragColor += vec4(vec3(1.0+0.3*sin(sin(t*1.5)*0.01),etaisyysPalloYkkoseen*colour.r,etaisyysPalloKakkoseen),1.0);
	//else
	//gl_FragColor = vec4(vec3(sin(t*2.0)*colour.g*0.2+etaisyysPalloYkkoseen+vaaristus,vaaristus,etaisyysPalloKakkoseen*sin(t*2.0))+vaaristus,1.0);

}