/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useInvolvList } from "../../../Common/InvolvListContext"
import { InvolveUrlField} from "../../../Common/InvolveUrlField"
import styles from './HelpdeskTickets.module.scss';

interface AddTicketProps {
    onCancel: () => void; // Callback to cancel editing
}

export const AddTicket: React.FunctionComponent<AddTicketProps> = (props) => {
    const { addItem, getCurrentUser } = useInvolvList();
    
   
    const [formData, setFormData] = useState({
        Title: "",
        Description: "",
        Priority: "Normal",
        Status: "New",
        Assignedto0Id: null,
        DateReported: new Date().toISOString(),
        IssueSource: { Url: "", Description: "" },
    });

    useEffect(() => {
        getCurrentUser().then((currentUser:any) => {
            setFormData({ ...formData, ["Assignedto0Id"]: currentUser.Id });
        }).catch((error:any) => {
            console.error(error);
        });

    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) :void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUrlFieldChange = (updatedValue: { Url: string; Description: string }) :void => {
        setFormData({ ...formData, IssueSource: updatedValue });
    };

    const handleSubmit = async (e:any):Promise<void> => {
        e.preventDefault();
        await addItem(formData);
        props.onCancel();
    };


    return (
        <div className={styles.AddTicketContainer} >
        <form>
            <div className={styles.frmRow}>
                <label>Title</label>
                <input
                    type="text"
                    name="Title"
                    placeholder="Title"
                    value={formData.Title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div  className={styles.frmRow}>
                <label>Description</label>
                    <textarea
                    rows={7} maxLength={500}
                    name="Description"
                    placeholder="Description"
                    value={formData.Description}
                    onChange={handleChange}
                    required
                />
                </div>

            <div className={styles.frmRow}>
                <label>Priority</label>
                <select name="Priority" value={formData.Priority} onChange={handleChange}>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            <div className={styles.frmRow}>
                <label>Status</label>
                <select name="Status" value={formData.Status} onChange={handleChange}>
                    <option value="New">New</option>
                    <option value="In progress">In progress</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Completed">Completed</option>
                    <option value="Duplicate">Duplicate</option>
                </select>
                </div>
                <div>
                    <label>Issue Source</label>
                    <InvolveUrlField  onChange={handleUrlFieldChange} UrlValue={formData.IssueSource} />
                </div>
                <div className={styles.btnRow}>
                <button onClick={(e) => handleSubmit(e)} >Add Ticket</button>
                <button onClick={(e) => props.onCancel()} >Cancel</button>
                </div>
            </form>

        </div>
    )


}