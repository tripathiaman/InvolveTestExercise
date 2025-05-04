/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import { useInvolvList } from "./InvolvListContext"

export interface IInvolveImagePickerComponentProps {
  initialImageUrl?: string | undefined;
  onImageSelected: (imageInfo: IImageFieldValue|undefined) => void;
}

export interface IImageFieldValue {
  type: string;
  fileName: string;
  serverRelativeUrl: string;
}

export const InvolveImagePickerComponent:  React.FunctionComponent<IInvolveImagePickerComponentProps> = (props) => {
 const { context } = useInvolvList();

  const handleImageChange = (images: IFilePickerResult[]):void => {
    if (images && images.length >0) {
        const image = images[0];    
        console.log(image)
        const serverRelativeUrl = encodeURI(image.fileAbsoluteUrl.replace(window.location.origin, ""));
        const imageInfo: IImageFieldValue = {
            type: "thumbnail",
            fileName: image.fileName,
            serverRelativeUrl: serverRelativeUrl
          };
      props.onImageSelected(imageInfo);
    } else {
        props.onImageSelected(undefined);
    }
  };


  return (
    <div className="image-picker-container">
      <FilePicker
          accepts= {[".gif", ".jpg", ".jpeg", ".bmp", ".png"]}
            buttonIcon="FileImage"
            hideStockImages={true}
            hideWebSearchTab={true}
            hideOrganisationalAssetTab={true}
            hideOneDriveTab={false}
            hideLocalUploadTab={false}
            onSave={(filePickerResult: IFilePickerResult[]) => handleImageChange(filePickerResult)}
            onChange={(filePickerResult: IFilePickerResult[]) => handleImageChange(filePickerResult)}
            context={context as any}
/>
    </div>
  );
};

