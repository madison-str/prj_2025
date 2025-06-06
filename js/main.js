$(document).ready(function () {
		
	var imgItems = $('.slider li').length; 
	var imgPos = 1;	

	$('.slider li').hide();
	$('.slider li:first').show();	
	$('.pagination li:first').css({ 'color': '#0048FF' }); 
	$('.pagination li').click(pagination);


	myTimer = setInterval(nextSlider, 2000);

	// FUNCIONES =========================================================

	function pagination() {


		clearInterval(myTimer);

		myTimer = setInterval(nextSlider, 2000);

		var paginationPos = $(this).index() + 1; 

		$('.slider li').hide(); 		
		$('.slider li:nth-child(' + paginationPos + ')').show();		
		$('.pagination li').css({ 'color': '#FFFFFF' });
		$(this).css({ 'color': '#0048FF' });

		imgPos = paginationPos;

	}

	function nextSlider() {


		clearInterval(myTimer);
		myTimer = setInterval(nextSlider, 2000);

		if (imgPos >= imgItems) { imgPos = 1; }
		else { imgPos++; }


		$('.pagination li').css({ 'color': '#FFFFFF' });
		$('.pagination li:nth-child(' + imgPos + ')').css({ 'color': '#0048FF' });

		$('.slider li').hide(); 	
		$('.slider li:nth-child(' + imgPos + ')').show();
		$('.pagination li').css({ 'z-index': 100 });
		

	}
	

});