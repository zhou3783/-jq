function tagAdded(data){
    var val = data.addedInput.text;
    var input = data.context[0].id + ' input';
//  ga('send', 'event', input, 'addTag', val);
}

$('#simple-tags').tagThis({
    callbacks: {
        afterAddTag : tagAdded
    }
});

$('#mac-tags').tagThis({
    callbacks: {
        afterAddTag : tagAdded
    }
});

$('#card-tags').tagThis({
    callbacks: {
        afterAddTag : tagAdded
    }
});

$('#email-tags').tagThis({
    email : true,
    noDuplicates : true,
    callbacks: {
        afterAddTag : tagAdded
    }
});

$('#user-tags').tagThis({
    interactive: false,
    noDuplicates: true,
    callbacks: {
        afterAddTag : tagAdded
    }
});

$('#fruit-tags').tagThis({
    autocompleteSource : window.fruitList,
    callbacks: {
        afterAddTag : tagAdded
    }
});

$('.add-button').on('click', function(){

    var tagData = {
        text : $(this).siblings('.name').text(),
        id : $(this).parent().data('id')
    };

    $('#user-tags').addTag(tagData);
//  ga('send', 'event', 'add tag button', 'click', 'user example' );
});

$('.see-code-button').on('click', function(){
    var pre = $(this).parent().find('pre');
    var txt =  pre.is(':visible') ? 'see code' : 'hide code';
    $(this).text(txt);
    pre.toggle();
//  ga('send', 'event', 'see/hide code button', 'click');
});

$('.simple-clear-all-button').on('click', function(){
    $('#simple-tags').clearAllTags();
//  ga('send', 'event', 'clear all button', 'click', 'simple example');
});

$('.user-clear-all-button').on('click', function(){
    $('#user-tags').clearAllTags();
//  ga('send', 'event', 'clear all button', 'click', 'user example');
});

$('.email-clear-all-button').on('click', function(){
    $('#email-tags').clearAllTags();
//  ga('send', 'event', 'clear all button', 'click', 'email example');
});

$('.fruit-clear-all-button').on('click', function(){
    $('#fruit-tags').clearAllTags();
//  ga('send', 'event', 'clear all button', 'click', 'autocomplete example');
});

$('a').on('click', function(){
    var href = $(this).attr('href');
//  ga('send', 'event', 'external link', 'click', href);
});



/*$(function(){
	
		var simpletagData=["simple","simple12","simple13"];
		for(var i=0;i<simpletagData.length;i++){
			$('#simple-tags').addTag(simpletagData[i]);
		}
		var mactagData=["mac212","mac3","macacronym24"];
		for(var i=0;i<mactagData.length;i++){
			$('#mac-tags').addTag(mactagData[i]);
		}
	    var cardtagData=["card212","card3","card"];
		for(var i=0;i<cardtagData.length;i++){
			$('#card-tags').addTag(cardtagData[i]);
		}
	})*/