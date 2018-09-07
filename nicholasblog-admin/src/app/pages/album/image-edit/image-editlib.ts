interface Lib {
  uploadexec(execfn, resfn, errfn): void;
  getexec(execfn, resfn, errfn): void;
}

var imageEditLib = function () {
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
  var ImageEditLib: Lib = {
    uploadexec,
    getexec
  }
  return ImageEditLib
}()

export { imageEditLib }

interface Info {
  image_info: string;
}

interface Preview {
  image_preview: string;
}

interface Image extends Info, Preview {
  _id: string;
  image_content: string;
  text_content: string;
}

export { Image }