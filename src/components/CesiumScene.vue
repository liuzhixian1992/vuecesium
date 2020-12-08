
<template>
  <div id="container" class="box">
    <div id="cesiumContainer"></div>
  </div>
</template>
<script>

export default {
  name: 'cesiumPage',
  data () {
    return {
    }
  },
  mounted(){
     this.ini();
     this.add3dtitle();
  },
  methods:{
    //初始化地图
    ini(){
        var that = this;
        var Cesium = this.Cesium;
        that.entitieBool=true;
        var cesiumContainer = document.getElementById("cesiumContainer");
        //天地图影像服务
        //   var tdtImagerLayerProvider = new Cesium.WebMapTileServiceImageryProvider({
        //         url:"http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
        //         layer:"tiandituImg",
        //         style:"default",
        //         format:"image/jpeg",
        //         tileMatrixSetID:"tiandituImg",
        //         show:true,
        //         maximumLevel:18
        //     });

        //天地图注记服务
        var tdtNoteLayerProvider = new Cesium.WebMapTileServiceImageryProvider({
          url:
            "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=ebf64362215c081f8317203220f133eb",
          layer: "tiandituImgMarker",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "tiandituImgMarker",
          show: true,
          maximumLevel: 16
        });
        // 113.684891497 23.278482472 ,115.265440429 22.17811585 dd
        // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(113.684891497, 22.17811585, 115.265440429, 23.278482472);//西南东北，默认显示中国
        //加载天地图
        var viewer = new Cesium.Viewer("cesiumContainer", {
          animation: false, //是否显示动画控件
          baseLayerPicker: true, //是否显示图层选择控件
          geocoder: true, //是否显示地名查找控件
          timeline: false, //是否显示时间线控件
          sceneModePicker: true, //是否显示投影方式控件
          navigationHelpButton: false, //是否显示帮助信息控件
          infoBox: true, //是否显示点击要素之后显示的信息
          imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
            url:
              "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb",
            layer: "tdtBasicLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
          })
        });
        that.viewer = viewer;
        //----------------------------------多图层控制
        var imageryLayers = viewer.imageryLayers;
        var tdtNoteLayer = imageryLayers.addImageryProvider(tdtNoteLayerProvider); //添加注记图层
        imageryLayers.raiseToTop(tdtNoteLayer); //将注记图层置顶
        imageryLayers.alpha = 0.3; //改变透明度
        imageryLayers.brightness = 1.5; //改变亮度
        // pitch是围绕X轴旋转，也叫做俯仰角，如图3所示。
        // yaw是围绕Y轴旋转，也叫偏航角，如图4所示。
        // roll是围绕Z轴旋转，也叫翻滚角，如图5所示。
        viewer.camera.setView({
          // fromDegrees()方法，将经纬度和高程转换为世界坐标
          destination: Cesium.Cartesian3.fromDegrees(119.597418, 34.557183, 7000.0),
          orientation: {
            // 指向
            heading: Cesium.Math.toRadians(0, 0),
            // 视角
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
          }
        });
        //去除 版权图标
        viewer._cesiumWidget._creditContainer.style.display = "none";
        var scene = viewer.scene;       
        //场景点击事件
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(function(evt) {
          var ray = viewer.camera.getPickRay(evt.position);
          var cartesian = viewer.scene.globe.pick(ray, viewer.scene);
          var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          var lng = Cesium.Math.toDegrees(cartographic.longitude); //经度值
          var lat = Cesium.Math.toDegrees(cartographic.latitude); //纬度值
          console.log(lng,lat)
          var mapPosition={x:lng,y:lat,z:cartographic.height};//cartographic.height的值为地形高度。
          // var mapPosition = { x: 119.597418, y: 34.557183, z: cartographic.height }; //cartographic.height的值为地形高度。
          //触发回调右侧窗口
          that.$emit("mouserver", mapPosition);
          // changeData
          // var point=SrceenUtil.getMercator(mapPosition);
          // // var mapPosition={};
          // var minX=point.x-(802*5/2)
          // var maxX=point.x+(802*5/2)
          // var minY=point.y-(802*5/2)
          // var maxY=point.y+(802*5/2)
          // var min=SrceenUtil.getLngLat({x:minX,y:minY});
          // var max=SrceenUtil.getLngLat({x:maxX,y:maxY});
          // that.addImage(min.x,min.y,max.x,max.y);
          //         x: 12693778.421869352
          // y: 2586635.6243980383
          // console.log(point)
          // that.flyTo(lng,lat,2000);
          console.log(mapPosition);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    add3dtitle() {
      var that = this;
      // http://121.35.9.106:8082/tileset.json
      //1加载倾斜摄影
      var Cesium = this.Cesium;
      that.cesium3Dtileset=new Cesium.Cesium3DTileset({
          url: "api/tileset.json" //  ./data/3dtiles-lab/tileset.json
        });
      var tileset = this.viewer.scene.primitives.add(
        that.cesium3Dtileset
      );

      tileset.readyPromise
        .then(function(tileset) {
          viewer.camera.viewBoundingSphere(
            boundingSphere,
            new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius)
          );
          viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        })
        .otherwise(function(error) {
          throw error;
        });
    },
  }

}
</script>
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body,
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.box {
  height: 100%;
} 
</style>

