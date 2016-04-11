'use strict';

var core = require('flux/core');
var modeling = require('flux/modeling');

/**
 * Code block template.
 *
 */
function run(dynMesh) {
	
	function hash(item){
		return JSON.stringify(item);
	}
	
	function chop(list, chunkSize){
		var x = 0;
		var chunks = [];
		for (var i=0;i<list.length/chunkSize;i++){
			chunks.push(list.slice(x,x+chunkSize));
			x += chunkSize;
		}
		return chunks
	}
	
	var verticesHashed = [];
	var faces = [];
	var singleFace;
	
	//extract vertices
	var vertices = chop(dynMesh.VerticesAsThreeNumbers, 3);
	
	//hash vertices for indexing later
	for (var i=0;i<vertices.length;i++){
		verticesHashed.push(hash(vertices[i]));
	}
	
	//cross reference with vertex list
	var hashedFaceVertices = [];
	var vertexSet = chop(dynMesh.TrianglesAsNineNumbers, 3);
	
	for (var r=0;r<vertexSet.length;r++){
		hashedFaceVertices.push(hash(vertexSet[r]));		
	}
	
	//find index of unique vertex and store in faces
	for (var s=0;s<hashedFaceVertices.length;s++){
		for (var t=0;t<verticesHashed.length;t++){
			if (hashedFaceVertices[s]===verticesHashed[t]){
				singleFace = t;
				break;
			}
		}
		faces.push(singleFace);
	}
	faces = chop(faces,3);

	//Set values to mesh object prototype
    var mesh = modeling.entities.mesh();

    for(var u = 0; u < vertices.length; u++) {
        mesh.vertex(vertices[u]);
    }
    
    for(var v = 0; v < faces.length; v++) {
        mesh.face(faces[v][0], faces[v][1], faces[v][2]);
    }

	return{mesh:mesh}
}

module.exports = {
    run: run
};
