sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"
], function (MockServer, JSONModel, Log) {
	"use strict";

	let _sAppPath = "sap/ui/demo/nav/",
		_sJsonFilesPath = _sAppPath + "localService/mockdata";

	return {

		init: function () {

			return new Promise(function(fnResolve, fnReject) {
				let sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
					oManifestModel = new JSONModel(sManifestUrl);

				oManifestModel.attachRequestCompleted(function () {
					let sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath),
						oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/employeeRemote"),
						sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri);

					// create
					let oMockServer = new MockServer({
						rootUri: oMainDataSource.uri
					});

					// configure
					MockServer.config({
						autoRespond: true,
						autoRespondAfter: 500
					});

					// simulate
					oMockServer.simulate(sMetadataUrl, {
						sMockdataBaseUrl: sJsonFilesUrl
					});

					// start
					oMockServer.start();

					Log.info("Running the app with mock data");
					fnResolve();
				});

				oManifestModel.attachRequestFailed(function () {
					let sError = "Failed to load application manifest";

					Log.error(sError);
					fnReject(new Error(sError));
				});
			});
		}
	};
});