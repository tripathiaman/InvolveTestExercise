import React, {useState} from "react";
import { useInvolvList } from "../../../Common/InvolvListContext"
import styles from './HelpdeskTickets.module.scss';
interface ViewTicketProps {
    handleEdit: (ticketId: number) => void; 
}
export const TicketsComponent: React.FunctionComponent<ViewTicketProps> = (props) => {
    
    const { items, onPreviousPage,onNextPage,rowlimit,onRowLimitChange,currentTickerPage,pageIdx} = useInvolvList();
    const [newRowLimit, setNewRowLimit] = useState(rowlimit);

    const handleEdit = async (itemId:number): Promise<void> => {
        if (itemId) {
            props.handleEdit(itemId);
        }
    };

    const ontxtRowLimitUpdate = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const newValue = event.target.value;
        if (newValue) {
            const newLimit = parseInt(newValue);
            setNewRowLimit(newLimit);
        }
              
    }


    return (
        <div>

        <div className={styles.tblContainer}>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Date Reported</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.Id}>
                            <td>{item.Title}</td>
                            <td>{item.Description}</td>
                            <td>{item.Priority}</td>
                            <td>{item.Status}</td>
                            <td>{new Date(item.DateReported).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleEdit(item.Id)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <div className={styles.pagingContainer}>
                <div>
                    <input type="number"
                        placeholder="Row Limit"
                        value={newRowLimit.toString()}
                        onChange={(e) => ontxtRowLimitUpdate(e)}
                    />                
                    <button onClick={() => onRowLimitChange(newRowLimit)} >Change Row Limit</button>
                </div>
                <div>
                    <button className={pageIdx === 0? styles.disabled : "" } onClick={() => onPreviousPage()} disabled={pageIdx === 0} >Previous</button>
                    <button className={currentTickerPage && currentTickerPage.hasNext ? "" :  styles.disabled } onClick={() => onNextPage()} disabled={!(currentTickerPage && currentTickerPage.hasNext)} >Next</button>
                </div>
                
            </div>
        </div>
    );
};

