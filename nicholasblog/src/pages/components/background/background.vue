<template src="./background.html"></template>
<script>
import "./quietflow.min";
import "./jquery-cabg-balloon";
import "./jquery-cabg-circlus";
import "./jquery-cabg-cooqui";
export default {
  data() {
    return {
      selected: "circlus",
      options: [
        { text: "Circlus", value: "circlus" },
        { text: "Cooqui", value: "cooqui" },
        { text: "FloatingBoxes", value: "floatingboxes" },
        { text: "LayeredTriangles", value: "layeredtriangles" },
        { text: "SimpleGradient", value: "simplegradient" }
      ]
    };
  },
  methods: {},
  watch: {
    selected: function() {
      switch (this.selected) {
        case "circlus":
          $("#myCanvas")
            .children()
            .remove();
          $("#myCanvas").circlus({
            fps: 30,
            scale: 1,
            background: false,
            items: 15,
            itemMinSpeed: 1000,
            itemMaxSpeed: 2500,
            itemMinSize: 20,
            itemMaxSize: 50,
            itemShapes: ["circle"],
            itemColors: [
              "#0000ff",
              "#00ff00",
              "#00ffff",
              "#ff0000",
              "#ff00ff",
              "#ffff00"
            ],
            unique: true
          });
          break;
        case "cooqui":
          $("#myCanvas")
            .children()
            .remove();
          $("#myCanvas").cooqui({
            fps: 60,
            scale: 1,
            distance: 100,
            background: "#fac979",
            spacing: 25,
            itemSize: 10,
            itemScale: 2.0,
            itemColors: ["#ffffff"],
            unique: true
          });
          break;
        case "floatingboxes":
          $("#myCanvas")
            .children()
            .remove();
          $("#myCanvas").quietflow({
            theme: "floatingBoxes",
            specificColors: [
              "rgba(46, 204, 113, .5)",
              "rgba(52, 152, 219, .5)",
              "rgba(231, 76, 60, .5)",
              "rgba(155, 89, 182, .5)",
              "rgba(241, 196, 15, .5)"
            ],
            boxCount: 500,
            backgroundCol: "#34495E"
          });
          break;
        case "layeredtriangles":
          $("#myCanvas")
            .children()
            .remove();
          $("#myCanvas").quietflow({
            theme: "layeredTriangles"
          });
          break;
        case "simplegradient":
          $("#myCanvas")
            .children()
            .remove();
          $("#myCanvas").quietflow({
            theme: "simpleGradient",
            primary: "#B066FE",
            accent: "#63E2FF"
          });
          break;
      }
    }
  },
  mounted() {
    $("#frontMainContainer").append(`<div id="myCanvas"></div>`);
    $("#myCanvas").css({
      position: "fixed",
      left: "0px",
      top: "0px",
      right: "0px",
      bottom: "0px",
      width: "100%",
      height: "100%",
      zIndex: "-1"
    });
    $("#myCanvas").circlus({
      fps: 30,
      scale: 1,
      background: false,
      items: 15,
      itemMinSpeed: 1000,
      itemMaxSpeed: 2500,
      itemMinSize: 20,
      itemMaxSize: 50,
      itemShapes: ["circle"],
      itemColors: [
        "#0000ff",
        "#00ff00",
        "#00ffff",
        "#ff0000",
        "#ff00ff",
        "#ffff00"
      ],
      unique: true
    });
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/css/frontend/public.css";
@import "./background.scss";
</style>