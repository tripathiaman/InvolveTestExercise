/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useInvolvList } from "../../../Common/InvolvListContext"
import styles from './HelpdeskTickets.module.scss';
import { InvolveUrlField} from "../../../Common/InvolveUrlField"
//import { IPeoplePickerContext,PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";


interface EditTicketProps {
    ticketId: number;
    onCancel: () => void; // Callback to cancel editing
}

export const EditTicket: React.FunctionComponent<EditTicketProps> = (props) => {
    const { items,updateItem} = useInvolvList();
    const [formData, setFormData] = useState({
        Title: "",
        Description: "",
        Priority: "Normal",
        Status: "New",
        Assignedto0Id: null,
        DateReported: new Date().toISOString(),
        IssueSource: { Url: "", Description: "" },
    });

    //const peoplePickerContext: IPeoplePickerContext = getPeoplePickerContext();
    useEffect(() => {
        const ticket = items.find((t) => t.Id === props.ticketId);
        if (ticket) {
            setFormData({
                Title: ticket.Title,
                Description: ticket.Description,
                Priority: ticket.Priority,
                Status: ticket.Status,
                Assignedto0Id: ticket.Assignedto0?.Id,
                DateReported: ticket.DateReported,
                IssueSource: ticket.IssueSource || { Url: "", Description: "" },
            });
        }
    }, [props.ticketId, items]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUrlFieldChange = (updatedValue: { Url: string; Description: string }) :void => {
        setFormData({ ...formData, IssueSource: updatedValue });
    };

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        await updateItem(props.ticketId, formData);
        props.onCancel();
    };

    //const getPeoplePickerItems = (items: any[]):void => {
    //    console.log('Items:', items);
    //};

    return (
        <div className={styles.AddTicketContainer} >
            <form>
                <h2>Edit Ticket</h2>
                <div  className={styles.frmRow}>
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
                <div className={styles.frmRow}>
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
                <div>
                    
                    {/*<PeoplePicker*/}
                    {/*    context={peoplePickerContext}*/}
                    {/*    titleText="Assigned To"*/}
                    {/*    personSelectionLimit={1}*/}
                    {/*    showtooltip={true}*/}
                    {/*    searchTextLimit={5}*/}
                    {/*    onChange={getPeoplePickerItems}*/}
                    {/*    principalTypes={[PrincipalType.User]}*/}
                    {/*    resolveDelay={1000} />*/}
                </div>
                <div className={styles.btnRow}>
                    <button onClick={(e) => handleSubmit(e)} >Save Changes</button>
                    <button onClick={(e) => props.onCancel()} >Cancel</button>
                </div>
                
            </form>

        </div>
    )


}