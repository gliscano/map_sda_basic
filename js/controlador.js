function browse_info(){
	var info = L.control();
	info.onAdd = function (m) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};
	info.update = function (data) {
		this._div.innerHTML = '<h4>Información</h4>' +  (props ?
		'<b>'+'Nombre del Consejo Comunal: ' + data.name + '</b><br />' +
		'<b>'+'Dirección: '+ data.tx_direcci + '</b>'
		: 'Seleccione un consejo Comunal');
	};
	info.addTo(m);
}

function highlightFeature(e) {
	var layer = e.target;
	layer.setStyle({
	weight: 5,
	color: '#666',
	dashArray: '',
	fillOpacity: 0.7
	});
	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
	info.update(layer.feature.properties);
}

function resetHighlight(e) {
	var geojson;	
	geojson.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
	mouseover: highlightFeature,
	mouseout: resetHighlight,
	click: zoomToFeature
	});
}
