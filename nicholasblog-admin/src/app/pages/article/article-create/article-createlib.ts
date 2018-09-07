interface Lib {
  previewtext(): void;
}

var articleCreateLib = function () {
  function previewtext() {
    var preview = ''
    if (this.article.content) {
      preview = this.article.content
        .match(/<p(.*?)>([\s\S]*?)<\/p>/g).join('')
        .replace(/(<([^>]+)>)/ig, '')
        .replace(/[ ]|[&nbsp;]/ig, '')
        .substring(0, 101);
    }
    return preview
  }
  var ArticleCreateLib: Lib = {
    previewtext
  }
  return ArticleCreateLib
}()

export { articleCreateLib }


interface Info {
  title: string;
  article_id: string;
  classify: string;
  like_num: number;
  comment_num: number;
}

interface Preview {
  article_id: string;
  title: string;
  article_preview: string;
  theme_img: string;
  classify: string;
  like_num: number;
  like_status: boolean;
  comment_num: number;
}

interface Article extends Preview, Info {
  dateid: string;
  _id: string;
  content: string;
}

export { Article }



