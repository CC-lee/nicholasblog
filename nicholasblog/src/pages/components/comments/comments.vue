<template src="./comments.html"></template>

<script>
import { mapGetters } from 'vuex'
import './lib/comment.js'
import api from 'api'
import assist from './commentsApi'
import * as _ from 'lodash'
export default {
  data() {
    return {
      fhName: '',
      ArticleComment: {
        article_id: '',
        user_id: '',
        user_avatar: '',
        user_name: '',
        like_num: 0,
        content: '',
        like_status: false,
        time: ''
      },
      ArticleCommentReply: {
        article_id: '',
        user_avatar: '',
        user_id: '',
        user_name: '',
        comment_id: '',
        reply_user_id: '',
        reply_user_avatar: '',
        reply_user_name: '',
        content: '',
        time: ''
      },
      ArticleCommentLike: {
        article_id: '',
        user_id: '',
        comment_id: '',
        target_id: '',
        like_type: 'comment'
      },
      MessageComment: {
        message_id: '',
        user_id: '',
        user_avatar: '',
        user_name: '',
        like_num: 0,
        content: '',
        like_status: false,
        time: ''
      },
      MessageCommentReply: {
        message_id: '',
        user_avatar: '',
        user_id: '',
        user_name: '',
        comment_id: '',
        reply_user_id: '',
        reply_user_avatar: '',
        reply_user_name: '',
        content: '',
        time: ''
      },
      MessageCommentLike: {
        message_id: '',
        user_id: '',
        comment_id: '',
        target_id: '',
        like_type: 'comment'
      },
      ImageComment: {
        image_id: '',
        user_id: '',
        user_avatar: '',
        user_name: '',
        content: '',
        like_num: 0,
        like_status: false,
        time: ''
      },
      ImageCommentLike: {
        image_id: '',
        user_id: '',
        comment_id: '',
        target_id: ''
      },
      commentarray: [],
      replyinfo: {},
      commenthtml: '',
      target: {}
    }
  },
  props: ['item', 'type', 'comment'],
  computed: {
    ...mapGetters({
      loggedIn: 'global/getLog',
      profile: 'global/getProfile'
    })
  },
  methods: {
    keyUP(e) {
      var elem = $('#area')
      var len = elem.val().length
      if (len > 139) {
        e.preventDefault && e.preventDefault()
        elem.val(elem.val().substring(0, 140))
      } else {
        setTimeout(function() {
          var len = elem.val().length
          if (len > 139) {
            elem.val(elem.val().substring(0, 140))
          }
        }, 100)
      }
    },
    getTime() {
      return assist.getTime()
    },
    assign() {}
  },
  watch: {
    comment: function() {
      if (this.comment.length > 0) {
        this.commentarray = _.cloneDeep(this.comment)
        this.commenthtml = assist.getComments(this.commentarray, this.type)
      }
    }
  },
  created() {},
  mounted() {
    const that = this
    $('textarea').autoHeight()
    if (this.type == 'image') {
      $('textarea').height('30px')
      $('.plBtn').css({ 'margin-top': '0px' })
      $('textarea').css({ 'margin-bottom': '2px' })
      $('.commentAll').css({ padding: '0px 5px' })
      $('.comment-show').css({ 'overflow-y': 'auto', height: '240px' })
    } else {
      $('textarea').height('90px')
    }
    $('.commentAll').on('click', '.plBtn', function() {
      if (that.loggedIn) {
        var now = that.getTime()
        //获取输入内容
        var oSize = $('#area').val()
        if (that.type == 'article') {
          var commentname = 'Article'
          //动态创建评论模块
          var oHtml = assist.sendcomment(
            that.profile.user_avatar,
            that.profile.user_name,
            oSize,
            now
          )
        }
        if (that.type == 'message') {
          var commentname = 'Message'
          var oHtml = assist.sendcomment(
            that.profile.user_avatar,
            that.profile.user_name,
            oSize,
            now
          )
        }
        if (that.type == 'image') {
          var commentname = 'Image'
          var oHtml = assist.sendimagecomment(
            that.profile.user_avatar,
            that.profile.user_name,
            oSize,
            now
          )
        }
        Object.assign(that[`${commentname}Comment`], {
          [`${that.type}_id`]: that.item._id,
          user_id: that.profile._id,
          user_avatar: that.profile.user_avatar,
          user_name: that.profile.user_name,
          content: oSize,
          time: now
        })
        if (oSize.replace(/(^\s*)|(\s*$)/g, '') != '') {
          if (that.type == 'article') {
            var apiname = 'article'
            var senfunc = 'article'
          }
          if (that.type == 'message') {
            var apiname = 'message'
            var senfunc = 'message'
          }
          if (that.type == 'image') {
            var apiname = 'album'
            var senfunc = 'image'
          }
          api[`${apiname}`]
            [`${senfunc}Comment`](that[`${commentname}Comment`])
            .then(result => {
              let { data: { code, comment, message } } = result
              if (code == 200) {
                that.commentarray.push(comment)
                $(this)
                  .parents('.reviewArea')
                  .siblings('.comment-show')
                  .prepend(oHtml)
                $('#area').val('')
              } else {
                alert(message)
              }
            })
        }
      } else {
        that.$router.push('/userLogin')
      }
    })
    $('.comment-show').on('click', '.pl-hf', function() {
      if (that.loggedIn) {
        var commenttime1 = $(this)
          .parents('.date-dz-right')
          .siblings('.comment-time')
          .html()
        var commenttime2 = $(this)
          .parents('.date-dz-right')
          .parents('.date-dz')
          .parents('div')
          .parents('.all-pl-con')
          .parents('.hf-list-con')
          .siblings('.date-dz')
          .find('.comment-time')
          .html()
        //获取回复人的名字
        var fhName = $(this)
          .parents('.date-dz-right')
          .parents('.date-dz')
          .siblings('.pl-text')
          .find('.comment-size-name')
          .html()
        that.fhName = fhName.replace(/ :/gi, '')
        //var oInput = $(this).parents('.date-dz-right').parents('.date-dz').siblings('.hf-con');
        var fhHtml = `<div class="hf-con pull-left"> 
      <div>回复@${fhName}</div>
      <textarea class="content comment-input hf-input reply" placeholder="">
      </textarea> <a href="javascript:;" class="hf-pl">评论</a>
      </div>`
        if (!commenttime2) {
          var target = _.find(that.commentarray, { time: commenttime1 })
          that.target = target
          Object.assign(that.replyinfo, {
            [`${that.type}_id`]: that.item._id,
            user_id: that.profile._id,
            user_avatar: that.profile.user_avatar,
            user_name: that.profile.user_name,
            comment_id: target._id,
            reply_user_id: target.user_id,
            reply_user_avatar: target.user_avatar,
            reply_user_name: target.user_name
          })
        }
        if (commenttime2) {
          var targetcomment = _.find(that.commentarray, { time: commenttime2 })
          var targetreply = _.find(targetcomment.comment_reply, {
            time: commenttime1
          })
          that.target = targetcomment
          Object.assign(that.replyinfo, {
            [`${that.type}_id`]: that.item._id,
            user_id: that.profile._id,
            user_avatar: that.profile.user_avatar,
            user_name: that.profile.user_name,
            comment_id: targetcomment._id,
            reply_user_id: targetreply.user_id,
            reply_user_avatar: targetreply.user_avatar,
            reply_user_name: targetreply.user_name
          })
        }

        //显示回复
        if ($(this).is('.hf-con-block')) {
          $(this)
            .parents('.date-dz-right')
            .parents('.date-dz')
            .append(fhHtml)
          $(this).removeClass('hf-con-block')
          $(this)
            .parents('.date-dz-right')
            .siblings('.hf-con')
            .find('.pre')
            .css('padding', '6px 15px')
          //console.log($(this).parents('.date-dz-right').siblings('.hf-con').find('.pre'))
          //input框自动聚焦
          $(this)
            .parents('.date-dz-right')
            .siblings('.hf-con')
            .find('.hf-input')
            .val('')
            .focus()
            .val()
        } else {
          $(this).addClass('hf-con-block')
          $(this)
            .parents('.date-dz-right')
            .siblings('.hf-con')
            .remove()
        }
        $('textarea').autoHeight()
      } else {
        that.$router.push('/userLogin')
      }
    })
    $('.comment-show').on('click', '.hf-pl', function() {
      var oThis = $(this)
      var now = that.getTime()
      //获取输入内容
      var oHfVal = $(this)
        .siblings('.hf-input')
        .val()
      var oAllVal = '回复@' + that.fhName
      if (oHfVal.replace(/(^\s*)|(\s*$)/g, '') == '') {
      } else {
        if (that.type == 'article') {
          var apiname = 'article'
          var senfunc = 'article'
          var commentname = 'Article'
        }
        if (that.type == 'message') {
          var apiname = 'message'
          var senfunc = 'message'
          var commentname = 'Message'
        }
        Object.assign(that[`${commentname}CommentReply`], that.replyinfo)
        Object.assign(that[`${commentname}CommentReply`], {
          content: oHfVal,
          time: now
        })
        api[`${apiname}`]
          [`${senfunc}Reply`](that[`${commentname}CommentReply`])
          .then(result => {
            let { data: { code, reply, message } } = result
            if (code == 200) {
              that.target.comment_reply.push(reply)
            }
          })
        var oAt = ''
        oAt = `回复<a href="javascript:;" class="atName">@${that.fhName}</a> : ${oHfVal}`
        var oHtml = assist.reply(
          that.profile.user_avatar,
          that.profile.user_name,
          oAt,
          now
        )
        oThis
          .parents('.hf-con')
          .parents('.comment-show-con-list')
          .find('.hf-list-con')
          .css('display', 'block')
          .prepend(oHtml) &&
          oThis
            .parents('.hf-con')
            .siblings('.date-dz-right')
            .find('.pl-hf')
            .addClass('hf-con-block') &&
          oThis.parents('.hf-con').remove()
      }
    })
    // 点赞
    $('.comment-show').on('click', '.date-dz-z', function() {
      if (that.loggedIn) {
        var zNum = $(this)
          .find('.z-num')
          .html()
        var commenttime = $(this)
          .parents('.date-dz-right')
          .siblings('.comment-time')
          .html()
        var target = _.find(that.commentarray, { time: commenttime })
        if (that.type == 'article') {
          var likename = 'Article'
          var apiname = 'article'
        }
        if (that.type == 'message') {
          var likename = 'Message'
          var apiname = 'message'
        }
        if (that.type == 'image') {
          var likename = 'Image'
          var apiname = 'album'
        }
        if ($(this).is('.date-dz-z-click')) {
          api[`${apiname}`]
            .commentLikeCancel({
              comment_id: target._id,
              user_id: that.profile._id
            })
            .then(result => {
              let { data: { code, message } } = result
              if (code == 200) {
                zNum--
                $(this).removeClass('date-dz-z-click red')
                $(this)
                  .find('.z-num')
                  .html(zNum)
                $(this)
                  .find('.date-dz-z-click-red')
                  .removeClass('red')
              }
            })
        } else {
          Object.assign(that[`${likename}CommentLike`], {
            [`${that.type}_id`]: that.item._id,
            user_id: that.profile._id,
            comment_id: target._id,
            target_id: target.user_id
          })
          //console.log(that[`${likename}CommentLike`]);
          api[`${apiname}`]
            .commentLike(that[`${likename}CommentLike`])
            .then(result => {
              let { data: { code, message } } = result
              if (code == 200) {
                zNum++
                $(this).addClass('date-dz-z-click')
                $(this)
                  .find('.z-num')
                  .html(zNum)
                $(this)
                  .find('.date-dz-z-click-red')
                  .addClass('red')
              }
            })
        }
      }
    })
    $('.comment-show').on('keyup paste', '.reply', function(e) {
      var elem = $(this)
      var len = elem.val().length
      if (len > 139) {
        e.preventDefault && e.preventDefault()
        elem.val(elem.val().substring(0, 140))
      } else {
        setTimeout(function() {
          var len = elem.val().length
          if (len > 139) {
            elem.val(elem.val().substring(0, 140))
          }
        }, 100)
      }
    })
  }
}
</script>


<style lang="scss" src="./lib/comment.scss"></style>
<style lang="scss" src="./lib/style.scss"></style>
<style lang="scss" src="./comments.scss"></style>
