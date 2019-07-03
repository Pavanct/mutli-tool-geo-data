<template>
  <div style="height: 100%; overflow: auto; position: unset;">
    <l-map
      id="l-map"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      ref="map"
      style="height: 100%"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-control-layers position="topright"></l-control-layers>
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
        :token="token"
        layer-type="base"
      />
      <!-- <l-grid-layer :tile-component="tileComponent"></l-grid-layer> -->
      <!-- <l-marker :lat-lng="withPopup">
        <l-popup>
          <div @click="innerClick">
            I am a popup
            <p v-show="showParagraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
              Donec finibus semper metus id malesuada.
            </p>
          </div>
        </l-popup>
      </l-marker>-->
      <!-- <l-marker :lat-lng="withTooltip">
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div @click="innerClick">
            I am a tooltip
            <p v-show="showParagraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
              Donec finibus semper metus id malesuada.
            </p>
          </div>
        </l-tooltip>
      </l-marker>-->
    </l-map>
    <button id="refreshButton" v-on:click="changeHashFunction('quadtree')">Switch</button>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import {
  LMap,
  LTileLayer
  // LMarker,
  // LPopup,
  // LTooltip,
  // LGridLayer
} from "vue2-leaflet";
import "leaflet-draw";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";

export default {
  name: "Maps",
  components: {
    LMap,
    LTileLayer
    // LMarker,
    // LPopup,
    // LTooltip,
    // LGridLayer
  },
  // tileComponent: {
  //   name: "tile-component",
  //   props: {
  //     coords: {
  //       type: Object,
  //       required: true
  //     }
  //   },
  //   template: "<div>Coords: {{coords.x}}, {{coords.y}}, {{coords.z}}</div>"
  // },
  data() {
    return {
      zoom: 13,
      center: latLng(52.5138587, 13.3187443),
      url:
        "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="subdomainshttp://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(52.5138587, 13.3187443),
      withTooltip: latLng(52.5138587, 13.3187443),
      currentZoom: 11.5,
      currentCenter: latLng(52.5138587, 13.3187443),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      tileProviders: [
        {
          name: "OpenStreetMap",
          visible: true,
          attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        },
        {
          name: "OpenTopoMap",
          visible: false,
          url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          attribution:
            'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        },
        {
          name: "Stamen Design",
          visible: false,
          url:
            "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png",
          attribution:
            '&copy; <a href="subdomainshttp://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        },
        {
          name: "Stamen Terrain",
          visible: false,
          url:
            "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png",
          attribution:
            'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: "abcd",
          minZoom: 0,
          maxZoom: 18
        },
        {
          name: "CartoDB_DarkMatter",
          visible: false,
          url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          minZoom: 0,
          maxZoom: 19
        },
        {
          name: "esri-satellite",
          visible: false,
          url:
            "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution:
            '&copy; <a href="http://www.esri.com/">Esri</a> i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 18
        }
      ]
    };
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    }
  },
  mounted() {
    this.$nextTick(() => {
      const map = this.$refs.map.mapObject;
      const drawControl = new L.Control.Draw({
        position: "topright",
        draw: {
          polyline: {
            allowIntersection: false,
            showArea: true
          },
          polygon: true,
          rectangle: true,
          circle: true,
          marker: true
        }
      });

      var drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      map.on("draw:created", function(e) {
        var type = e.layerType,
          layer = e.layer;

        if (type === "rectangle") {
          layer.on("mouseover", function() {
            alert(layer.getLatLngs());
          });
        }

        if (type === "polygon") {
          layer.on("mouseover", function() {
            alert(layer.getLatLngs());
          });
        }

        if (type === "polyline") {
          layer.on("mouseover", function() {
            alert(layer.getLatLngs());
          });
        }

        drawnItems.addLayer(layer);
      });

      map.addControl(drawControl);

      const editableLayers = new L.FeatureGroup().addTo(map);
      map.on(L.Draw.Event.CREATED, e => {
        // const type = e.layerType;
        const layer = e.layer;
        var type = e.layerType;

        if (type === "marker") {
          layer.bindPopup("LatLng: " + layer.getLatLng()).openPopup();
        }

        // if (type === "rectangle") {
        //   layer.bindPopup("LatLng: " + layer.getLatLng()).openPopup();
        // }

        // Do whatever else you need to. (save to db, add to map etc)
        editableLayers.addLayer(layer);
      });

      var labelConfig = {
        noHide: true,
        className: "my-label",
        direction: "right",
        offset: [5, 50],
        zoomAnimation: true,
        permanent: true
      };

      var labelConfig2 = {
        noHide: true,
        className: "my-label2",
        direction: "right",
        offset: [-15, 25],
        zoomAnimation: true,
        permanent: true
      };

      var labelConfig3 = {
        noHide: true,
        className: "my-label2",
        direction: "right",
        offset: [-15, 25],
        zoomAnimation: true,
        permanent: false
      };

      var rectStyle = {
        color: "#ff0000",
        weight: 1,
        opacity: 0.3,
        fillOpacity: 0,
        lineCap: "butt"
      };

      var layerGroup = L.layerGroup();
      map.addLayer(layerGroup);

      var quadAdapter = {
        range: ["0", "1", "2", "3"],
        encode: function(centroid, precision) {
          var zoom = precision - 1;
          var tile = getTileXYZ(centroid.lat, centroid.lng, zoom);
          return SlippyToQuad(tile.x, tile.y, tile.z);
        },
        bbox: function(hash) {
          var tileSize = 256;
          var tile = QuadToSlippy(hash);

          // get NorthWest and SouthEast points
          var nwTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
          var seTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
          seTilePoint.x += tileSize;
          seTilePoint.y += tileSize;

          var nwLatLon = map.unproject(nwTilePoint, tile.z);
          var seLatLon = map.unproject(seTilePoint, tile.z);

          return {
            minlng: nwLatLon.lng,
            minlat: seLatLon.lat,
            maxlng: seLatLon.lng,
            maxlat: nwLatLon.lat
          };
        },
        layers: function(currentHash, zoom) {
          var layers = {};
          // if( zoom > 4 ) layers[ currentHash.substr( 0, zoom -4 ) ] = true;
          // if( zoom > 3 ) layers[ currentHash.substr( 0, zoom -3 ) ] = true;
          if (zoom > 2) layers[currentHash.substr(0, zoom - 2)] = true;
          if (zoom > 1) layers[currentHash.substr(0, zoom - 1)] = true;
          layers[currentHash.substr(0, zoom)] = true;
          return layers;
        },
        labels: function(hash) {
          return {
            long: hash,
            short: hash.substr(-1, 1)
          };
        }
      };

      var slippyAdapter = {
        range: quadAdapter.range,
        encode: quadAdapter.encode,
        bbox: quadAdapter.bbox,
        layers: quadAdapter.layers,
        labels: function(hash) {
          var tile = QuadToSlippy(hash);
          return {
            long: [tile.z, tile.x, tile.y].join("/"),
            short: ""
          };
        }
      };

      /** Converts numeric degrees to radians */
      if (typeof Number.prototype.toRad === "undefined") {
        Number.prototype.toRad = function() {
          return (this * Math.PI) / 180;
        };
      }

      function getTileXYZ(lat, lon, zoom) {
        var xtile = parseInt(Math.floor(((lon + 180) / 360) * (1 << zoom)));
        var ytile = parseInt(
          Math.floor(
            ((1 -
              Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) /
                Math.PI) /
              2) *
              (1 << zoom)
          )
        );
        return { x: xtile, y: ytile, z: zoom };
      }

      function QuadToSlippy(quad) {
        var x = 0;
        var y = 0;
        var z = 0;
        quad.split("").forEach(function(char) {
          x *= 2;
          y *= 2;
          z++;

          if (char == "1" || char == "3") {
            x++;
          }

          if (char == "2" || char == "3") {
            y++;
          }
        });
        return { x: x, y: y, z: z };
      }

      function SlippyToQuad(x, y, z) {
        var quadKey = [];
        for (var i = z; i > 0; i--) {
          var digit = "0";
          var mask = 1 << (i - 1);
          if ((x & mask) !== 0) {
            digit++;
          }
          if ((y & mask) !== 0) {
            digit++;
            digit++;
          }
          quadKey.push(digit);
        }
        return quadKey.join("");
      }

      var currentHash;
      var adapter = quadAdapter;
      // var adapter = hashAdapter;

      var mousePositionEvent = null;

      function generateCurrentHash(precision) {
        var center = map.getCenter();

        if (mousePositionEvent) {
          center = mousePositionEvent.latlng;
          // console.log( center );
        }

        return adapter.encode(center, precision);
      }
      var type = "slippy";
      var prevHash = "NOTAHASH";
      function changeHashFunction(algorithm) {
        // if (algorithm == "geohash") adapter = hashAdapter;
        if (algorithm == "slippy") adapter = slippyAdapter;
        else adapter = quadAdapter;
        prevHash = "NOTAHASH"; // force hash to regenerate
        updateLayer();
        type = algorithm;
      }

      function updateLayer() {
        var zoom = map.getZoom();
        var hashLength = zoom + 1;

        // update current hash
        currentHash = generateCurrentHash(hashLength);

        // if (adapter === hashAdapter) {
        //   hashLength = zoomToHashChars(zoom);
        // }

        var hashPrefix = currentHash.substr(0, hashLength);

        // console.log( 'zoom', zoom );
        // console.log( 'prevHash', prevHash );
        // console.log( 'hashPrefix', hashPrefix );

        // performance tweak
        // @todo: not that performant?
        if (prevHash != hashPrefix) {
          // console.log( 'zoom', zoom );
          layerGroup.clearLayers();

          var layers = adapter.layers(currentHash, zoom);
          for (var attr in layers) {
            drawLayer(attr, layers[attr]);
          }
        }

        prevHash = hashPrefix;
      }

      function drawRect(bounds, hash, showDigit) {
        // http://leafletjs.com/reference.html#path-options
        var poly = L.rectangle(bounds, rectStyle);
        poly.addTo(layerGroup);

        // generate labels
        var labels = adapter.labels(hash);

        // full (long) hash marker
        if (labels.long.length > 1) {
          var marker = new L.marker(poly.getBounds().getNorthWest(), {
            opacity: 0.0001
          });
          //console.log("marker", marker);
          marker.bindTooltip(labels.long, labelConfig);
          marker.addTo(layerGroup);
        }

        if (type === "slippy") {
          // console.log("wtf", type)
          if (showDigit) {
            var marker2 = new L.marker(poly.getBounds().getCenter(), {
              opacity: 0.0001
            });
            //console.log("marker2", marker2);

            marker2.bindTooltip(labels.short, labelConfig3);
            // console.log("#####",labels.long);
            marker2.addTo(layerGroup);
          }
        } else {
          if (showDigit) {
            var marker3 = new L.marker(poly.getBounds().getCenter(), {
              opacity: 0.0001
            });
            // map.on("click", function(e){
            //   mousePositionEvent = e;
            //   console.log(e);
            // })
            marker3.bindTooltip(labels.short, labelConfig2);
            marker3.addTo(layerGroup);
          }
        }
      }

      

      function drawLayer(prefix, showDigit) {
        var labelArray = new Array;
        adapter.range.forEach(function(n) {
          var hash = "" + prefix + n;
          var bbox = adapter.bbox(hash);

          var bounds = L.latLngBounds(
            L.latLng(bbox.maxlat, bbox.minlng),
            L.latLng(bbox.minlat, bbox.maxlng)
          );

          // console.log( hash );
          // console.log( bbox );
          // console.log( bounds );

          drawRect(bounds, hash, showDigit);
          // labelArray.push(l1);
        });
        //console.log(labelArray);
        // return labelArray;
      }

      // getCurrentLabels
      // function getCurrentLabels(){
      //   console.log("currentlabels");
      // }

      // update on changes
      map.on("zoomend", updateLayer);
      map.on("moveend", updateLayer);

      // init
      changeHashFunction("quadtree");
      // updateLayer();

      map.on("mousemove", function(e) {
        mousePositionEvent = e;
        updateLayer();
      });

      // todo
      map.on("click", function(e){
        var zoom = map.getZoom();
        mousePositionEvent = e;
        console.log(e.latlng);
        var hashLength = zoom + 1;  
        var currenthash = generateCurrentHash(hashLength);
        var hashPrefix = currentHash.substr(0, hashLength);
        var layers = adapter.layers(currenthash, zoom);
       if (prevHash != hashPrefix) {
          // console.log( 'zoom', zoom );
          layerGroup.clearLayers();

          var layers = adapter.layers(currentHash, zoom);
          for (var attr in layers) {
            drawLayer(attr, layers[attr]);
          }
        }
        prevHash = hashPrefix;  
        console.log(layers);             
      })
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
html,
body,
#maps {
  height: 100%;
  margin: 0;
}
body,
html {
  height: 100%;
}
#l-map {
  height: 100%;
}
#refreshButton {
  position: absolute;
  top: 290px;
  right: 20px;
  padding: 10px;
  z-index: 500;
}
.my-label {
  font-size: 10px;
  color: white;
  background-color: rgba(255, 0, 0, 0.5);
}

.my-label2 {
  font-size: 30px;
  color: rgba(255, 0, 0, 0.5);
  background-color: transparent;
}
</style>
