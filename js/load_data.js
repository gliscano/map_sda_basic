			function load_data_dpt_estados(){
				var estados = L.geoJson(dpt_estados,{style: style_dpt});
				m.addLayer(estados);
			}
			//cargar capa de estaciones de servicios
			function load_estaciones_Servicios(){
				array_varibles_edo    = new Array();
				datos_Motores         = new Array();
				array_estado          = new Array();
				var geoJsonLayer = L.geoJson(e_s, { 
					pointToLayer: function(feature, latlng) { return L.marker(latlng, { icon: setIcon_es(feature)}); }, 
					onEachFeature: function (feature, layer) {
						layer.bindPopup(popUp_ES(feature));
						// compara el elemento con todos los existentes en el array de motor productivo
						var inArray = $.inArray(feature.properties.Estado , array_varibles_edo); 
						if(inArray == -1){
							array_varibles_edo.push(feature.properties.Estado);
							array_estado.push([feature.properties.Estado,'1']);
						}else{
							for(var i=0; i<array_estado.length; i++){
								if(array_estado[i][0]==feature.properties.Estado){
									array_estado[i][1] = parseInt(array_estado[i][1]) + 1;
									break;
								}
							}
						}
					}});
					markers_ES = L.markerClusterGroup();
					markers_ES.addLayer(geoJsonLayer);
					m.addLayer(markers_ES);
					control_filter(array_estado);  // llamada a la función para cargar las opciones de FILTRAR por estado y motor 
					for(var i=0; i<array_estado.length; i++){
						datos_Motores.push({vari: array_estado[i][0], value: array_estado[i][1]});
					}
					load_chart(datos_Motores,"Estaciones de Servicios por Estado");
			}
			//función para filtrar por estado las estaciones de Servicios
			function filter_ES_EDO(e){
				var edo = e;
				remove_data(markers_ES);
				var datos_combustible = new Array();
				var gascap_91=0;  var gascap_95=0; 	var gascap_Die=0;
				var geoJsonLayer = L.geoJson(e_s, { 
						filter: function(feature, layer) {
							if(feature.properties.Estado == edo){
								gascap_91 =  gascap_91 + parseFloat(feature.properties.CapaGasoli);
								gascap_95 =  gascap_95 + parseFloat(feature.properties.CapaGaso_1);
								gascap_Die = gascap_Die + parseFloat(feature.properties.CapaDiesel);
							}
						return feature.properties.Estado == edo;
				 	}, pointToLayer: function(feature, latlng) { 
				 		return L.marker(latlng, { icon: setIcon_es(feature)});
				 	}, onEachFeature: function (feature, layer) { 
				 		layer.bindPopup(popUp_ES(feature));
				 	}});
					markers_ES = L.markerClusterGroup();
					markers_ES.addLayer(geoJsonLayer);
					m.addLayer(markers_ES);
					m.fitBounds(geoJsonLayer.getBounds(),[50, 50]);
					var capacidad_instalada = [{vari:"Capacidad en Tanques Gasolina 95", value: gascap_95},{vari:"Capacidad en Tanques Gasolina 91", value: gascap_91},{vari:"Capacidad Tanques Diesel", value: gascap_Die}];
					// Llamada función para cargar graficas
					load_chart(capacidad_instalada,"Capacidad Instalada en Tanques de Combustible (Lts)");
			}
			function remove_data(f){	
				m.removeLayer(f);
			}
/***************************** PopUp **********************/			
			function popUp_ES(f){
				var popUp = '<table class="table table-striped"><tr><td><B>Estación de Servicio: </B>'+String(f.properties.Nombre_Cli)+'</td><td><B>Bandera: </B>'+String(f.properties.Bandera)+'</td></tr><tr><td><B>Capacidad (Lts.) para Gasolina 95: </B> '+String(f.properties.CapaGasoli)+'</td><td><B>Capacidad (Lts.) para Gasolina 91: </B> '+String(f.properties.CapaGaso_1)+'</td></tr><tr><td><B>Capacidad (Lts.) para Diesel: </B>'+String(f.properties.CapaDiesel)+'</td><td><B>Número de Islas Gasolina: </B> '+String(f.properties.NRO_ISLAS_G)+'</td></tr><tr><td><B>Número de Islas Diesel: </B>'+String(f.properties.NRO_ISLAS_D)+'</td><td><B>Pico Industrial: </B> '+String(f.properties.PICO_INDUS)+'</td></tr><tr><td><B>Estado: </B>'+String(f.properties.Estado)+'</td><td><B>Municipio: </B>'+String(f.properties.Municipio)+'</td></tr><tr><td colspan="2" style="text-align:center"><B>Fotografía: </B></td></tr><tr><td><img src="img/photo.png" alt="Photo" height="53" width="64"/></td><td><img src="img/photo.png" alt="Photo" height="53" width="64"/></td></tr></table>';
				return popUp;
			}
			function setIcon_es(f){
                var smallIcon = L.icon({
                	iconSize: [21, 32],
                    iconAnchor: [0, 32],
                    popupAnchor:  [1, -24],
                    iconRetinaUrl: 'img/marker/point_es.png',
                    iconUrl: 'img/marker/point_es.png'
   					});
				return smallIcon;
			}
/***************************** Estilos **********************/
			function style_dpt(feature) {
					style= {"weight": 1, "color": '#000000', "dashArray": '2', "opacity": 1, "fillOpacity": 0};
				return style;				
			}
/***************************** Graficos **********************/			
		function load_chart(data,title){
			document.getElementById("chartpie").innerHTML="";
			var dataChart = data;
			if(dataChart!=""){
			    chart = new AmCharts.AmPieChart();
			    chart.pieX="50%";
			    chart.pieY="50%";
			    //chart.legend = {"markerSize": 9,"fontSize":9,"markerType": "circle"};
			    //chart.legend = { "position": "right","markerType": "circle"};
			    chart.dataProvider = dataChart;
			    chart.titleField = "vari";
			    chart.valueField = "value";
			    chart.sequencedAnimation = true;
			    chart.startEffect = "elastic";
			    chart.labelsEnabled = true;
				chart.labelText = "- [[vari]]: [[value]]";
				chart.fontSize=10;
			    chart.startDuration = 2;
			    //chart.labelRadius = 60;
			    //chart.maxLabelWidth = 100;
			    chart.depth3D = 5;
			    chart.angle = 30;
			    // WRITE
			    chart.write("chartpie");
			    setTimeout(function(){ chart.titles = {"text":title, "size": 14};}, 800);

			}
		}