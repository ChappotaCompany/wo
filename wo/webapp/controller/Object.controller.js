sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/core/Fragment',

], function (BaseController, JSONModel, History, formatter,
    Filter, FilterOperator, MessageToast, MessageBox, Fragment) {
    "use strict";
    //var ResetAllMode = mlibrary.ResetAllMode;
    return BaseController.extend("com.chappota.wo.wo.controller.Object", {

        formatter: formatter,
        
        /* =========================================================== */
        /* lifecycle methods     - On Init                             */
        /* =========================================================== */
        onInit: function () {
       
           

        },
  
        onValueHelpRequest : function(oEvent){
            this.inputid = oEvent.getSource().getId().split("-").pop();
//             this.flag=0;
//             if(this.byId("projmngrextid").getValue === inputid) this.flag=1;
//             if(this.byId("projaccextid").getValue === inputid) this.flag=1;
//             if(this.byId("projctrnlextid").getValue === inputid) this.flag=1;
//             if(this.byId("projpartid").getValue === inputid) this.flag=1;

// debugger;

            if (!this.bpfrag) {
                this.bpfrag = this.loadFragment({
                    name: "com.chappota.wo.wo.fragments.S2_BusinessPartner"
                });
            } 
          
            
            var custodata = this.getOwnerComponent().getModel("customerMDL");
            var bpc = new Filter('BusinessPartnerCategory',FilterOperator.EQ,"1");
            var pn = new Filter('PersonNumber',FilterOperator.NE,'');
            sap.ui.core.BusyIndicator.show(0);
            custodata.read("/A_BusinessPartner", {
                filters: [new Filter([bpc,pn],true)],
                urlParameters: {
                    $select: 'BusinessPartner,PersonNumber,BusinessPartnerFullName',
                   $top : 100
                },
                success: (odata) => {

                    var custodatajson = new JSONModel();
                    custodatajson.setSizeLimit(odata.results.length);

                    custodatajson.setData(odata.results);
                    this.getView().setModel(custodatajson, "s3");
                    sap.ui.core.BusyIndicator.hide();
                    this.bpfrag.then(function(oDialogbp) {
                        oDialogbp.open();
                    });
                },
                error: (msg) => {
                    sap.ui.core.BusyIndicator.hide();
                    MessageToast.show("Error");

                }
            });
               

        },
        _closeBPfrag : function(){
            this.bpfrag.then(function(oDialogbp) {
                oDialogbp.close();
            });
        },
        _bptablerowselect : function(oEvent){
            debugger;
            var oSelectedItem = oEvent.getSource().getBindingContext("s3").getProperty("BusinessPartner");
			

			if (!oSelectedItem) {
				return;
			}
          
			this.byId(this.inputid).setValue(oSelectedItem);
            this._closeBPfrag();
        },
        

        _saveandsubmit : function(){
            var conf = this.byId("conf").getSelected();
            var confval;
                if(conf) confval="Y";else confval="N";
            var rtp = this.byId("restimepsting").getSelected();
            var rtpval;
            if(rtp) rtpval="Y";else rtpval="N"
            var wocreatepayload = {
                "ProjectID": this.byId("projid").getValue(),
                "ProjectName": this.byId("projname").getValue(),
                "ProjectStage": this.byId("projstg").getSelectedKey(),
                "OrgID": this.byId("orgid").getValue(),
                "ProjectCategory":this.byId("projcat").getValue(),
                "Currency": this.byId("curr").getValue(),
                "StartDate": this.formatter.dateTimebackendwithtime(this.byId("sdate").getValue()),
                "EndDate": this.formatter.dateTimebackendwithtime(this.byId("edate").getValue()),
               
                "ProjManagerExtId": this.byId("projmngrextid").getValue(),
                "Customer": this.byId("cust").getValue(),
               
                "CostCenter": this.byId("ccenter").getValue(),
                "ProfitCenter":this.byId("ptcenter").getValue(),
                "ProjAccountantExtId": this.byId("projaccextid").getValue(),
                "ProjControllerExtId": this.byId("projctrnlextid").getValue(),
                "ProjPartnerExtId": this.byId("projpartid").getValue(),
                "ProjectDesc": this.byId("projdesc").getValue(),
                "Confidential": confval,
                "RestrictTimePosting": rtpval 
               };
               
               debugger;
            sap.ui.core.BusyIndicator.show(0);
            var wocreate = this.getOwnerComponent().getModel("woMDL");
            wocreate.create("/ProjectSet",wocreatepayload,{
                success : function(odata){
                    sap.ui.core.BusyIndicator.hide();
                    debugger;
                      //this.getRouter().navTo("worklist", {}, true);
                    MessageToast.show("Work Order Created");
            
                }.bind(this),
                error : function(msg){
                    debugger;
                    sap.ui.core.BusyIndicator.hide();
                }
            });


            



        },
        _cancel : function(){
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("worklist", {}, true);
            }
        },
      
        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        _onInit: function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "objectView");
        },
       
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */


        /**
         * Event handler  for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the worklist route.
         * @public
         */
        onNavBack: function () {
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("worklist", {}, true);
            }
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched: function (oEvent) {
            var sObjectId = oEvent.getParameter("arguments").objectId;
            this._bindView("/ProjectSet" + sObjectId);
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView: function (sObjectPath) {
            var oViewModel = this.getModel("objectView");

            this.getView().bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    }
                }
            });
        },

        _onBindingChange: function () {
            var oView = this.getView(),
                oViewModel = this.getModel("objectView"),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }

            var oResourceBundle = this.getResourceBundle(),
                oObject = oView.getBindingContext().getObject(),
                sObjectId = oObject.CostCenter,
                sObjectName = oObject.ProjectSet;

            oViewModel.setProperty("/busy", false);
            oViewModel.setProperty("/shareSendEmailSubject",
                oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
            oViewModel.setProperty("/shareSendEmailMessage",
                oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        }
    });

});
