float pallo(vec3 sijainti, vec3 sateen_paikka,  float sade){
	return length(sateen_paikka-sijainti) - sade;
}

float etaisyys(vec3 paikka){
	return min(min(pallo(vec3(-sin(iGlobalTime*0.5), -sin(iGlobalTime*0.5), 0.0), paikka, 0.5), pallo(vec3(1.5, 0.0, sin(iGlobalTime)-0.5), paikka, 0.3)),
		       min(pallo(vec3(-1.0-sin(iGlobalTime), -cos(iGlobalTime), -(1.0 + sin(iGlobalTime))), paikka, 0.1), pallo(vec3(0.0, sin(iGlobalTime), -2.0), paikka, 0.3))); 
}

vec3 annaNormaali(vec3 paikka){
	
	float e = 0.02; //epsilon
	vec3 i = vec3 (1.0, 0.0, 0.0);
	vec3 j = vec3 (0.0, 1.0, 0.0);
	vec3 k = vec3 (0.0, 0.0, 1.0);
	return (1.0/3.0)*(etaisyys(paikka + i*e)*i + etaisyys(paikka + j*e)*j + etaisyys(paikka + k*e)*k)- etaisyys(paikka);
}


float maxValo(vec3 valonsuunta, vec3 normaali, float valonvoimakkuus){
	
	return max(dot(normaali, normalize(valonsuunta)*valonvoimakkuus), 0.0);
}

float Valofunktio(vec3 valonsijainti, vec3 pisteensijainti, vec3 normaali){
	vec3 valonsuunta = (valonsijainti-pisteensijainti);
	return maxValo(normaali, valonsuunta, 1.0/length(valonsijainti-pisteensijainti));
}

float OlavinPakotusFunktio(vec3 kameran_paikka, vec3 sateen_suunta){

	float matka = 0.0; 
	   
    const int maxSteps = 100;
	
	for(int i = 0; i < maxSteps; ++i)
    {
        vec3 tapahtumapaikka = kameran_paikka + sateen_suunta * matka;
        float etaisyys_pintaan = etaisyys(tapahtumapaikka); // Distance to sphere of radius 0.5	
		
		if(etaisyys_pintaan < 0.00001)
        {
			return matka;
			
        }

        matka += etaisyys_pintaan;
    }
	
	return 1000000.0;
}

void main(void)
{
	vec3 eye = vec3(0, 0, -1);
	eye.z += 5.0;
	
    vec3 up = vec3(0, 1, 0);
    vec3 right = vec3(1, 0, 0);
	
	float aspect = iResolution.x/iResolution.y;
    float u = gl_FragCoord.x * 2.0 / iResolution.x - 1.0;
    float v = gl_FragCoord.y * 2.0 / iResolution.y - 1.0;
	u = u * aspect;
	
	vec3 ray_direction =  normalize(right * u + up * v - 2.0*cross(right, up));
	
	float matka = OlavinPakotusFunktio(eye, ray_direction);
	
	vec3 tapahtuma_paikka = eye + ray_direction * matka;
	
	vec3 normaali = normalize(annaNormaali(tapahtuma_paikka));
			
	float intensity = maxValo((tapahtuma_paikka-vec3(2.,2.,-2.)),normaali,0.05);
	u*=.5;
	v*=.5;
	v+=0.5;
	vec4 overlay=vec4(0.,0.,0.,1.);
	if(u>-1. && u<-0.01 && v>-1. && v<2.)
		overlay=texture2D(iChannel5,vec2(u,v));
	gl_FragColor = vec4(0.7, intensity*10.0, 0.0, 1.0)+vec4(0.1)+overlay*0.4;
	
	
	
    
}