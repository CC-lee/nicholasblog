interface Lib {
  previewtext(): void;
}

var articleEditLib = function () {
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

  var ArticleEditLib: Lib = {
    previewtext
  }
  return ArticleEditLib
}()

export { articleEditLib }


interface Info {
  title: string;
  classify: string;
}

interface Preview {
  title: string;
  article_preview: string;
  theme_img: string;
  classify: string;
}

interface Article extends Preview, Info {
  objectId: string;
  dateid: string;
  _id: string;
  content: string;
}

export { Article }