interface Lib {
  uploadexec(execfn, resfn, errfn): void;
  getexec(execfn, resfn, errfn): void;
  deletexec(execfn, resfn, errfn): void;
}

var imageCreateLib = function () {
  function uploadexec(execfn, resfn, errfn) {
    var that = this
    execfn.subscribe(
      res => {
        alert(res.message);
        if (res.code == 200) {
          if (resfn) {
            resfn.call(that, res);
          }
        }
      },
      err => {
        alert('后台错误');
        if (errfn) {
          errfn.call(that, err);
        }
      }
    );
  }
  function getexec(execfn, resfn, errfn): void {
    var that = this;
    execfn.subscribe(
      res => {
        if (res.code == 200) {
          if (resfn) {
            resfn.call(that, res);
          }
        } else {
          alert(res.message)
        }
      },
      err => {
        alert('后台错误');
        if (errfn) {
          errfn.call(that, err);
        }
      }
    );
  }
  function deletexec(execfn, resfn, errfn): void {
    var that = this;
    execfn.subscribe(
      res => {
        console.log(res.message);
        if (res.code == 200) {
          if (resfn) {
            resfn.call(that, res);
          }
        }
      },
      err => {
        alert('后台错误');
        if (errfn) {
          errfn.call(that, err);
        }
      }
    );
  }
  var ImageCreateLib: Lib = {
    uploadexec,
    getexec,
    deletexec
  }
  return ImageCreateLib
}()

export { imageCreateLib }

interface Info {
  image_info: string;
  comment_num: number;
  like_num: number;
}

interface Preview {
  image_preview: string;
  comment_num: number;
  like_num: number;
}

interface Image extends Info, Preview {
  _id: string;
  image_content: string;
  text_content: string;
  like_status: boolean;
}

export { Image }