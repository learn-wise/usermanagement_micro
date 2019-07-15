var gdpData = {
    "AF": 10,
    "DZ": 1000,
    "IR": 5000000
};

var markers = [{
        latLng: [38.0962, 46.2738],
        name: 'Tabriz'
    },
    {
        latLng: [35.6892, 51.3890],
        name: 'Tehran'
    },
    {
        latLng: [8.7832, 34.5085],
        name: 'Africa'
    }
]

var onRegionTipShow = (e, el, code) => {
    el.html(el.html() + ' (GDP - ' + gdpData[code] + ')');
}
var onMarkerTipShow = (e, el, code) => {
    el.html(el.html() + '(25k)');
}
var onRegionSelected = () => {
    console.log('onRegionSelected', map.getSelectedRegions())
}

var onMarkerSelected = () => {
    console.log('onMarkerSelected', map.getSelectedMarkers())
}
var map = new jvm.Map({
    container: $('#vmap'),
    map: 'world_mill',
    regionsSelectable: true,
    markersSelectable: true,
    series: {
        regions: [{
            values: gdpData,
            scale: ['#C8EEFF', '#0071A4'],
            normalizeFunction: 'polynomial'
        }]
    },
    onRegionTipShow,
    onMarkerTipShow,
    markers,
    onRegionSelected,
    onMarkerSelected,
    scaleColors: ['#C8EEFF', '#0071A4'],
    normalizeFunction: 'polynomial',
    hoverOpacity: 0.7,
    hoverColor: false,
    markerStyle: {
        initial: {
            fill: '#F8E23B',
            stroke: '#383f47'
        },
        selected: {
            fill: '#CA0020'
        }
    },
    regionStyle: {
        initial: {
            fill: '#262626'
        },
        selected: {
            fill: '#F4A582'
        }
    },
    backgroundColor: '#FFF'
})
$(".resetMap").on("click", () => {
    map.reset()
})
