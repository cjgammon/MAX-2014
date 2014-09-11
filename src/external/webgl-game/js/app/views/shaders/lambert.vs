
varying vec3 vLightWeighting;

#ifdef USE_ENVMAP
    varying vec3 vReflect;
    uniform float refractionRatio;
    uniform bool useRefract;
#endif

#ifdef USE_LIGHTMAP
    varying vec2 vUv2;
#endif

#ifdef USE_ENVMAP
    varying vec3 vReflect;
    uniform float refractionRatio;
    uniform bool useRefract;
#endif

uniform vec3 ambient;
uniform vec3 diffuse;
uniform vec3 ambientLightColor;

#if MAX_DIR_LIGHTS > 0
    uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];
    uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];
#endif

#if MAX_POINT_LIGHTS > 0
    uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];
    uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];
    uniform float pointLightDistance[ MAX_POINT_LIGHTS ];
#endif

#ifdef USE_COLOR
	varying vec3 vColor;
#endif

#ifdef USE_SKINNING
	uniform mat4 boneGlobalMatrices[ MAX_BONES ];
#endif

#ifdef USE_MORPHTARGETS
	uniform float morphTargetInfluences[ 8 ];
#endif

#ifdef USE_SHADOWMAP
	varying vec4 vShadowCoord[ MAX_SHADOWS ];
	uniform mat4 shadowMatrix[ MAX_SHADOWS ];
#endif


void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    #ifdef USE_MAP
        vUv = uv * offsetRepeat.zw + offsetRepeat.xy;
    #endif

	#ifdef USE_LIGHTMAP
		vUv2 = uv2;
	#endif

	#ifdef USE_ENVMAP
        vec4 mPosition = objectMatrix * vec4( position, 1.0 );
        vec3 nWorld = mat3( objectMatrix[ 0 ].xyz, objectMatrix[ 1 ].xyz, objectMatrix[ 2 ].xyz ) * normal;
        if ( useRefract ) {
            vReflect = refract( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ), refractionRatio );
        } else {
            vReflect = reflect( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ) );
        }
    #endif

	#ifdef USE_COLOR
		#ifdef GAMMA_INPUT
            vColor = color * color;
        #else
            vColor = color;
        #endif
    #endif


    vec3 transformedNormal = normalize( normalMatrix * normal );
    //THREE.ShaderChunk[ "lights_lambert_vertex" ],
    vLightWeighting = vec3( 0.0 );
    #if MAX_DIR_LIGHTS > 0

    for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {
        vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );
        float directionalLightWeighting = max( dot( transformedNormal, normalize( lDirection.xyz ) ), 0.0 );
        vLightWeighting += directionalLightColor[ i ] * directionalLightWeighting;
    }

    #endif

    #if MAX_POINT_LIGHTS > 0
        for( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {
            vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );
            vec3 lVector = lPosition.xyz - mvPosition.xyz;
            float lDistance = 1.0;
            if ( pointLightDistance[ i ] > 0.0 )
                lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );
            lVector = normalize( lVector );
            float pointLightWeighting = max( dot( transformedNormal, lVector ), 0.0 );
            vLightWeighting += pointLightColor[ i ] * pointLightWeighting * lDistance;
        }
    #endif
    
    vLightWeighting = vLightWeighting * diffuse + ambient * ambientLightColor;

    #ifdef USE_SKINNING
        gl_Position  = ( boneGlobalMatrices[ int( skinIndex.x ) ] * skinVertexA ) * skinWeight.x;
        gl_Position += ( boneGlobalMatrices[ int( skinIndex.y ) ] * skinVertexB ) * skinWeight.y;
        // this doesn't work, no idea why
        //gl_Position  = projectionMatrix * cameraInverseMatrix * objectMatrix * gl_Position;
        gl_Position  = projectionMatrix * viewMatrix * objectMatrix * gl_Position;
    #endif


	#ifdef USE_MORPHTARGETS
        vec3 morphed = vec3( 0.0, 0.0, 0.0 );
        morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];
        morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];
        morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];
        morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];
        morphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];
        morphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];
        morphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];
        morphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];
        morphed += position;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );
    #endif


	#ifndef USE_MORPHTARGETS
		#ifndef USE_SKINNING
			gl_Position = projectionMatrix * mvPosition;
		#endif
	#endif

	#ifdef USE_SHADOWMAP
        for( int i = 0; i < MAX_SHADOWS; i ++ ) {
            vShadowCoord[ i ] = shadowMatrix[ i ] * objectMatrix * vec4( position, 1.0 );
        }

    #endif

}

