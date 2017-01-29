$("form").on('submit', function(e){
    e.preventDefault();
    var $this = $(this);
    var values = {};
    $.each($this.serializeArray(), function(i, field){
        values[field.name]=field.value;
    })
    
    $.ajax({
        url: '/',
        type: 'POST',
        cache: false,
        data: values,
        success: function(data) {
            console.log(data)
        },
        error: function(jqXHR, textStatus, err) {
            console.log('Text status: ' + textStatus + ', err: ' + err)
        }
    })
})