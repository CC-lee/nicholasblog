<template src="./sendmessage.html"></template>

<script>
import Dropzone from "dropzone";
import "./editor.style.css";
import { mapGetters } from "vuex";
import "at.js/dist/css/jquery.atwho.min.css";
import "at.js/dist/js/jquery.atwho.min.js";
import * as _ from "lodash";
import api from "api";
export default {
  data() {
    const that = this;
    return {
      uploadable: false,
      userlist: [],
      message: {
        user_id: "",
        user_name: "",
        user_avatar: "",
        user_email: "",
        message_type: "user",
        message_preview: "",
        img: [],
        comment_num: 0,
        like_num: 0,
        like_status: false,
        content: "",
        notify: []
      },
      configer: {},
      arr: [],
      img: [],
      textLength: 0,
      myDropzone: {},
      config: {
        editorClass: "text",
        fontSizeDefaultSelection: "15",
        heightMin: 150,
        emoticonsStep: 10,
        placeholderText: "在此写下留言",
        pastePlain: true,
        pluginsEnabled: ["url", "emoticons", "charCounter", "link"],
        toolbarButtons: ["emoticons", "insertLink"],
        toolbarButtonsXS: ["emoticons", "insertLink"],
        toolbarButtonsSM: ["emoticons", "insertLink"],
        toolbarButtonsMD: ["emoticons", "insertLink"],
        emoticonsSet: [
          { code: "1f601", desc: "grinning face with smiling eyes" },
          { code: "1f602", desc: "face with tears of joy" },
          { code: "1f603", desc: "smiling face with open mouth" },
          {
            code: "1f604",
            desc: "smiling face with open mouth and smiling eyes"
          },
          {
            code: "1f605",
            desc: "smiling face with open mouth and cold sweat"
          },
          {
            code: "1f606",
            desc: "smiling face with open mouth and tightly-closed eyes"
          },
          { code: "1f609", desc: "winking face" },
          { code: "1f60a", desc: "smiling face with smiling eyes" },
          { code: "1f60b", desc: "face savouring delicious food" },
          { code: "1f60c", desc: "relieved face" },
          { code: "1f60d", desc: "smiling face with heart-shaped eyes" },
          { code: "1f60f", desc: "smirking face" },
          { code: "1f612", desc: "unamused face" },
          { code: "1f613", desc: "face with cold sweat" },
          { code: "1f614", desc: "pensive face" },
          { code: "1f616", desc: "confounded face" },
          { code: "1f618", desc: "face throwing a kiss" },
          { code: "1f61a", desc: "kissing face with closed eyes" },
          { code: "1f61c", desc: "face with stuck-out tongue and winking eye" },
          {
            code: "1f61d",
            desc: "face with stuck-out tongue and tightly-closed eyes"
          },
          { code: "1f61e", desc: "disappointed face" },
          { code: "1f620", desc: "angry face" },
          { code: "1f621", desc: "pouting face" },
          { code: "1f622", desc: "crying face" },
          { code: "1f623", desc: "persevering face" },
          { code: "1f624", desc: "face with look of triumph" },
          { code: "1f625", desc: "disappointed but relieved face" },
          { code: "1f628", desc: "fearful face" },
          { code: "1f629", desc: "weary face" },
          { code: "1f62a", desc: "sleepy face" },
          { code: "1f62b", desc: "tired face" },
          { code: "1f62d", desc: "loudly crying face" },
          { code: "1f630", desc: "face with open mouth and cold sweat" },
          { code: "1f631", desc: "face screaming in fear" },
          { code: "1f632", desc: "astonished face" },
          { code: "1f633", desc: "flushed face" },
          { code: "1f635", desc: "dizzy face" },
          { code: "1f637", desc: "face with medical mask" },
          { code: "1f638", desc: "grinning cat face with smiling eyes" },
          { code: "1f639", desc: "cat face with tears of joy" },
          { code: "1f63a", desc: "smiling cat face with open mouth" },
          { code: "1f63b", desc: "smiling cat face with heart-shaped eyes" },
          { code: "1f63c", desc: "cat face with wry smile" },
          { code: "1f63d", desc: "kissing cat face with closed eyes" },
          { code: "1f63e", desc: "pouting cat face" },
          { code: "1f63f", desc: "crying cat face" },
          { code: "1f640", desc: "weary cat face" },
          { code: "1f645", desc: "face with no good gesture" },
          { code: "1f646", desc: "face with ok gesture" },
          { code: "1f647", desc: "person bowing deeply" },
          { code: "1f648", desc: "see-no-evil monkey" },
          { code: "1f649", desc: "hear-no-evil monkey" },
          { code: "1f64a", desc: "speak-no-evil monkey" },
          { code: "1f64b", desc: "happy person raising one hand" },
          { code: "1f64c", desc: "person raising both hands in celebration" },
          { code: "1f64d", desc: "person frowning" },
          { code: "1f64e", desc: "person with pouting face" },
          { code: "1f64f", desc: "person with folded hands" },
          { code: "1f607", desc: "smiling face with halo" },
          { code: "1f608", desc: "smiling face with horns" },
          { code: "1f60e", desc: "smiling face with sunglasses" },
          { code: "1f610", desc: "neutral face" },
          { code: "1f611", desc: "expressionless face" },
          { code: "1f615", desc: "confused face" },
          { code: "1f617", desc: "kissing face" },
          { code: "1f619", desc: "kissing face with smiling eyes" },
          { code: "1f61b", desc: "face with stuck-out tongue" },
          { code: "1f61f", desc: "worried face" },
          { code: "1f626", desc: "frowning face with open mouth" },
          { code: "1f627", desc: "anguished face" },
          { code: "1f62c", desc: "grimacing face" },
          { code: "1f62e", desc: "face with open mouth" },
          { code: "1f62f", desc: "hushed face" },
          { code: "1f634", desc: "sleeping face" },
          { code: "1f636", desc: "face without mouth" },
          { code: "1f911", desc: "money-mouth face" }
        ],
        events: {
          "froalaEditor.initialized": function(e, editor) {
            if (that.loggedIn) {
              api.user
                .getUserLists()
                .then(result => {
                  let { data: { code, data } } = result;
                  that.userlist = data;
                  let configer = {
                    at: "@",
                    data: data,
                    displayTpl:
                      '<li><img src="${avatar}" alt="Smiley face" width="32" height="32">${name} <small>${email}</small></li>',
                    limit: 200,
                    maxLen: 20,
                    searchKey: "email",
                    callbacks: {
                      remoteFilter: (query, callback) => {
                        //console.log(query);
                      }
                    }
                  };
                  editor.$el
                    .atwho(configer)
                    .on("inserted.atwho", function(atwho, $li, browser) {
                      /**console.log(
                        browser.currentTarget.childNodes[1].nodeValue
                      );*/
                      editor.$el
                        .find(".atwho-inserted")
                        .removeAttr("contenteditable");
                    });
                })
                .catch(err => {
                  alert(err.message);
                });
            }
          },
          "froalaEditor.charCounter.update": function(e, editor) {
            that.textLength = editor.charCounter.count();
          }
        }
      },
      dropzoneOptions: {
        url: "/api/message/frontSaveImage",
        acceptedFiles: "image/gif,image/jpeg,image/jpg,image/png",
        thumbnailWidth: 1500,
        thumbnailHeight: 1500,
        uploadMultiple: true,
        autoQueue: false,
        maxFiles: 4,
        parallelUploads: 100,
        previewsContainer: "#drop-previews",
        previewTemplate: `
        <div class="preview col-md-3">
        <div class="img">
        <img class="col-md-12" data-dz-thumbnail />
          <div class="dz-remove" data-dz-remove>
          <div class="fa fa-close" ></div>
        </div>
        <div>
          <div class="uploadprogress"><span data-dz-uploadprogress></span></div>
          <div class="dz-error-message"><span data-dz-errormessage></span></div>
        </div>
        `,
        clickable: ["#input"],
        init: function() {
          $("#drop-previews").hide();
          $(".dropzone").css({ border: "none", padding: "0 0" });
          $("#drop-previews").hide();
          $(".dz-message").hide();
          $(".dz-default").hide();
          this.on("addedfile", function(file) {
            $("#drop-previews").show();
            $(".dz-remove").hide();
            $(".preview").css({
              display: "inline-block",
              padding: "0px 10px",
              margin: "5px 0px"
            });
            if (that.arr.length === 4) {
              that.arr.push(file);
              this.removeFile(file);
            } else {
              that.arr.push(file);
            }
          });
          this.on("thumbnail", function() {
            $(".img img").css({ height: "190px", padding: "0 0" });
            $(".dz-remove").css({
              display: "inline-block",
              position: "absolute",
              top: "3%",
              left: "85%",
              width: "1.3em",
              height: "1.3em",
              "z-index": "0",
              "font-size": "1.3em",
              "line-height": "1em",
              "text-align": "center",
              "font-weight": "bold",
              border: "1px solid black",
              "border-radius": "1.3em",
              color: "white",
              "background-color": "black",
              cursor: "pointer"
            });
          });
          this.on("sendingmultiple", function(file, xhr, formData) {
            formData.append("_id", that.profile._id);
          });
          this.on("successmultiple", function(files, response) {
            $(".uploadprogress").hide();
            $(".dz-error-message").hide();
            if (response.code == 200) {
              that.message.img = response.data;
              that.message.path = response.path;
              that.upload(that.message);
            }
          });
          this.on("removedfile", function(file) {
            that.arr.pop();
            $(".dz-remove").css({
              display: "inline-block",
              position: "absolute",
              top: "3%",
              left: "85%",
              width: "1.3em",
              height: "1.3em",
              "z-index": "0",
              "font-size": "1.3em",
              "line-height": "1em",
              "text-align": "center",
              "font-weight": "bold",
              border: "1px solid black",
              "border-radius": "1.3em",
              color: "white",
              "background-color": "black",
              cursor: "pointer"
            });
          });
          this.on("error", function(file, errorMessage) {
            alert("error : " + errorMessage);
            this.removeFile(file);
          });
        }
      }
    };
  },
  components: {},
  watch: {
    "message.content": function() {
      if (this.textLength > 200) {
        $("#count").css({
          color: "red",
          "font-weight": "bold",
          "font-size": "150%"
        });
        this.uploadable = false;
      }
      if (
        this.message.content.replace(/(\s|&nbsp;|<p.*?>|<\/p>)/g, "").length >
          0 &&
        this.textLength <= 200
      ) {
        $("#count").css({
          color: "black",
          "font-weight": "normal",
          "font-size": "100%"
        });
        this.uploadable = true;
      }
      if (
        (this.textLength == 0 && this.arr.length == 0) ||
        (this.message.content.replace(/(\s|&nbsp;|<p.*?>|<\/p>)/g, "").length ==
          0 &&
          this.arr.length == 0)
      ) {
        this.uploadable = false;
        $("#count").css({
          color: "black",
          "font-weight": "normal",
          "font-size": "100%"
        });
      }
    },
    arr: function() {
      if (this.textLength <= 200) {
        if (this.arr.length > 0) {
          this.uploadable = true;
        }
        if (
          this.arr.length == 0 &&
          this.message.content.replace(/(\s|&nbsp;|<p.*?>|<\/p>)/g, "")
            .length == 0
        ) {
          this.uploadable = false;
        }
      }
    }
  },
  methods: {
    send() {
      if (this.loggedIn) {
        this.uploadable = false;
        let choseName = this.message.content.match(
          /<span class="atwho-inserted" data-atwho-at-query="@">(.*?)<\/span>/gi
        );
        if (choseName != null) {
          choseName = choseName.map(function(name) {
            name = name.replace(
              /<span class="atwho-inserted" data-atwho-at-query="@">@|<\/span>/gi,
              ""
            );
            return name;
          });
          for (let i = 0; i < choseName.length; i++) {
            this.message.notify.push(
              _.find(this.userlist, { name: choseName[i] })
            );
          }
        }
        this.message.content = this.message.content.replace(/<p.*?>/g, "<p>");
        this.message.content = this.message.content.replace(
          /(<p><br><\/p>)+/g,
          "<br>"
        );
        this.message.message_preview = this.message.content
          .match(/<p(.*?)>([\s\S]*?)<\/p>/g)
          .join("")
          .replace(/(<([^>]+)>)/gi, "")
          .replace(/&nbsp;/gi, "")
          .substring(0, 30);
        if (this.arr.length > 0) {
          this.myDropzone.enqueueFiles(
            this.myDropzone.getFilesWithStatus(Dropzone.ADDED)
          );
        } else {
          this.upload(this.message);
        }
      } else {
        this.$router.push("/userLogin");
      }
    },
    upload(message) {
      api.message.userMessageCreate(message).then(result => {
        let { data: { code, message } } = result;
        alert(message);
        if (code == 200) {
          this.$router.go("/messageboard");
        }
      });
    },
    drop() {
      Dropzone.autoDiscover = false;
      this.myDropzone = new Dropzone("div#dropzone", this.dropzoneOptions);
      this.myDropzone.options.headers = {
        Authorization: this.token,
        userid: this.profile._id,
        dateid: `${Date.now()}`
      };
    },
    getUserLists() {
      api.user
        .getUserLists()
        .then(result => {
          let { data: { code, data } } = result;
          this.userlist = data;
          return data;
        })
        .catch(err => {
          alert(err.message);
        });
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: "global/getLog",
      token: "global/getToken",
      profile: "global/getProfile"
    })
  },
  beforeCreate() {},
  mounted() {
    this.drop();
    let { _id, user_name, user_avatar, email } = this.profile;
    Object.assign(this.message, {
      user_id: _id,
      user_name,
      user_avatar,
      user_email: email
    });
  },
  beforeDestroy() {
    this.myDropzone.files = [];
    this.myDropzone.destroy();
  },
  destroyed() {}
};
</script>

<style lang="scss" scoped>
@import "./sendmessage.scss";
</style>