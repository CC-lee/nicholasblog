function uploadexec(execfn, resfn, errfn) {
  var that = this
  execfn.subscribe(
    res => {
      alert(res.message);
      if (res.code == 200) {
        resfn.call(that, res);
      }
    },
    err => {
      alert('后台错误');
      errfn.call(that, err);
    }
  );
}

interface Lib {
  uploadexec: any;
}

class ClassCreateLib implements Lib {
  uploadexec: any;
  constructor() {
    return {
      uploadexec
    }
  }
}

var classCreateLib = new ClassCreateLib()

export { classCreateLib } 