<template src="./UserAccount.html"></template>
<script>
import { mapGetters } from 'vuex';
import usernav from '../components/usernav/usernav';
import Dropzone from 'dropzone';
import api from 'api';
import * as _ from 'lodash';
import execlib from '../../../lib/execlib';
export default {
  data() {
    const that = this;
    return {
      Profile: {},
      myDropzone: {},
      dateid: '',
      arr: [],
      avatar: [],
      drawArr: [],
      draw: true,
      finish: false,
      change: false,
      updatable: true,
      dropzoneOptions: {
        url: '/api/user/editSaveImage',
        thumbnailWidth: 1500,
        thumbnailHeight: 1500,
        autoQueue: false,
        maxFiles: 1,
        previewsContainer: '#dropzone-previews',
        previewTemplate: `
        <div class='preview col-md-5'>
        <div class='img'>
        <img class='col-md-12' data-dz-thumbnail />
          <div class='dz-remove' data-dz-remove>
          <div class='fa fa-close' ></div>
        </div>
        <div>
          <div class='uploadprogress'><span data-dz-uploadprogress></span></div>
          <div class='dz-error-message'><span data-dz-errormessage></span></div>
        </div>
        `,
        clickable: ['#inputer'],
        init: function() {
          $('.dropzone').hide();
          $('#dropzone-previews').hide();
          this.on('addedfile', function(file) {
            $('#dropzone-previews').show();
            $('.dz-remove').hide();
            $('.preview').css({
              display: 'inline-block',
              padding: '0px 10px',
              margin: '5px 0px'
            });
            if (that.arr.length > 0) {
              that.arr.push(file);
              this.removeFile(file);
            } else {
              that.arr.push(file);
            }
          });
          this.on('thumbnail', function(file) {
            $('.img img').css({ height: '190px', padding: '0 0' });
            $('.dz-remove').css({
              display: 'inline-block',
              position: 'absolute',
              top: '3%',
              left: '85%',
              width: '1.3em',
              height: '1.3em',
              'z-index': '0',
              'font-size': '1.3em',
              'line-height': '1em',
              'text-align': 'center',
              'font-weight': 'bold',
              border: '1px solid black',
              'border-radius': '1.3em',
              color: 'white',
              'background-color': 'black',
              cursor: 'pointer'
            });
          });
          this.on('success', function(file, response) {
            $('.uploadprogress').hide();
            $('.dz-error-message').hide();
            that.avatar.push(response.data);
            that.myDropzone.files = [];
            that.update();
          });
          this.on('removedfile', function(file) {
            const index = _.findIndex(that.avatar, { filename: file.filename });
            that.avatar.splice(index, 1);
            that.arr.pop();
          });
          this.on('complete', function(file) {});
        }
      }
    };
  },
  components: {
    usernav
  },
  methods: {
    loadImage() {
      if (this.profile._id) {
        api.user
          .eidtLoadImage({ id: this.profile._id, dateid: this.dateid })
          .then(result => {
            var that = this;
            var { code, data } = result.data;
            if (code == 401) {
              alert(data.message);
            } else {
              this.avatar.push(data[0]);
              this.drawArr.push(data[0]);
            }
          })
          .catch(err => {
            alert(err.message);
          });
      }
    },
    drawImage() {
      if (
        this.draw === true &&
        this.drawArr.length > 0 &&
        this.myDropzone.options
      ) {
        this.draw = false;
        var imageObject = JSON.parse(JSON.stringify(this.drawArr[0]));
        this.myDropzone.emit('addedfile', imageObject);
        this.myDropzone.emit('thumbnail', imageObject, imageObject.url);
        this.myDropzone.emit('complete', imageObject);
      }
    },
    uploadImage() {
      if (this.myDropzone.getAcceptedFiles().length > 0) {
        this.myDropzone.enqueueFiles(this.myDropzone.getAcceptedFiles());
      } else {
        this.update();
      }
    },
    update() {
      if (this.Profile.user_name.length == 0) {
        alert('用户名不能为空');
      } else if (this.avatar.length > 0) {
        Object.assign(this.Profile, {
          user_avatar: this.avatar[0].url,
          dateid: this.dateid
        });
        this.change = true;
        this.updatable = false;
        api.user
          .modifyUserAccount(this.Profile)
          .then(result => {
            this.Profile.user_name = this.Profile.user_name.replace(
              /(\s|&nbsp;|<p.*?>|<\/p>)/g,
              ''
            );
            let { data: { code, data, message } } = result;
            if (code == 200) {
              this.$store.commit('global/changeProfile', this.Profile);
              alert(message);
              this.$router.push('/home');
            } else {
              alert(message);
              this.$store.commit('global/changeProfile', data);
              this.$router.push(`/user/${this.profile._id}`);
            }
            this.updatable = true;
          })
          .catch(err => {
            alert(err.message);
          });
      } else {
        Object.assign(this.Profile, {
          user_avatar:
            `${execlib.filePrefix}user/default/Kostya.jpg`
        });
        this.change = true;
        this.updatable = false;
        api.user
          .modifyUserAccount(this.Profile)
          .then(result => {
            let { data: { code, data, message } } = result;
            if (code == 200) {
              this.$store.commit('global/changeProfile', this.Profile);
              alert(message);
              this.$router.push('/home');
            } else {
              alert(message);
              this.$store.commit('global/changeProfile', data);
            }
            this.updatable = true;
          })
          .catch(err => {
            alert(err.message);
          });
      }
    },
    cancel() {
      this.$router.push('/home');
    },
    drop() {
      Dropzone.autoDiscover = false;
      this.myDropzone = new Dropzone('div#dropzone3', this.dropzoneOptions);
      this.myDropzone.options.headers = {
        Authorization: this.token,
        id: this.profile._id,
        dateid: this.dateid
      };
    }
  },
  computed: {
    ...mapGetters({
      token: 'global/getToken',
      profile: 'global/getProfile'
    })
  },
  watch: {
    myDropzone: function() {
      this.drawImage();
    },
    drawArr: function() {
      this.drawImage();
    },
    profile: function() {
      if (this.avatar.length === 0) {
        this.loadImage();
      }
      document.title = `${this.profile.user_name}用户资料-- Nicholas Lee's Blog`;
      this.Profile = JSON.parse(JSON.stringify(this.profile));
    }
  },
  created() {
    this.$nextTick(function() {
      this.drop();
    });
  },
  mounted() {
    this.dateid = `${Date.now()}`;
    this.$store.commit('user/setactive', 'userAccount');
    document.title = `${this.profile.user_name}用户资料-- Nicholas Lee's Blog`;
    this.loadImage();
    this.Profile = JSON.parse(JSON.stringify(this.profile));
    this.$nextTick(function() {});
  },
  beforeDestroy() {
    this.finish = true;
    this.$store.commit('user/unactive');
    if (this.change === false) {
      this.$store.dispatch('global/getProfile');
    }
  },
  destroyed() {
    this.myDropzone.destroy();
  }
};
</script>
<style  lang="scss" scoped>
@import './UserAccount.scss';
</style>