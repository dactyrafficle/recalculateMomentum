
function proj12(x1_x, x1_y, x2_x, x2_y) {
  var obj = {
    x: 0,
    y: 0
  }
  let k1 = x1_x*x2_x + x1_y*x2_y;
  let k2 = x2_x*x2_x + x2_y*x2_y;
  let k = k1/k2;
  obj.x = k*x2_x;
  obj.y = k*x2_y;
  return obj;
}

function headOnCollision(m1, v1, m2, v2) {
  let v4 = (2*m1/(m1+m2))*v1 - ((m1-m2)/(m1+m2))*v2
  let v3 = ((m1-m2)/(m1+m2))*v1 + (2*m2/(m1+m2))*v2
  return {
    'v3': v3,
    'v4': v4
  };
}

function ortho12(x1_x, x1_y, x2_x, x2_y) {
  var obj1 = proj12(x1_x, x1_y, x2_x, x2_y);
  var obj2 = {};
  obj2.x = x1_x - obj1.x;
  obj2.y = x1_y - obj1.y;
  return obj2;
}

// needs 2 objects, each eith x, y, vx, vy, r, m
function recalcMomentumAfterCollision(b1, b2) {
	
	let d = dist(b1.x, b1.y, b2.x, b2.y);
	let rho = b1.r + b2.r;
	
	if (d > rho) {
	
		// do nothing
		return;

	}	else {

		// 1. step 1: get the normal vector [done]

		let normalX = b1.x - b2.x;
		let normalY = b1.y - b2.y;
		let mag = Math.sqrt(normalX*normalX + normalY*normalY)
		
		stroke(255, 0, 0);
		strokeWeight(2);
		line(b1.x, b1.y, b2.x, b2.y);
		
		// 1b. position both circles so that they are no longer overlapping

		b1.x = b2.x + (normalX/mag)*rho;
		b1.y = b2.y + (normalY/mag)*rho;
		
		// obviously, it's totally arbitrary that I'm positioning b1 rho units away from b2, but it works
		
		
		// 2. get the projections of v1 and v2 onto the normal [done]
		
			// this is an object with x and y
			let projV1onN = proj12(b1.vx, b1.vy, normalX, normalY);
			
			// this is an object with x and y
			let projV2onN = proj12(b2.vx, b2.vy, normalX, normalY);
		
		// 3. calculate the head on collision return values: i need a better algorithm

		// in: m1, v1x, v1y, m2, v2x, v2y (basically, mass + 2 vectors in)

		// out: v3x, v3y, v4x, v4y (2 vectors out)
		
		let v3_normalX = headOnCollision(b1.m, projV1onN.x, b2.m, projV2onN.x).v3;
		let v4_normalX = headOnCollision(b1.m, projV1onN.x, b2.m, projV2onN.x).v4;
		
		let v3_normalY = headOnCollision(b1.m, projV1onN.y, b2.m, projV2onN.y).v3;
		let v4_normalY = headOnCollision(b1.m, projV1onN.y, b2.m, projV2onN.y).v4;
		

		// 4. calc. orthogonal components [done]
		
			// this is an object with x and y
			let orthoV1onN = ortho12(b1.vx, b1.vy, normalX, normalY);
			
			// this is an object with x and y
			let orthoV2onN = ortho12(b2.vx, b2.vy, normalX, normalY);
		
		// 5. combine results from step 3 and 4
		
		v3x = v3_normalX + orthoV1onN.x;
		v3y = v3_normalY + orthoV1onN.y;
		
		v4x = v4_normalX + orthoV2onN.x;
		v4y = v4_normalY + orthoV2onN.y;
		
		b1.vx = v3x;
		b1.vy = v3y;
		
		b2.vx = v4x;
		b2.vy = v4y;
		
	}
}