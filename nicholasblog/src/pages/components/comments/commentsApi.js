function getTime() {
  var myDate = new Date();
  //获取当前年
  var year = myDate.getFullYear();
  //获取当前月
  var month = myDate.getMonth() + 1;
  //获取当前日
  var date = myDate.getDate();
  var h = myDate.getHours(); //获取当前小时数(0-23)
  if (h < 10) {
    h = `0${h}`
  }
  var m = myDate.getMinutes(); //获取当前分钟数(0-59)
  if (m < 10) m = "0" + m;
  var s = myDate.getSeconds();
  if (s < 10) s = "0" + s;
  var now = year + "-" + month + "-" + date + " " + h + ":" + m + ":" + s;
  return now;
}

function sendcomment(avatar, name, content, time) {
  var oHtml = `<div class="comment-show-con clearfix">
  <div class="comment-show-con-img pull-left">
    <img src="${avatar}" alt="" width="50" height="50">
  </div>
  <div class="comment-show-con-list pull-left clearfix">
    <div class="pl-text clearfix">
      <a href="javascript:;" class="comment-size-name">${name} : </a>
      <span class="my-pl-con">&nbsp;${content}</span>
    </div>
    <div class="date-dz">
      <span class="date-dz-left pull-left comment-time">${time}</span>
      <div class="date-dz-right pull-right comment-pl-block">
        <a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a>
        <span class="pull-left date-dz-line">|</span>
        <a href="javascript:;" class="date-dz-z pull-left">
        <i class="date-dz-z-click-red"></i>赞 (
        <i class="z-num">0 </i> )</a>
      </div>
    </div>
    <div class="hf-list-con"></div>
  </div>
  </div>
  `;
  return oHtml
}

function comment(avatar, name, content, like_num, time, like_status) {
  var likestyle = ''
  if (like_status == true) {
    likestyle = `
    <a href="javascript:;" class="date-dz-z pull-left date-dz-z-click">
    <i class="date-dz-z-click-red red"></i>赞 (
    <i class="z-num">${like_num} </i> )</a>
    `
  } else {
    likestyle = `
    <a href="javascript:;" class="date-dz-z pull-left">
    <i class="date-dz-z-click-red"></i>赞 (
    <i class="z-num">${like_num} </i> )</a>
    `
  }
  var oHtml = `<div class="comment-show-con clearfix">
  <div class="comment-show-con-img pull-left">
    <img src="${avatar}" alt="" width="50" height="50">
  </div>
  <div class="comment-show-con-list pull-left clearfix">
    <div class="pl-text clearfix">
      <a href="javascript:;" class="comment-size-name">${name} : </a>
      <span class="my-pl-con">&nbsp;${content}</span>
    </div>
    <div class="date-dz">
      <span class="date-dz-left pull-left comment-time">${time}</span>
      <div class="date-dz-right pull-right comment-pl-block">
        <a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a>
        <span class="pull-left date-dz-line">|</span>
        ${likestyle}
      </div>
    </div>
    <div class="hf-list-con"></div>
  </div>
  </div>
  `;
  return oHtml
}

function sendimagecomment(avatar, name, content, time) {
  var oHtml = `<div class="comment-show-con clearfix">
  <div class="comment-show-con-img pull-left">
    <img src="${avatar}" alt="" width="50" height="50">
  </div>
  <div class="comment-show-con-list pull-left clearfix">
    <div class="pl-text clearfix">
      <a href="javascript:;" class="comment-size-name">${name} : </a>
      <span class="my-pl-con">&nbsp;${content}</span>
    </div>
    <div class="date-dz">
      <span class="date-dz-left pull-left comment-time">${time}</span>
      <div class="date-dz-right pull-right comment-pl-block">
        <a href="javascript:;" class="date-dz-z pull-left">
          <i class="date-dz-z-click-red"></i>赞 (
          <i class="z-num">0 </i> )</a>
      </div>
    </div>
  </div>
  </div>
  `;
  return oHtml
}

function imagecomment(avatar, name, content, like_num, time, like_status) {
  var likestyle = ''
  if (like_status == true) {
    likestyle = `
    <a href="javascript:;" class="date-dz-z pull-left date-dz-z-click">
    <i class="date-dz-z-click-red red"></i>赞 (
    <i class="z-num">${like_num} </i> )</a>
    `
  } else {
    likestyle = `
    <a href="javascript:;" class="date-dz-z pull-left">
    <i class="date-dz-z-click-red"></i>赞 (
    <i class="z-num">${like_num} </i> )</a>
    `
  }
  var oHtml = `<div class="comment-show-con clearfix">
  <div class="comment-show-con-img pull-left">
    <img src="${avatar}" alt="" width="50" height="50">
  </div>
  <div class="comment-show-con-list pull-left clearfix">
    <div class="pl-text clearfix">
      <a href="javascript:;" class="comment-size-name">${name} : </a>
      <span class="my-pl-con">&nbsp;${content}</span>
    </div>
    <div class="date-dz">
      <span class="date-dz-left pull-left comment-time">${time}</span>
      <div class="date-dz-right pull-right comment-pl-block">
        ${likestyle}
      </div>
    </div>
  </div>
  </div>
  `;
  return oHtml
}

function reply(avatar, name, content, time) {
  var oHtml = `<div class="all-pl-con">
    <div class="comment-show-con-img pull-left">
    <img src="${avatar}" alt="" width="50" height="50">
    </div>
    <div style="margin-left:60px">
    <div class="pl-text hfpl-text clearfix">
      <a href="javascript:;" class="comment-size-name">${name} : </a>
      <span class="my-pl-con">${content}</span>
    </div>
    <div class="date-dz"> 
      <span class="date-dz-left pull-left comment-time">${time}</span> 
    <div class="date-dz-right pull-right comment-pl-block"> 
      <a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a> 
    </div> 
    </div>
  </div>
  </div>`;
  return oHtml
}

function commentreply(avatar, name, content, like_num, time, comment_reply, like_status) {
  var likestyle = ''
  if (like_status == true) {
    likestyle = `
    <a href="javascript:;" class="date-dz-z pull-left date-dz-z-click">
    <i class="date-dz-z-click-red red"></i>赞 (
    <i class="z-num">${like_num} </i> )</a>
    `
  } else {
    likestyle = `
    <a href="javascript:;" class="date-dz-z pull-left">
    <i class="date-dz-z-click-red"></i>赞 (
    <i class="z-num">${like_num} </i> )</a>
    `
  }
  var oHtml = `<div class="comment-show-con clearfix">
  <div class="comment-show-con-img pull-left">
    <img src="${avatar}" alt="" width="50" height="50">
  </div>
  <div class="comment-show-con-list pull-left clearfix">
    <div class="pl-text clearfix">
      <a href="javascript:;" class="comment-size-name">${name} : </a>
      <span class="my-pl-con">&nbsp;${content}</span>
    </div>
    <div class="date-dz">
      <span class="date-dz-left pull-left comment-time">${time}</span>
      <div class="date-dz-right pull-right comment-pl-block">
      <a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a>
      <span class="pull-left date-dz-line">|</span>
        ${likestyle}
      </div>
    </div>
    <div class="hf-list-con">
     ${getReply(comment_reply)}
    </div>
  </div>
  </div>
  `;
  return oHtml
}

function getComments(array, type) {
  var commenthtml = ''
  if (type == 'image') {
    for (var i = 0; i < array.length; i++) {
      commenthtml = commenthtml + imagecomment(array[i].user_avatar, array[i].user_name, array[i].content, array[i].like_num, array[i].time, array[i].like_status)
    }
  } else {
    for (var i = 0; i < array.length; i++) {
      if (array[i].comment_reply.length == 0) {
        commenthtml = commenthtml + comment(array[i].user_avatar, array[i].user_name, array[i].content, array[i].like_num, array[i].time, array[i].like_status)
      } else {
        commenthtml = commenthtml + commentreply(array[i].user_avatar, array[i].user_name, array[i].content, array[i].like_num, array[i].time, array[i].comment_reply, array[i].like_status)
      }
    }
  }
  return commenthtml
}

function getReply(array) {
  var replyhtml = ''
  for (var i = 0; i < array.length; i++) {
    var oAt = `回复<a href="javascript:;" class="atName">@${array[i].reply_user_name}</a> : ${array[i].content}`;
    replyhtml = replyhtml + reply(array[i].user_avatar, array[i].user_name, oAt, array[i].time)
  }
  return replyhtml
}


export default {
  getTime,
  sendcomment,
  sendimagecomment,
  comment,
  imagecomment,
  reply,
  getComments
}