/*eslint-disable @typescript-eslint/no-explicit-any  */
/*eslint-disable @typescript-eslint/no-non-null-assertion  */

import React, { createContext, useState, useContext, useEffect } from "react";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IPeoplePickerContext} from "@pnp/spfx-controls-react/lib/PeoplePicker";


interface IInvolvListContext {
    items: any[];
    getItems: () => Promise<void>;
    addItem: (item: any) => Promise<void>;
    updateItem: (id: number, item: any) => Promise<void>;
    getPeoplePickerContext: () => IPeoplePickerContext;
    getCurrentUser: () => any;
    onRowLimitChange: (newValue: number) => any;
    onNextPage: () => any;
    onPreviousPage: () => any;
    rowlimit: number;
    currentTickerPage: any;
    pageIdx:number;
    onTitleSearch: (searchValue:string) => any;
    context:WebPartContext;
}

const InvolvListContext = createContext<IInvolvListContext | undefined>(undefined);

interface InvolvListProviderProps {
    sp: SPFI; // Accept the SPFI instance as a prop
    listName: string;
    context: WebPartContext;
}

const InvolvListProvider: React.FunctionComponent<InvolvListProviderProps> = ({ sp, listName, context, children }) => {
    const [items, setItems] = useState<any[]>([]);
    const [rowlimit, setRowlimit] = useState(10);
    const [paging, setPaging] = useState({next:false,prev:false});
    const [pageIdx, setPageIdx] = useState(0);
    const [currentTickerPage, setCurrentTicker] = useState<any>();
    const [searchText, setSearchText] = useState("");

   

    const getItems = async ():Promise<void> => {
        try {
          console.log(pageIdx);
          if(pageIdx===0)
            {
              if (searchText) {
                //const items = await sp.web.lists.getByTitle(listName).items.orderBy("Id", true).filter(`Title eq '${searchText}'`).top(rowlimit).getPaged();
                const items = await sp.web.lists.getByTitle(listName).items.orderBy("Id", true).filter(`startswith(Title, '${searchText}')`).top(rowlimit).getPaged();
                setCurrentTicker(items);
                setItems(items.results);
              }
              else {
                const items = await sp.web.lists.getByTitle(listName).items.orderBy("Id", true).top(rowlimit).getPaged();
                setCurrentTicker(items);
                setItems(items.results);
              }
            }
            console.log(paging.next);
            if(paging.next && currentTickerPage.hasNext)
              {
                const nextPage = await currentTickerPage.getNext();
                setCurrentTicker(nextPage);
                setItems(nextPage.results);
              }
              console.log(paging.prev);
              if(paging.prev)
                {
                  let items = null;
                  if (searchText) {
                    items = await sp.web.lists.getByTitle(listName).items.orderBy("Id", true).filter(`Title eq '${searchText}'`).top(rowlimit).getPaged();
                  }
                  else {
                    items = await sp.web.lists.getByTitle(listName).items.orderBy("Id", true).top(rowlimit).getPaged();
                  }
                  if(items !== null)
                  {
                    let currentIndex = 0;
                    while (currentIndex < pageIdx && items!==null && items.hasNext) {
                      items = await items.getNext();
                      currentIndex++;
                    }
                    if(items?.results)
                    {
                      setCurrentTicker(items);
                      setItems(items?.results);
                    }
                    
                  }
                 
                }
      
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    };

    const onRowLimitChange = async (newValue: number): Promise<void> => {
        const rowLimit = newValue ? newValue : 10;
        setRowlimit(rowLimit);
        setPageIdx(0);
        setPaging({next:false,prev:false});
    }
    const onTitleSearch = (searchValue: string): void => {
        setSearchText(searchValue);
        setPageIdx(0);
        setPaging({next:false,prev:false});
    }

    const onNextPage = async (): Promise<void> => {
        const newPage = pageIdx + 1;
        setPageIdx(newPage);
        setPaging({next:true,prev:false});
    }

    const onPreviousPage = async (): Promise<void> => {
        const newPage = Math.max(pageIdx - 1, 0)
        setPageIdx(newPage);
        setPaging({next:false,prev:true});
    }

  const addItem = async (item: any):Promise<void> => {
    try {
      await sp.web.lists.getByTitle(listName).items.add(item);
      await getItems();
      setPageIdx(0);
      setPaging({next:false,prev:false});
    } catch (error) {
      console.error("Error adding item:", error);
    }
    };

    const getCurrentUser = async (): Promise<any> => {
        const user = await sp.web.currentUser();
        return user;
    };

  const updateItem = async (id: number, item: any):Promise<void> => {
    try {
      await sp.web.lists.getByTitle(listName).items.getById(id).update(item);
      await getItems();
      setPageIdx(0);
      setPaging({next:false,prev:false});
    } catch (error) {
      console.error("Error updating item:", error);
    }
    };

    const getPeoplePickerContext = (): any => {
        const peoplePickerContext: IPeoplePickerContext = {
            absoluteUrl: context.pageContext.web.absoluteUrl,
            msGraphClientFactory: context.msGraphClientFactory as any,
            spHttpClient: context.spHttpClient as any
        };
        return peoplePickerContext;
    };
    

  useEffect(() => {
    getItems().catch((error)=>{
      console.error("Error in InvolvListContext:", error);
  });
  }, [rowlimit, paging, searchText]);

  return (
      <InvolvListContext.Provider value={{ items, getItems, addItem, updateItem, getPeoplePickerContext, getCurrentUser, onRowLimitChange, onNextPage, onPreviousPage, rowlimit, onTitleSearch,currentTickerPage,pageIdx,context }}>
    {children}
  </InvolvListContext.Provider>
  );
};

const useInvolvList = ():IInvolvListContext => {
  const context = useContext(InvolvListContext);
  if (!context) {
    throw new Error("useInvolvList must be used within an InvolvListProvider");
  }
  return context;
};

export { InvolvListContext, InvolvListProvider, useInvolvList };