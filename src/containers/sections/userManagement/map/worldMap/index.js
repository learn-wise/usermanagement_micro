import React,{Component} from 'react';
import { VectorMap } from "react-jvectormap";
import classes from './style.scss'
/* TODO MAP
  * by each click on regions show (today visitors|users|total visitors)
  * show online and visitors by markers on map
  * initial show (3 most country that visitors come from of it by showing percent of them )
  * adjust the color + hover effect
*/


class Map extends Component{
    render(){
        const mapData = {
            CN: .100000,
            IN: 9900,
          };
        
        const handleClick = (e, countryCode) => {
            console.log(countryCode);
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
        el.html(el.html() + ' (GDP - ' + mapData[code] + ')');
        }
        var onMarkerTipShow = (e, el, code) => {
        el.html(el.html() + '(25k)');
        }
        var onRegionSelected = () => {
        console.log('onRegionSelected')
        }

        var onMarkerSelected = () => {
        console.log('onMarkerSelected')
        }
        return (
            <div>
              <VectorMap
                map={"world_mill"}
                backgroundColor="transparent"
                regionsSelectable={true}
                markersSelectable={true}
                zoomOnScroll={true}

                containerStyle={{
                  width: "100%",
                  height: "50rem"
                }}
                onRegionTipShow={onRegionTipShow}
                onMarkerTipShow={onMarkerTipShow}
                markers={markers}
                onRegionSelected={onRegionSelected}
                onMarkerSelected={onMarkerSelected}
                onRegionClick={handleClick} //gets the country code
                containerClassName={classes.map}
                zoomAnimate={true}
                markerStyle={{
                    initial: {
                        fill: '#F8E23B',
                        stroke: '#383f47'
                    },
                    hover: {
                      cursor:"pointer"
                    },
                    selected: {
                        fill: '#CA0020'
                    }
                }}
                regionStyle={{
                  initial: {
                    fill: "#e4e4e4",
                    "fill-opacity": 0.9,
                    stroke: "none",
                    "stroke-width": 0,
                    "stroke-opacity": 0
                  },
                  hover: {
                    "fill-opacity": 0.8,
                    cursor: "pointer"
                  },
                  selected: {
                    fill: "#2938bc" //color for the clicked country
                  },
                  selectedHover: {}
                }}
                series={{
                  regions: [
                    {
                      values: mapData, //this is your data
                      scale: ["#262626", "#00000"], //your color game's here
                      normalizeFunction: "polynomial"
                    }
                  ]
                }}
              />
            </div>
        );
    }
}


export default Map;