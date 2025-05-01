/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useInvolvList } from "../../../Common/InvolvListContext"
import styles from "./HelpdeskTickets.module.scss";
import { SearchBox } from '@fluentui/react/lib/SearchBox';



interface EditTicketProps {
    handleAdd: () => void; 
}

export const Header: React.FunctionComponent<EditTicketProps> = (props) => {
    const { onTitleSearch } = useInvolvList();

    const onSearchUpdate = async (event: React.ChangeEvent<HTMLInputElement> | undefined): Promise<void> => {
        if (event) {
            const newValue = event.target.value;
            if (!newValue) {
                onTitleSearch("");
            }
        }

    }

    return (
        <div className={styles.header}>
            <h2>Tickets</h2>
            <div className={styles.btnContainer}>
                <SearchBox
                    placeholder="Search by Title"
                    onSearch={newValue => onTitleSearch(newValue)}
                    onChange={(e) => onSearchUpdate(e)}
                    onClear={newValue => onTitleSearch("")}
                />
                <button onClick={() => props.handleAdd()}>Add</button>
            </div>

        </div>
    )


}