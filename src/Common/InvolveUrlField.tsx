import React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';


interface InvolveUrlFieldProps {
    UrlValue: {
      Url: string;
      Description: string;
    };
    onChange:(updatedValue: { Url: string; Description: string }) => void;
  }

  export const InvolveUrlField:  React.FunctionComponent<InvolveUrlFieldProps> = (props) => {

    const handleUrlChange = (newUrl: string | undefined):void => {
        props.onChange({ Url: newUrl?newUrl:"", Description: props.UrlValue?.Description });
      };

      const handleDescriptionChange = (newDescription: string | undefined):void => {
        props.onChange({ Url: props.UrlValue?.Url, Description: newDescription?newDescription:"" });
      };


      return(
        <Stack tokens={{ childrenGap: 4 }}>
      <TextField
        defaultValue={''}
        value={props.UrlValue?.Url || ''}
        placeholder={"https://...."}
        // className={styles.fieldDisplayNoPadding}
        onChange={(e, newText) => handleUrlChange(newText)}
        disabled={false}
      />
      <TextField
        defaultValue={''}
        value={props.UrlValue?.Description || ''}
        placeholder={"Url Description"}
        // className={styles.fieldDisplayNoPadding}
        onChange={(e, newText) => handleDescriptionChange(newText)}
        disabled={false}
      />
    </Stack>
      )

  }