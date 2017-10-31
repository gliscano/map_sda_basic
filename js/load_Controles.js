$(document).ready(function() {

    $("#title_chart").click(function(){   
        if($("#icon_btn_charts").attr('class') == "icon-arrow-right"){
            size_map_min();
        }else{
            size_map_max();
        }
    });

    $("#estaciones").change(function(){
        if($(this).is(":checked")){
            load_estaciones_Servicios();
            size_map_min();
        }else{
            m.removeLayer(markers_ES);
            filter_close();
            $("#chartpie").html("");
            size_map_max();
        }
    });
    $("#filter").on('change',function(){
        if($("#options").val() != "Estado: TODOS")
            filter_ES_EDO($("#options").val());
        else{
            remove_data(markers_ES);
            filter_close();
            load_estaciones_Servicios();
        }
    });
});    
function size_map_min(){    
    if($("#icon_btn_charts").attr('class') != "icon-arrow-left"){
        $("#map_Layer").css({"left":"50%", "width":"50%", "transition":"left 0.5s, width 0.5s"});
        $("#chartpie").css({"opacity":"1"});
        $("#icon_btn_charts").attr('class', "icon-arrow-left");
        setTimeout(function(){ m.invalidateSize()}, 800);
    }    
}
function size_map_max(){
    if($("#icon_btn_charts").attr('class') != "icon-arrow-right"){
        $("#map_Layer").css({"left":"0%", "width":"100%", "transition":"left 0.5s, width 0.5s"});
        $("#chartpie").css({"opacity":"0"});
        $("#icon_btn_charts").attr('class', "icon-arrow-right");
        setTimeout(function(){ m.invalidateSize()}, 800);
    }  
}            
function view_home(){
    m.setView([6, -66],6);
}
function control_filter(array_estado){
    $("#filter").css({"opacity":"1"});
    $("#filter").append($('<select></select>').attr("id","options"));
    //$("#div_Filter").append($('<select></select>').attr("id","filter_edo"));
    //$("#div_Filter").css({"color":"#000000"});
    //$("#filter_edo").append($('<option></option>').text("Estado: TODOS"));
    $("#options").attr("class","form-control");
    $("#options").css({"width":"auto","top":"0px"});
    $("#options").append($('<option></option>').text("Estado: TODOS"));
        for(var i=0; i<array_estado.length; i++){
            $('#options').append($('<option></option>').text(array_estado[i][0]));
        }
}
function filter_close(){
    $("#filter").css({"opacity":"0", "width": "0%"});
    $('#filter').html("");

}
