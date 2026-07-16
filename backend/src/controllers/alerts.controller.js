import {getAlertsFromDatabase,getAlertFromDatabaseById,createAlertInDatabase,updateAlertInDatabase,deleteAlertFromDatabase} from "../services/alerts.service.js"


export const getAllAlerts = async (req, res) =>{

    const alerts = await getAlertsFromDatabase(); // This function should find all alerts from database
    if(alerts){
        res.status(200).json({
            Success: true,
            message: "Alerts found",
            data: alerts
        });
    } else {
        res.status(404).json({
            Success: false,
            message: "No alerts found"
        });
    }
}

export const getAlertById = (req, res) => {
    const { id } = req.params;
    const alert = getAlertFromDatabaseById(id); // This function should find an alert by its ID from database
    if(alert){
        res.status(200).json({
            "Success": true,
            "message": "Alert found",
            "data": alert
        });
    } else {
        res.status(404).json({ 
            "message": "Alert not found" });
    }
}

export const createAlert = (req, res) => {
    const newAlert = req.body;
    const createdAlert = createAlertInDatabase(newAlert); // This function should create a new alert in database
    res.status(201).json({
        "Success": true,
        "message": "Alert created",
        "data": createdAlert
    });
}

export const updateAlert = (req, res) => {
    const {id} = req.params

    const updatedAlertData = req.body;
    const updatedAlert = updateAlertInDatabase(id, updatedAlertData); // This function should update an existing alert in database
    if(updatedAlert){
        res.status(200).json({
            "Success": true,
            "message": "Alert updated",
            "data": updatedAlert
        });
    } else {
        res.status(404).json({ 
            "message": "Alert not found" });
    }
}

export const deleteAlert = (req, res) => {
    const { id } = req.params;
    const deletedAlert = deleteAlertFromDatabase(id); // This function should delete an alert by its ID from database
    if(deletedAlert){
        res.status(200).json({
            "Success": true,
            "message": "Alert deleted",
            "data": deletedAlert
        });
    } else {
        res.status(404).json({ 
            "message": "Alert not found" });
    }
}