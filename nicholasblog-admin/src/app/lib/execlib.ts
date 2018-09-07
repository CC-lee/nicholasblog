import wholeSet from '../../../wholeConfAdmin'; // 打包时
//import * as wholeSet from '../../../../wholeset'; //运行时
declare function require(name: string);
//var ProxyListener = require("./proxylistener.min")
import ProxyListener from 'proxylistenerjs/proxylistener.min';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { defer } from 'rxjs/observable/defer';
import { concatMap, toArray, scan } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import * as _ from 'lodash';

var pListener = new ProxyListener()
var proxyListen = pListener.proxyListen
var frontSet = wholeSet.front,
  backSet = wholeSet.back,
  serverSet = wholeSet.server
interface Lib {
  uploadexec(execfn, resfn, errres, errfn): void;
  getexec(execfn, resfn, errres, errfn): void;
  deletexec(execfn, resfn, errres, errfn): void;
  ajaxexec(page: string): any;
  observeListen(obj, address): any;
  proxyListen(obj, address, funSet?: any, propSet?: any): any;
  apiName: string;
  filePrefix: string;
  host: string;
  hostFrontMainPath: string;
  hostBackMainPath: string;
  assetsName: string;
  urlMiddlePrefix: string;
  tokenName: string;
  backMiddle: string;
  serverPrefix: string;
}

interface Set {
  frontHost: string;
  serverHost: string;
  file: string;
  frontMiddle: string;
  backMiddle: string;
  api: string;
  token: string;
}

var set: Set = {
  frontHost: frontSet.host,
  serverHost: serverSet.hostFile,
  file: serverSet.file,
  frontMiddle: frontSet.middle,
  backMiddle: backSet.middle,
  api: serverSet.api,
  token: backSet.token
}

function setting(setObject: Set) {
  var urlMiddlePrefix;
  var assetsName;
  var { frontHost, serverHost, file, frontMiddle, backMiddle, api, token } = setObject
  if (backMiddle && backMiddle !== 'back') {
    urlMiddlePrefix = `/${backMiddle}/`
    frontMiddle = `/${frontMiddle}`
  } else {
    urlMiddlePrefix = '/back/'
    frontMiddle = ''
    token = ''
    api = 'api'
  }

  assetsName = `assets${backSet.middleAsset}/`

  return {
    urlMiddlePrefix: urlMiddlePrefix,
    apiName: `/${api}/`,
    host: `http://${frontHost}/`,
    hostFrontMainPath: `http://${frontHost}${frontMiddle}/`,
    hostBackMainPath: `http://${frontHost}${urlMiddlePrefix}pages`,
    filePrefix: `http://${serverHost}/${file}/`,
    serverPrefix: `http://${serverHost}/`,
    assetsName: assetsName,
    tokenName: `${token}jwt`,
    backMiddle
  }
}


var baseSet = setting(set)

var {
  urlMiddlePrefix,
  apiName,
  host,
  hostFrontMainPath,
  hostBackMainPath,
  filePrefix,
  assetsName,
  tokenName,
  backMiddle,
  serverPrefix
} = baseSet


var execLib = function () {
  function uploadexec(execfn, resfn, errres, errfn) {
    var that = this
    execfn.subscribe(
      res => {
        if (res.code == 200) {
          if (resfn) {
            resfn.call(that, res);
          }
          if (res.message) {
            alert(res.message);
          }
        } else {
          alert(res.message);
          if (errres) {
            errres.call(that, res)
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

  function getexec(execfn, resfn, errres, errfn) {
    var that = this;
    execfn.subscribe(
      res => {
        if (res.code == 200) {
          if (resfn) {
            resfn.call(that, res);
          }
          if (res.message) {
            console.log(res.message);
          }
        } else {
          alert(res.message);
          if (errres) {
            errres.call(that, res)
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

  function deletexec(execfn, resfn, errres, errfn) {
    var that = this;
    execfn.subscribe(
      res => {
        if (res.code == 200) {
          if (resfn) {
            resfn.call(that, res);
          }
          if (res.message) {
            console.log(res.message);
          }
        } else {
          alert(res.message)
          if (errres) {
            errres.call(that, res)
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

  function ajaxexec(page) {
    return function (address, param) {
      if (param) {
        return function (param): Observable<any> {
          return this.http.post(`${apiName}${page}/${address}`, param, this.auth.headerSet()).map(res => res.json());
        }.call(this, param)
      } else {
        return function (): Observable<any> {
          return this.http.get(`${apiName}${page}/${address}`, this.auth.headerSet()).map(res => res.json());
        }.call(this)
      }
    }
  }

  function observeListen(obj, address): any {
    var setObs,
      getObs
    var ars = address.split('/')
    var string = ars[ars.length - 1]
    while (ars.length - 1) {
      obj = obj[ars.shift()];
    }
    var value = obj[string]

    if (typeof value === 'function') {
      // 更改 getObs
      var getObs$ = new Subject()
      getObs = getObs$
    } else {
      // 更改 setObs
      var setObs$ = new Subject()
      setObs = setObs$.pipe(
        scan((acc, curr) => {
          if (acc['oldValue']) {
            return Object.assign(
              { oldValue: acc['newValue'] },
              { newValue: curr }
            );
          } else {
            return Object.assign({}, { oldValue: acc }, { newValue: curr });
          }
        }, {})
      )
    }
    var bind = {};
    var handler = {
      get: function () {
        if (getObs) {
          getObs.next(undefined)
        }
        if (bind[`_${string}`]) {
          return bind[`_${string}`]
        } else {
          return value
        }
      },
      set: function (val) {
        bind[`_${string}`] = val;
        if (setObs) {
          setObs.next(val)
        }
      }
    }
    Object.defineProperty(obj, string, handler)
    if (setObs) {
      return setObs
    } else {
      return getObs
    }
  }



  var ExecLib: Lib = {
    uploadexec,
    getexec,
    deletexec,
    ajaxexec,
    observeListen,
    proxyListen,
    apiName,
    filePrefix,
    host,
    hostFrontMainPath,
    hostBackMainPath,
    assetsName,
    urlMiddlePrefix,
    tokenName,
    backMiddle,
    serverPrefix
  }
  return ExecLib
}()

export { execLib }