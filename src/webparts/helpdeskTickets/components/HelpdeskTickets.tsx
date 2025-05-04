import React, { useState } from "react";
import styles from './HelpdeskTickets.module.scss';
import { SPFI } from "@pnp/sp";
import { InvolvListProvider } from "../../../Common/InvolvListContext";
import { TicketsComponent } from "./TicketsComponent";
import { AddTicket } from './AddTicket'
import { EditTicket } from './EditTicket'
import { Header} from './Header'
import { Dialog, DialogType } from "@fluentui/react";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IHelpdeskTicketsProps {
    sp: SPFI;
    context:WebPartContext
}


export const HelpdeskTickets: React.FunctionComponent<IHelpdeskTicketsProps> = (props: IHelpdeskTicketsProps) => {
    const [view, setView] = useState<"view" | "add" | "edit">("view");
    const [editTicketId, setEditTicketId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
   

    const handleAdd = ():void => {
        setView("add");
        setIsDialogOpen(true);
    };

    const handleEdit = (ticketId: number):void => {
        setEditTicketId(ticketId);
        setView("edit");
    };
   

    const handleClose = ():void => {
        setIsDialogOpen(false);
        setView("view");
        setEditTicketId(null);
    };


    const dialogStyles = {
        main: {
            
            selectors: {
                ['@media (min-width: 480px)']: {
                    maxWidth: "900px",
                    width: "60%"
                }
            }
        },
    };


    return (
        <InvolvListProvider sp={props.sp} listName="Tickets" context={props.context} >
            
            {view === "view" &&
                <div className={styles.helpdeskTickets}>
                    <Header handleAdd={handleAdd} />
                    <TicketsComponent handleEdit={handleEdit} />
                </div>
            }

            {view === "edit" && editTicketId !== null && (
                <EditTicket ticketId={editTicketId} onCancel={handleClose} />
            )}

            {view === "add" &&
                <Dialog
                    hidden={!isDialogOpen}

                    onDismiss={handleClose}
                    dialogContentProps={{
                        type: DialogType.largeHeader,
                        title: view === "add" ? "Add Ticket" : "Edit Ticket",
                    }}
                    styles={dialogStyles}
                    modalProps={{
                        isBlocking: false,
                    }}
                >
                    <AddTicket onCancel={handleClose} />
                </Dialog>
            }

            
        </InvolvListProvider>
    )


}