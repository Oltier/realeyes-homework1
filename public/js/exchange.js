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
            $('#result').html(values['value'] + " " + values['fromCurrency'] + " = " + Math.round((parseFloat(data) + 0.0000001) * 10000) / 10000 + " " +values['toCurrency']);
        },
        error: function(jqXHR, textStatus, error) {
            $('#result').html(jqXHR.responseText);
        }
    })
})

$("#swap").click(function(e){
    var fromCurrency = $('#fromCurrency option:selected').val();
    var toCurrency = $('#toCurrency option:selected').val();
    
    $('#toCurrency option[value='+fromCurrency+']').prop('selected', true);
    $('#fromCurrency option[value='+toCurrency+']').prop('selected', true);
});