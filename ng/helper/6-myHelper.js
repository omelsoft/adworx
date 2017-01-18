function apiModifyTable(originalData,id,response){
    angular.forEach(originalData, function (item,key) {
        if(item.id == id){
            originalData[key] = response;
        }
    });
    return originalData;
}

(function(){
	
	$('.txtedit').each(function(){
		var input = $(this).val();
		$(this).on('keyup', function(){
			$(this).val(input.replace(/,/g, ''));
		});
	});

})();