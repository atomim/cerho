void main(void)
{
	float t = iGlobalTime + 1000.0;
	vec2 uv = gl_FragCoord.xy / iResolution.xy;	
	uv.x *= iResolution.x/iResolution.y;
	vec2 uv2 = uv*4.-.1;
	uv2*=uv2*uv2;
	//uv2.x *=iResolution.x/iResolution.y*5.;
	//uv2.x -= sin(t*2.)*2.5;
	uv2 = min(max(1.0-uv2,0.0),1.0);
	
	//vec2 uv2 = gl_FragCoord.xy / iResolution.xy;
	
	vec2 BallPosition_1 = vec2(1.+0.5*sin(t), 0.5);
	//float BallPosition.z = float sin(t*4)*0.5+5);
	float z = sin(t*3.0)*1.+3.0;
	float ballSize_1 = 0.6*z;
	//ballSize_1 = ballSize_1+sin(t*2)+1.0;	
	float DistanceBall_1=length(uv-BallPosition_1)*ballSize_1;
	DistanceBall_1=min(max(1.0-DistanceBall_1,0.0),1.0);
	DistanceBall_1*=DistanceBall_1;
	
	vec2 BallPosition_2=vec2(1.+0.5*sin(t*1.5), 0.5+0.2*sin(t*2.4));
	float ballSize_2=0.6*z+1.4;	
	float DistanceBall_2=length(uv-BallPosition_2)*ballSize_2;
	DistanceBall_2=min(max(1.0-DistanceBall_2,0.0),1.0);
	DistanceBall_2*=DistanceBall_2;
	
	vec2 BallPosition_3=vec2(1.+0.5*cos(t*1.5), 0.5+0.2*cos(t*2.4));
	float ballSize_3=0.6*z;
	float DistanceBall_3=length(uv-BallPosition_3)*ballSize_3;
	DistanceBall_3=min(max(1.0-DistanceBall_3,0.0),1.0);
	DistanceBall_3*=DistanceBall_3;
	
	vec3 colour=vec3(0);
	//colour.r=sin(uv.y*1.5+t*3.0);
	//colour.g=cos(uv.x*1.4+t*2.0);
	colour.r=sin(uv2.y*1.5);
	colour.g=cos(uv2.x*1.4);
	colour.b = (sin(t)+  uv.x*2.0-1.0)*0.1;
	//vec3 col = vec3(0.0,0.4*uv.y*0.8+0.01,0.4*uv.y);
	vec3 col = vec3(colour.b,0.2 * uv.y + 0.05, 0.21 * uv.y + (colour.b) );
	
	
	vec3 DistPos= vec3(distance(DistanceBall_1,DistanceBall_2),distance(DistanceBall_2,DistanceBall_3),distance(DistanceBall_1,DistanceBall_3));
	float vaaristus = (colour.r*colour.g*((t*DistanceBall_1)+(t*DistanceBall_2)+(t*DistanceBall_3))*0.0003);
	vaaristus = min(max(vaaristus,0.0),40.0);
	vec3 Colors = vec3(0.0,0.0,0.0);
	//Colors.g = DistanceBall_3*DistanceBall_3;
	float voimakkuus = 0.1;
	float Min =0.1;
	float Max = 1.1;
	float ball1 = sin(t*6.0)*voimakkuus+DistanceBall_1+Min;
	float ball2 = sin(t*5.0)*voimakkuus+DistanceBall_2+Min;
	float ball3 = sin(t*2.0)*voimakkuus+DistanceBall_3+Min;
	//ball1 *= ball2/ball3+Max;
	//ball2 *= ball3/ball2+Max;
	//ball3 *= ball2/ball1+Max;
	Colors = vec3(ball1,ball2,ball3);
		
	
	//if(DistanceBall_1+DistanceBall_2+DistanceBall_3> 0.5+0.2 * sin(t*1.0)*1.0)	
	if(DistanceBall_1+DistanceBall_2+DistanceBall_3> 0.8)	

	gl_FragColor = vec4(Colors+col,1.0);
	else
	//gl_FragColor = vec4(vec3(DistanceBall_1+vaaristus*z,DistanceBall_2+vaaristus*z,DistanceBall_3+vaaristus*z)+vaaristus+col,1.0);
	gl_FragColor = vec4(vec3(DistanceBall_1,DistanceBall_2,DistanceBall_3)+vaaristus+col+vaaristus*z,1.0);

}