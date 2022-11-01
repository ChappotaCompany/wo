sap.ui.define(['sap/ui/thirdparty/jquery'],
	function(jQuery) {
	"use strict";

	var DemoPersoService = {

		oData : {
			_persoSchemaVersion: "1.0",
			aColumns : [
                {
                    id: "demoApp-wiptable-emptyCol",
                    order: 0,
                    text: "",
                    visible: true
                },
                {
                    id: "demoApp-wiptable-changeindCol",
                    order: 0,
                    text: "Status",
                    visible: true
                },
				{
					id: "demoApp-wiptable-accountingCol",
					order: 1,
					text: "Accouting",
					visible: true
				},
				{
					id: "demoApp-wiptable-glaccountCol",
					order: 2,
					text: "GL Account",
					visible: true
				},
				{
					id: "demoApp-wiptable-refCol",
					order: 3,
					text: "Reference Document",
					visible: true
				},
				{
					id: "demoApp-wiptable-customerCol",
					order: 4,
					text: "Customer",
					visible: false
				},
				{
					id: "demoApp-wiptable-projCol",
					order: 5,
					text: "Project",
					visible: true
				},
                {
                    id: "demoApp-wiptable-unbilqtyCol",
                    order: 6,
                    text: "Unbilled Qty",
                    visible: true
                },
                {
                    id: "demoApp-wiptable-wrkpckCol",
                    order: 7,
                    text: "Work Package",
                    visible: true
                }, 
                {
                    id: "demoApp-wiptable-amountCol",
                    order: 8,
                    text: "Amount",
                    visible: true
                    
                }, 
                {
                    id: "demoApp-wiptable-acttypeCol",
                    order: 9,
                    text: "Activity Type",
                    visible: true
                }, 
                {
                    id: "demoApp-wiptable-prnrCol",
                    order: 10,
                    text: "Personel Number",
                    visible: true
                },
                 {
                    id: "demoApp-wiptable-servicedateCol",
                    order: 11,
                    text: "Service Rendered Date",
                    visible: true
                }, 
                {
                    id: "demoApp-wiptable-notesCol",
                    order: 12,
                    text: "Notes",
                    visible: true
                },
                {
                    id: "demoApp-wiptable-workitemCol",
                    order: 13,
                    text: "WorkItem",
                    visible: false                    
                }
			]
		},

		oResetData : {
			_persoSchemaVersion: "1.0",
			aColumns : [
                {
                    id: "demoApp-wiptable-emptyCol",
                    order: 0,
                    text: "",
                    visible: true
                },
                {
                    id: "demoApp-wiptable-changeindCol",
                    order: 0,
                    text: "Status",
                    visible: true
                },
				{
					id: "demoApp-wiptable-accountingCol",
					order: 1,
					text: "Accouting",
					visible: true
				},
				{
					id: "demoApp-wiptable-glaccountCol",
					order: 2,
					text: "GL Account",
					visible: true
				},
				{
					id: "demoApp-wiptable-refCol",
					order: 3,
					text: "Reference Document",
					visible: true
				},
				{
					id: "demoApp-wiptable-customerCol",
					order: 4,
					text: "Customer",
					visible: true
				},
				{
					id: "demoApp-wiptable-projCol",
					order: 5,
					text: "Project",
					visible: true
				},
                {
                    id: "demoApp-wiptable-unbilqtyCol",
                    order: 6,
                    text: "Unbilled Qty",
                    visible: true
                },
                {
                    id: "demoApp-wiptable-wrkpckCol",
                    order: 7,
                    text: "Work Package",
                    visible: true
                }, 
                {
                    id: "demoApp-wiptable-amountCol",
                    order: 8,
                    text: "Amount",
                    visible: true
                    
                }, 
                {
                    id: "demoApp-wiptable-acttypeCol",
                    order: 9,
                    text: "Activity Type",
                    visible: true
                }, 
                {
                    id: "demoApp-wiptable-prnrCol",
                    order: 10,
                    text: "Personel Number",
                    visible: true
                },
                 {
                    id: "demoApp-wiptable-servicedateCol",
                    order: 11,
                    text: "Service Rendered Date",
                    visible: true
                }, 
                {
                    id: "demoApp-wiptable-notesCol",
                    order: 12,
                    text: "Notes",
                    visible: true
                },
                {
                    id: "demoApp-wiptable-workitemCol",
                    order: 13,
                    text: "WorkItem",
                    visible: true                    
                }
			]
		},


		getPersData : function () {
			var oDeferred = new jQuery.Deferred();
			if (!this._oBundle) {
				this._oBundle = this.oData;
			}
			oDeferred.resolve(this._oBundle);
			// setTimeout(function() {
			// 	oDeferred.resolve(this._oBundle);
			// }.bind(this), 2000);
			return oDeferred.promise();
		},

		setPersData : function (oBundle) {
			var oDeferred = new jQuery.Deferred();
			this._oBundle = oBundle;
			oDeferred.resolve();
			return oDeferred.promise();
		},

		getResetPersData : function () {
			var oDeferred = new jQuery.Deferred();

			// oDeferred.resolve(this.oResetData);

			setTimeout(function() {
				oDeferred.resolve(this.oResetData);
			}.bind(this), 2000);

			return oDeferred.promise();
		},

		resetPersData : function () {
			var oDeferred = new jQuery.Deferred();

			//set personalization
			this._oBundle = this.oResetData;

			//reset personalization, i.e. display table as defined
			//this._oBundle = null;

			oDeferred.resolve();

			// setTimeout(function() {
			// 	this._oBundle = this.oResetData;
			// 	oDeferred.resolve();
			// }.bind(this), 2000);

			return oDeferred.promise();
		},

		//this caption callback will modify the TablePersoDialog' entry for the 'Weight' column
		//to 'Weight (Important!)', but will leave all other column names as they are.
		// getCaption : function (oColumn) {
		// 	if (oColumn.getHeader() && oColumn.getHeader().getText) {
		// 		if (oColumn.getHeader().getText() === "Weight") {
		// 			return "Weight (Important!)";
		// 		}
		// 	}
		// 	return null;
		// },

		// getGroup : function(oColumn) {
		// 	if ( oColumn.getId().indexOf('productCol') != -1 ||
		// 			oColumn.getId().indexOf('supplierCol') != -1) {
		// 		return "Primary Group";
		// 	}
		// 	return "Secondary Group";
		// }
	};

	return DemoPersoService;

});
