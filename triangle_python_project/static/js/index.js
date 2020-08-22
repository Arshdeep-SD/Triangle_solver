var canvas,
    context,
    dragging = false,
    dragStartLocation,
    snapshot;

var points1 = [{x:625,y:50},{x:535,y:195},{x:700,y:200}];
var points2 = [{x:526,y:251},{x:700,y:251},{x:600,y:410}];

var tri_no,point_no;
var resp_data;

function json_call()
{
var obj = { points1: points1, points2: points2 };
var myJSON = JSON.stringify(obj);
resp_data = [];
angles = [];

 $.ajax({
			data : myJSON,
			type : 'POST',
			dataType: 'json',
			contentType: "application/json",
			url : '/process'
		})
		.done(function(data) {

			if (data.error) {
				console.log("Error");
				console.log(data);
			}
			else {
				console.log("Success");
				
				resp_data = JSON.parse(data.result);
				angles = JSON.parse(data.intersection_angles);
				drawIntersectionInfo();
			}

		});
		
}


function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function takeSnapshot() {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
    context.putImageData(snapshot, 0, 0);
}



function dragStart(event) {
    dragStartLocation = getCanvasCoordinates(event);
	console.log(dragStartLocation);
	
	
	for(var i=0;i<points1.length;i++)
	{
	if( (dragStartLocation.x >= points1[i].x - 5 && dragStartLocation.x <= points1[i].x + 5 )
	&& 	(dragStartLocation.y >= points1[i].y - 5 && dragStartLocation.y <= points1[i].y + 5 ))
		{
			console.log(points1[i].x+","+points1[i].y);
			console.log(i);
			tri_no = 1;
			point_no = i;
			dragging = true;
			break;
		}
	}
	
	for(var i=0;i<points2.length;i++)
	{
	if( (dragStartLocation.x >= points2[i].x - 5 && dragStartLocation.x <= points2[i].x + 5 )
	&& 	(dragStartLocation.y >= points2[i].y - 5 && dragStartLocation.y <= points2[i].y + 5 ))
		{
			console.log(points2[i].x+","+points2[i].y);
			console.log(i);
			tri_no = 2;
			point_no = i;
			dragging = true;
			break;
		}
	}
	
	
    takeSnapshot();
}

function drag(event) {
    var position;
    if (dragging == true) {
        restoreSnapshot();
        position = getCanvasCoordinates(event);
		
		if(tri_no == 1)
		{
			points1[point_no].x = position.x;
			points1[point_no].y = position.y;
		}
		else
		if(tri_no == 2)
		{
			points2[point_no].x = position.x;
			points2[point_no].y = position.y;
		}
		
		drawTriangle();
		
        //draw(position, "polygon");
    }
}

function dragStop(event) {
    dragging = false;
	json_call();
    //restoreSnapshot();
    //var position = getCanvasCoordinates(event);
    //draw(position, "polygon");
}


function eraseCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}



function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    
	drawTriangle();
	
    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
    //clearCanvas.addEventListener("click", eraseCanvas, false);

}

function drawTriangle()
{
	eraseCanvas();
	context.beginPath(); // note usage below 

  
    context.beginPath();
    context.strokeStyle = "#00F";
    //context.moveTo(600, 0); // pick up "pen," reposition at 500 (horiz), 0 (vert)
    //context.lineTo(500, 200); // draw straight down by 200px (200 + 200)
    //context.lineTo(700, 200); // draw up toward left (100 less than 300, so left)
    
	context.moveTo(points1[0].x, points1[0].y);
	context.lineTo(points1[1].x, points1[1].y);
	context.lineTo(points1[2].x, points1[2].y);
	
	context.closePath(); // connect end to start
    context.stroke(); // outline the shape that's been described

    context.beginPath();
    context.strokeStyle = "#096";
	
	context.font = "25px Comic Sans MS";
	context.fillStyle = "blue";
	for (var i = 0; i < 3; i++) 
	{
		context.fillText("A"+(i+1),points1[i].x,points1[i].y); 
	}
	
	context.font = "25px Comic Sans MS";
	context.fillStyle = "green";
	for (var i = 0; i < 3; i++) 
	{
		context.fillText("B"+(i+1),points2[i].x,points2[i].y); 
	}
	
    //context.moveTo(500, 210); // pick up "pen," reposition 
    //context.lineTo(700, 210); // draw straight across to right
    //context.lineTo(600, 410); // draw down toward left
    
	context.moveTo(points2[0].x, points2[0].y);
	context.lineTo(points2[1].x, points2[1].y);
	context.lineTo(points2[2].x, points2[2].y);
	
	context.closePath(); // connect end to start
    context.stroke(); // outline the shape that's been described
	
	drawBoard();
}


function drawBoard()
{
	var pos_x = 10,pos_y = 10;	
	context.font = "12px Comic Sans MS";
	context.fillStyle = "blue";
	context.fillText("Blue Triangle", pos_x, pos_y); 
	context.font = "12px Comic Sans MS";
	context.fillStyle = "black";
	
	for (var i = 0; i < 3; i++) 
	{
		pos_y += 15;
		context.fillText("A"+(i+1),pos_x, pos_y);
		context.fillText("("+points1[i].x+","+points1[i].y+")", pos_x + 20, pos_y); 
	}
	
	pos_x = 100;
	pos_y = 10;	
	
	context.font = "12px Comic Sans MS";
	context.fillStyle = "green";
	context.fillText("Green Triangle", pos_x, pos_y); 
	context.font = "12px Comic Sans MS";
	context.fillStyle = "black";
	
	for (var i = 0; i < 3; i++) 
	{
		pos_y += 15;
		context.fillText("B"+(i+1),pos_x, pos_y);
		context.fillText("("+points2[i].x+","+points2[i].y+")", pos_x + 20, pos_y); 
	}
}

function drawIntersectionInfo()
{
	var pos_x = 10,pos_y = 100;	
	context.font = "12px Comic Sans MS";
	context.fillStyle = "red";
	context.fillText("Intersection Points", pos_x, pos_y); 
	context.font = "12px Comic Sans MS";
	context.fillStyle = "black";
	
	for (var i = 0; i < resp_data.length; i++) 
	{
		pos_y += 15;
		context.fillText("I"+(i+1),pos_x, pos_y);
		context.fillText("("+resp_data[i][0].toFixed(2)+","+resp_data[i][1].toFixed(2)+")", pos_x + 20, pos_y); 
	}
	
	context.font = "25px Comic Sans MS";
	context.fillStyle = "red";
	for (var i = 0; i < resp_data.length; i++) 
	{
		context.fillText("I"+(i+1),resp_data[i][0].toFixed(2),resp_data[i][1].toFixed(2)); 
	}
	
	
	//angles
	// pos_x = 150,pos_y = 100;	
	// context.font = "12px Comic Sans MS";
	// context.fillStyle = "red";
	// context.fillText("Intersecting Angles", pos_x, pos_y); 
	// context.font = "12px Comic Sans MS";
	// context.fillStyle = "black";
	// for (var i = 0; i < 3; i++) 
	// {
		// pos_y += 15;
		// context.fillText("∟I"+(i+1)+" = "+angles[i].toFixed(2),pos_x, pos_y);
	// }
	
	
}

window.addEventListener('load', init, false);