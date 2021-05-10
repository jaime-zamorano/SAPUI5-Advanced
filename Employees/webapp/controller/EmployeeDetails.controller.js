// eslint-disable-next-line no-undef
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/Employees/model/formatter",
    "sap/m/MessageBox"
], function (Controller, formatter, MessageBox) {

    function onInit() {
        this._bus = sap.ui.getCore().getEventBus();
    };

    function onCreateIncidence() {

        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var index = odata.length;
        odata.push({ index: index + 1, _ValidateDate: false, EnableSave: false });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);

    };

    function onDeleteIncidence(oEvent) {
        // var tableIncidence = this.getView().byId("tableIncidence");
        //var rowIncidence= oEvent.getSource().getParent().getParent();
        //var incidenceModel= this.getView().getModel("incidenceModel");
        //var odata= incidenceModel.getData();
        //var contextObj= rowIncidence.getBindingContext("incidenceModel"); 

        //odata.splice(contextObj.index-1,1);
        //  for(var i in odata){

        // odata[i].index= parseInt(i)+ 1;

        // };

        // incidenceModel.refresh();
        // tableIncidence.removeContent(rowIncidence);

        //  for(var j in tableIncidence.getContent()){

        //  tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);
        // }

        var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();

        MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmDeleteIncidence"), {

            onClose: function (oAction) {
                if (oAction === "OK") {

                    this._bus.publish("incidence", "onDeleteIncidence", {
                        IncidenceId: contextObj.IncidenceId,
                        SapId: contextObj.SapId,
                        EmployeeId: contextObj.EmployeeId
                    });

                }

            }.bind(this)
        });


    };



    function onSaveIncidence(oEvent) {
        var incidence = oEvent.getSource().getParent().getParent();
        var incidenceRow = incidence.getBindingContext("incidenceModel");
        this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });

    };

    function updateIncidenceCreationDate(oEvent) {

        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();
        let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

        if (!oEvent.getSource().isValidValue()) {

            contextObj._ValidateDate = false;
            contextObj.CreateDateState = "Error";

            MessageBox.error(oResourceBundle.getText("errorCreationDateValue"), {
                title: "Error",
                onClose: null,
                styleClass: "",
                actions: MessageBox.Action.CLOSE,
                emphasizedAction: null,
                initialFocus: null,
                textDirection: sap.ui.core.TextDirection.Inherit
            })

        } else {
            contextObj.CreationDateX = true;
            contextObj._ValidateDate = true;
            contextObj.CreateDateState = "None";

        }

        if (oEvent.getSource().isValidValue() && contextObj.Reason) {
            contextObj.EnableSave = true;
        } else {
            contextObj.EnableSave = false;
        }

        context.getModel().refresh();


    };

    function updateIncidenceReason(oEvent) {

        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();

        if (oEvent.getSource().getValue()) {
            contextObj.ReasonX = true;
            contextObj.ReasonState = "None";
        } else {
            contextObj.ReasonState = "Error";
        }

        if (contextObj._ValidateDate && oEvent.getSource().getValue()) {
            contextObj.EnableSave = true;

        } else {
            contextObj.EnableSave = false;

        }

        context.getModel().refresh();

    };

    function updateIncidenceType(oEvent) {

        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();

        if (contextObj._ValidateDate && contextObj.Reason) {
            contextObj.EnableSave = true;

        } else {
            contextObj.EnableSave = false;

        }
        contextObj.TypeX = true;
        context.getModel().refresh();

    };

    var EmployeeDetails = Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {});
    EmployeeDetails.prototype.onInit = onInit;
    EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
    EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
    EmployeeDetails.prototype.onSaveIncidence = onSaveIncidence;

    EmployeeDetails.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
    EmployeeDetails.prototype.updateIncidenceReason = updateIncidenceReason;
    EmployeeDetails.prototype.updateIncidenceType = updateIncidenceType;

    EmployeeDetails.prototype.Formatter = formatter;

    return EmployeeDetails;

});