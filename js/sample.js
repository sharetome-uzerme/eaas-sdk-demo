$(function () {

  /**
   * EaaS Server + EaaS UI部署的访问路径，按实际部署情况进行配置
   */
  var __EAAS_HOST = 'https://demo.uzer.me';  // EaaS 服务器地址
  var __BIZ_HOST = 'https://demo.uzer.me';   // 业务系统地址（可以写自己的地址）
  
  var __OPEN_APP_URL = __BIZ_HOST + '/eaas-demo/api/session/app';   // 打开应用URL（可自定义）
  var __OPEN_FILE_URL= __BIZ_HOST + '/eaas-demo/api/session/file';  // 打开文件URL（可自定义）
  
  var __EAAS_FAKE_INFO = {
	userNickname : 'EaaS试用',    // 业务系统中的用户名称
	userToken : 'userToken'       // 替换成业务系统 令牌
  };

  $(document).ready(
  );

  /**
	启动编辑会话， 参数可以通过页面逻辑进行设置
  */
  $('#btn-start').click(function () {
    var appId = 'APP00001';  // 要打开的应用ID（EaaS 分配的APP）
    var userId = 'eaas-sdk'; // 自己系统中的用户ID
    var dfsMode = false;  // DFS 模式

    var fileId = $('#fileid').val();
    var fileName = $('#fileName').val();
    var readonly = $('#filereadonly').is(':checked');

    var qs = {
      appId: appId,
	  dfsMode: dfsMode,
	  userId: userId
    };

	var url = __OPEN_APP_URL;
    if (fileId) {
      url = __OPEN_FILE_URL;
      qs.dfsMode = dfsMode;
      qs.fileId = fileId;
      qs.readOnly = readonly;
      qs.fileName = fileName;    
    }
	
    $.ajax({
      type: "POST",
      url: url,
      dataType: 'json',
      data: JSON.stringify(qs),
      headers: {
        "Authorization": 'Bearer ' + __EAAS_FAKE_INFO.userToken,
        "content-type": 'application/json'
      }
    }).done(function (json) {
      if (json.success) {
        var info = json.data;

		// 数据格式固定， EaaS必须参数
        var params = JSON.stringify({
          "isParticipantMode": false,
          "readOnly": info.readOnly,
          "sessionId": info.sessionId,
          "correlatedSessionId": info.correlatedSessionId,
          "gwHost": info.gwHost,
          "gwPort": info.gwPort,
          "mcuUrl": info.mcuUrl,
          "sessionMgrUrl": info.sessionMgrUrl,
          "clientId": info.clientId,
          "clientToken": info.token,
          "userId": userId,
          "userNickname": __EAAS_FAKE_INFO.userNickname,
          "userToken": __EAAS_FAKE_INFO.userToken
        });

        console.log('>>>>>>>>>>', params);

        var code = (Base64.encode(params) + "").replace(/\//g, '_');  // 将服务器返回的数据通过Base64进行编码，作为参数传递给EaaS服务器
        var eaas = __EAAS_HOST + '/eaas/workspace/' + code;    // 组装打开在线应用访问地址，访问EaaS服务器

        window.location.replace(eaas);
      } else {
        alert("[" + json.errorCode + "] " + json.message);  // 失败时，弹出错误提示，可以自定义显示方式
      }
    }).fail(function (res) {   // 失败时，弹出错误提示，可以自定义显示方式
      var json = JSON.parse(res.responseText);
      alert("[" + json.errorCode + "] " + json.message);
    });
  });
});
