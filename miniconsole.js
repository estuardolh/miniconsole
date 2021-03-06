var canvas = document.getElementById('screen');
var context = canvas.getContext('2d');
canvas.addEventListener("touchstart", doTouchStart, false);
canvas.addEventListener("touchend", doTouchEnd, false);
canvas.addEventListener("mousedown", doClickStart, false);
canvas.addEventListener("mouseup", doClickEnd, false);

var miniconsole = {};
miniconsole.paused = false;
miniconsole.interval = null;
miniconsole.act = null;
miniconsole.ini = true;

miniconsole.matrix = [];
miniconsole.cell_w = 10;
miniconsole.cell_h = 10;
miniconsole.debug = false;

miniconsole.video = {};
miniconsole.input = {};
miniconsole.util = {};

miniconsole.video.w = 10;
miniconsole.video.h = 10;
miniconsole.video.cell_w = 10;
miniconsole.video.cell_h = 10;
miniconsole.video.PIXEL_COLD = 0;
miniconsole.video.PIXEL_WARM = 1;
miniconsole.video.PIXEL_HOT = 2;

miniconsole.input.actual_key_down = -1;
miniconsole.input.KEY_ENTER = 13;
miniconsole.input.KEY_LEFT = 37;
miniconsole.input.KEY_RIGHT = 39;
miniconsole.input.KEY_UP = 38;
miniconsole.input.KEY_DOWN = 40;
miniconsole.input.touch_x = -1;
miniconsole.input.touch_y = -1;
miniconsole.input.click_x = -1;
miniconsole.input.click_y = -1;

function doTouchStart( event ){
	event.preventDefault();
	miniconsole.input.touch_x = event.targetTouches[0].pageX;
	miniconsole.input.touch_y = event.targetTouches[0].pageY;
}
function doTouchEnd( event ){
	event.preventDefault();
	miniconsole.input.touch_x = -1;
	miniconsole.input.touch_y = -1;
}
function doClickStart( event ){
	miniconsole.input.click_x = event.clientX;
	miniconsole.input.click_y = event.clientY;
}
function doClickEnd( event ){
	miniconsole.input.click_x = -1;
	miniconsole.input.click_y = -1;
}

document.onkeydown =  function( event ){
	event = event || window.event;
	
	miniconsole.input.actual_key_down = event.keyCode;
};
document.onkeyup = function( event ){
	event = event || window.event;
	if( miniconsole.input.actual_key_down == event.keyCode ) miniconsole.input.actual_key_down = -1;
};

document.getElementsByTagName("body")[0].onresize = function(){
	miniconsole.onresize();
};

miniconsole.onresize = function(){};

miniconsole.draw = function(){
	canvas.width += 1;
	canvas.width += -1;
	
	if( miniconsole.act == null ){
		return;
	}

	if( !miniconsole.paused ){
		// background, white cells
		miniconsole.matrix.forEach( function( column ){
			column.forEach( function( cell ){					
					var percent = 8;
					var cell_w_percent = miniconsole.video.cell_w * percent/100;
					var cell_h_percent = miniconsole.video.cell_h * percent/100;
					
					context.beginPath();
					context.rect( cell.x * miniconsole.video.cell_w + cell_w_percent 
						, cell.y * miniconsole.video.cell_h + cell_h_percent
						, miniconsole.video.cell_w - 2 * cell_w_percent
						, miniconsole.video.cell_h - 2 * cell_h_percent );
					context.lineWidth = 1;
					context.fillStyle = (cell.value == 0)?'#F8F8F8':(cell.value == 1)? '#AAAAAA': '#333333';
					context.fill();
					context.strokeStyle = '#D8D8D8';
					context.stroke();
				}
			);
		});
		miniconsole.clear();
		
		miniconsole.act.draw();
	}
};

miniconsole.update = function(){
	if( miniconsole.act == null ){
		return;
	}
	
	if( miniconsole.ini ){
		// ini background
		miniconsole.clear();
		
		miniconsole.ini = false;
	}
	if( !miniconsole.paused ) miniconsole.act.update();
};

miniconsole.clear = function(){
	var column;
	for( var i = 0; i < miniconsole.video.w; i++ ){
		column = [];
		for( var j = 0; j < miniconsole.video.h; j++ ){
			column[ j ] = { x: i, y: j, value: 0 };
		}
		miniconsole.matrix[ i ] = column;
	}
};

miniconsole.fps = 1;
miniconsole.main_loop = function(){
	miniconsole.update();
	miniconsole.draw();
};
miniconsole.interval = setInterval( miniconsole.main_loop , miniconsole.fps );

miniconsole.setFPS = function( fps ){
	miniconsole.fps = ( fps <= 0 )? 1 : fps;
	
	clearInterval( miniconsole.interval );
	miniconsole.interval = setInterval( miniconsole.main_loop, 1000 / miniconsole.fps );
}

miniconsole.show = function( act ){
	miniconsole.act = act;
	miniconsole.paused = false;
};

miniconsole.video.get = function( x, y ){
	if( x >= miniconsole.video.w ){
		if( miniconsole.debug ) console.log("WARNING: x="+x+" outs of matrix width");
		
		return -1;
	}
	if( y >= miniconsole.video.h ){
		if( miniconsole.debug ) console.log("WARNING: y="+y+" outs of matrix height");
		
		return -1;
	}
	
	return (miniconsole.matrix[ x ])[ y ].value;
}

miniconsole.video.set = function( x, y, arg ){
	if( typeof it === 'number' ){
		miniconsole.video.plot(x, y, arg);
	}else /*should be 'object' but, whatever*/ {
		miniconsole.video.draw_struct(x, y, arg);
	}
};

miniconsole.video.plot = function( x, y, intensity ){
	var column = [];
	
	if( x < miniconsole.video.w ){
		column = miniconsole.matrix[ x ];
		
		if( y < miniconsole.video.h
			&& column != null 
			&& typeof column !== 'undefined' ){
			column[ y ] = {"x": x, "y": y, "value": intensity};
		}else{
			if( miniconsole.debug ) console.log( "WARNING: position y="+x+" outs of matrix height="+miniconsole.video.h );
		}
	}else{
		if( miniconsole.debug ) console.log( "WARNING: position x="+x+" outs of matrix width="+miniconsole.video.w );
	}
};

miniconsole.video.draw_struct = function( x, y, it ){
	var width = ( typeof it[0].length === 'undefined' ) ? 0 /* 1D array */ : it[0].length /* 2D array */ ;
	var height = ( typeof it.length === 'undefined' ) ? 0 : it.length;
	
	var column = [];
	var key;
	var i = 0
	, j =0;
	
	if( width != 0 ){
		/*
			[[], [], ... , []]
		*/
		for( ; j < height ; j++ ){
			column = it[j];
			
			for( i = 0 ; i < width ; i ++ ){
				key = column[i];
				if( key != null ) miniconsole.video.plot( x+i, y+j, key );
			}
		}
	}else{
		/*
			[0, 1, ... , 2]
		*/
		for( ; j < height ; j++ ){
			key = it[j];
			
			if( key != null ) miniconsole.video.plot( x+j, y, key );
		}
	}
};

miniconsole.input.iskeydown = function( key ){
	return ( miniconsole.input.actual_key_down == key );
};
miniconsole.input.touch = function( x, y, w, h ){
	return ( miniconsole.input.touch_x >= x * miniconsole.video.cell_w && miniconsole.input.touch_x <= ( x+w )*miniconsole.video.cell_w ) && ( miniconsole.input.touch_y >= y*miniconsole.video.cell_h && miniconsole.input.touch_y <= ( y+h )*miniconsole.video.cell_h );
};
miniconsole.input.click = function( x, y, w, h ){
	return ( miniconsole.input.click_x >= x * miniconsole.video.cell_w && miniconsole.input.click_x <= ( x+w )*miniconsole.video.cell_w ) && ( miniconsole.input.click_y >= y*miniconsole.video.cell_h && miniconsole.input.click_y <= ( y+h )*miniconsole.video.cell_h );
};
miniconsole.input.click_touch = function( x, y, w, h ){
	return miniconsole.input.click( x, y, w, h ) || miniconsole.input.touch( x, y, w, h );
};

miniconsole.array = {};

// clockwise
miniconsole.array.rotate = function( array_2d, opt_sense ){
	var array_temp = []
	, array_2d_width = array_2d[0].length;
	opt_sense = ( typeof opt_sense === 'undefined' ? 1 /* clockwise */ : opt_sense /* counterclockwise */ )
	
	// copy array_2d to temp_array
	array_temp = miniconsole.array.clone( array_2d );
	
	if( opt_sense == 1 ){
		// clockwise: read columns from right to left and set it as rows
		var ii = 0;
		for( var i = ( array_2d.length - 1 ); i > -1 ; i-- ){
			var column = miniconsole.array.getColumn( i, array_2d );
			
			array_temp = miniconsole.array.setRow( ii /*arg j*/, array_temp, column );
			ii++;
		}
	}else{
		// counterclockwise: read in reverse columns and set it as rows
		for( var i = 0; i < array_2d.length ; i++ ){
			var column = miniconsole.array.getColumn( i, array_2d ).reverse();
			
			array_temp = miniconsole.array.setRow( i /*arg j*/, array_temp, column );
		}
	}
	
	return array_temp;
};
miniconsole.array.setRow = function( j, array_2d, array_1d ){
	
	var array_2d_clone = miniconsole.array.clone( array_2d );
	
	// for each column
	for( var i = 0; i < array_2d_clone.length ; i++ ){
		var column = array_2d_clone[ i ];
		
		// if there is array_1d items to fill
		if( i < array_1d.length ){
			column[ j ] = array_1d[ i ]; // asignate j'th 
		}else{
			console.log('break[!]');
		}
	}
	
	return array_2d_clone;
};
miniconsole.array.setColumn = function( i, array_2d, array_1d ){
	var column = array_2d[ i ];
	column[ i ] = array_1d;
	
	return array_2d;
};
miniconsole.array.getRow = function( j, array_2d ){
	var array_1d = [];
	
	for( var i = 0; i < array_2d.length; i++ ){
		var column = array_2d[ i ];
		array_1d[ i ] = column[ j ];
	}
	
	return array_1d;
};
miniconsole.array.getColumn = function( i, array_2d ){
	var array_2d_clone = miniconsole.array.clone( array_2d );
	return array_2d_clone[ i ];
};
miniconsole.array.clone = function( array_2d ){
	var array_temp = [];
	var array_2d_width = array_2d[0].length;
	
	
	for( var i = 0 ; i < array_2d.length ; i++ ){
		var src_column = array_2d[ i ];
		
		var dst_column = [];
		for( var j = 0 ; j < array_2d_width ; j++ ){
			dst_column[ j ] = src_column[ j ];
		}
		
		array_temp[ i ] = dst_column;
	}
	
	return array_temp;
};
miniconsole.array._toString = function( array_2d ){
	var array_2d_width = array_2d[0].length;
	var str_row = "";
	
	for( var j = 0 ; j < array_2d_width ; j++ ){
		
		for( var i = 0 ; i < array_2d.length ; i++ ){
			var column = array_2d[ i ];
			str_row = str_row + ", " + column[ j ];
		}
		
		
		console.log(( j == 0 ? "{ " : "  " )+"["+str_row+"]"+( j == (array_2d_width - 1) ? " }" : "  " ));
		str_row = "";
	}
	
};