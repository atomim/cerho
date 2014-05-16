uniform float beat;

float efsel = smoothstep(205., 210., beat);

// demokerho 30.3. shader testing
// thanks to iq for coordinate intersection code
#if 0
//
// Elegant way to intersect a planar coordinate system (3x3 linear system)
//
vec3 intersectCoordSys( in vec3 o, in vec3 d, vec3 c, vec3 u, vec3 v )
{
    vec3 q = o - c;
    return vec3(
        dot( cross(u,v), q ),
        dot( cross(q,u), d ),
        dot( cross(v,q), d ) ) / 
        dot( cross(v,u), d );
}

#else
//
// Ugly (but faster) way to intersect a planar coordinate system: plane + projection
//
vec3 intersectCoordSys( in vec3 o, in vec3 d, vec3 c, vec3 u, vec3 v )
{
    vec3  q = o - c;
    vec3  n = cross(u,v);
    float t = -dot(n,q)/dot(d,n);
    float r =  dot(u,q + d*t);
    float s =  dot(v,q + d*t);
    return vec3(t,s,r);
}

#endif  

//================================================================================================

vec3 hash( in float x )
{
    return fract(sin(x+vec3(0.0,1.0,2.0))*vec3(43758.5453123,12578.1459123,19642.3490423));
}



float spulse(float val, float s1, float s2, float e1, float e2) {
    return smoothstep(s1, s2, val)*(1.-smoothstep(e1, e2, val));
}

vec3 shade( in vec3 pos, in vec4 res, in vec3 hash )
{
    vec3 col = vec3(1., res.z, 0.1);
    vec2 coords = res.yz;
    //return vec3(clamp(vec2(0.), vec2(1.), coords/4.), 0.);
    coords.y -= hash.z*3. - cos(iGlobalTime*hash.x*4.)+ sin(res.y+hash.x*4.+iGlobalTime)+sin(iGlobalTime*0.3)*sin(res.x);
    coords.y += coords.x*coords.x*(1.-efsel);
    //coords.y += mod(coords.y, 40.0)*efsel;
    // Moving "blob"
    float bb = spulse(mod(beat, 8.), 0., 4., 4.0, 8.0);
    //return vec3(bb);
    float b = spulse(abs(abs(coords.x)-bb*100.), 0., 2., 3., 5.);
    float collen = clamp(0., 1., coords.y);
    //col = mix(vec3(1., 0.4, 1.), vec3(0., 1., 0.4), coords.y.z-hash.z);
    col = texture2D(iChannel7, vec2(coords.x, coords.y-hash.z)*0.4).xyz;
    col = mix(vec3(1., 0.5, 0.), vec3(0., 0., 1.), col);
    //col += mix(vec3(1.), col, smoothstep(0., 1., blobAm));//1.-vec3(smoothstep(0., 6.5, blobAm));
    col *= 1.-smoothstep(.4, 2.9, abs(coords.y));
    col += 0.1*vec3(0., 0.5, 1.)*b;//*(smoothstep(1.0, 3.2, coords.y)*(1.-smoothstep(3.2, 3.9, coords.y)));
    
    return col*0.2;
}


vec3 rotateZ(vec3 v, float a)
{ 
   float co = cos(a);
   float si = sin(a);
   return vec3(co*v.x + si*v.y, -si*v.x + co*v.y, v.z); 
}

void main(void)
{
    // Coordinate transformation + aspect ratio fix
    vec2 q = gl_FragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0 * q;
    p.x *= iResolution.x/iResolution.y;

    float fade=max(iGlobalTime-222.,0.)*12.+1.;
    float liukkari=(iGlobalTime+0.05)*0.5;
    float kameraPompottelu=(hash(floor(liukkari)).x);
    // ray origin etc.
    vec3 ro = vec3(10., 10., 0.);
    ro = vec3(-10.*cos(iGlobalTime*3.141*0.25*kameraPompottelu)*floor(fade), 5.*sin(iGlobalTime*3.141*0.25)*floor(fade), -5.);
    
    vec3 ta = vec3(0.,0.,0.);
    //ta.z += iGlobalTime;
	//
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));
    vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

    vec3 col = vec3(0.1, 0.04, 0.) + 0.1*rd.y;

    for( int i=0; i<70; i++ )
    {
        vec4 res = vec4(1e20, 0.0, 0.0, 0.0 );
        
        // position
        vec3 r = vec3(0., 0., 0.);
        vec3 h = hash(float(i)*13.1);
        //r=h*5.;
        // orientation
        // spinning center orientation
        vec3 u = vec3(-1.+2.*h.x, -.3+.15*h.x, -1.+2.*h.y);
        float k = float(i);
        vec3 u2 = rotateZ(vec3(1., 0., 0.), k*1./80.*6.);
        u = mix(u, u2, efsel);
        //u.x += 3.*sin(iGlobalTime*0.3);
        u = normalize(u);
        vec3 v = normalize( cross( u, vec3(0.0,1.0,0.0 ) ) );                          
        //u = vec3(1., 0., 0.);
        //v = vec3(0., 1., 0.);
        vec4 tmp = vec4(vec3(intersectCoordSys( ro, rd, r, u, v )), float(i));
        vec3 pos = ro+rd*tmp.x;
        pos.x += sin(pos.z*0.1)*10.;
        if (tmp.x > 0.)
			col += shade(pos, tmp, h);//vec3(smoothstep(0., 0.5, tmp.z)*(1.-smoothstep(0.5, 1., tmp.z)));
        //col += vec3(step(0.1, tmp.y)*(1.-step(0.2, tmp.y)));
    }
    float tmod = mod(beat, 4.);
    col *=0.8+spulse(tmod, 0., 0.2, .5, .7)*1.8;

    gl_FragColor = vec4( col, 1.0 );
}
