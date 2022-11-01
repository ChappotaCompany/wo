/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/chappota/wo/wo/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});