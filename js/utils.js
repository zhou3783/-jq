function objToform(obj){
	for(var attr in obj){
		if($("#"+attr).length>0){
		$("#"+attr).val(obj.attr);
		}
	}
}