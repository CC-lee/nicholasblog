function execute(execfn, resfn, errfn) {
  execfn().subscribe(
    res => {
      alert(res.message);
      resfn();
    },
    err => {
      alert('后台错误');
      errfn();
    }
  );
}


function getData() {
  this.service.getData().then((data) => {
    this.source.load(data);
  });
}

class ClassManageLib {
  getData: any
  constructor() {
    this.getData = getData
  }
}
var classManageLib = new ClassManageLib()

export { classManageLib }