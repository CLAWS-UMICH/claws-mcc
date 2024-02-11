import * as React from "react";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";

const ImageEnlargement = ({ isOpen, onDismiss, imageSrc, imageName }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(_, data) => onDismiss(data.open)}
    >
      <DialogSurface
        style={{
          width: "auto",
          height: "auto",
          maxWidth: "80vw",
          maxHeight: "80vh",
        }}
      >
        <DialogBody>
          <DialogTitle>
            {imageName}
            <DialogTrigger disableButtonEnhancement>
              <div>
                <Dismiss24Regular
                  onClick={() => onDismiss(false)}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    cursor: "pointer",
                  }}
                />
              </div>
            </DialogTrigger>
          </DialogTitle>
          <DialogContent>
            <img
              src={imageSrc}
              style={{ width: "100%", height: "auto" }}
              alt={imageName}
            />
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default ImageEnlargement;
