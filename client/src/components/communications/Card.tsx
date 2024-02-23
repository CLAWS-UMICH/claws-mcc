import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardPreview,
  CardProps,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogContent,
  DialogTitle,
  Text,
} from "@fluentui/react-components";
import { ArrowExpand24Regular, Dismiss24Regular } from "@fluentui/react-icons";
import SearchBar from "./SearchBar.tsx";
import "./Card.css";

// TODO make image gray on selection, make selection more starkly visible
// TODO aspect ratio. 1:1 square
// TODO make the scrollbar invisible or less ugly ? overflow: hidden;
// BUG in case where need to scroll on main page, make sure you keep that position when scrolling in mini page https://forum.bubble.io/t/tutorial-scroll-within-a-popup-without-scrolling-the-page/144153

const resolveAsset = (asset: string) => {
  const ASSET_URL =
    "https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-card/stories/assets/";

  return `${ASSET_URL}${asset}`;
};

const ImageCard = (props: CardProps) => {
  // const styles = useStyles();
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleIconClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // Prevent the event from propagating to parent elements
    setIsDialogOpen(true); // Open the Dialog
  };

  return (
    <Card className="card" {...props}>
      <CardPreview
        className= "grayBackground"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        // onClick={()=>}
        style={{ position: "relative" }} // FIXME verify. Ensure CardPreview container has relative positioning
      >
        {/* Show enlarge only when CardPreview is hovered */}
        {/* FIXME - positioning. and should it be top: '0' with quotes? */}
        {/* width: '100px', height: '150px' -- why did adding this change the location of the image? */}
        {isHovered && (
          <Dialog
            open={isDialogOpen}
            onOpenChange={(_, data) => setIsDialogOpen(data.open)}
          >
            <DialogTrigger>
              <div>
                <ArrowExpand24Regular
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    cursor: "pointer",
                    width: "13%",
                    height: "13%",
                  }}
                ></ArrowExpand24Regular>
              </div>
            </DialogTrigger>
            <DialogSurface className="dialogSurface">
              <DialogBody>
                <DialogTitle className="dialogTitle">
                  Image Name
                  <DialogTrigger disableButtonEnhancement>
                    <div>
                      <Dismiss24Regular
                        style={{
                          position: "absolute",
                          top: 15,
                          right: 10,
                          cursor: "pointer",
                          width: "4%",
                          height: "4%",
                        }}
                      ></Dismiss24Regular>
                    </div>
                  </DialogTrigger>
                </DialogTitle>
                <DialogContent>
                  <img
                    src={resolveAsset("office1.png")}
                    className="imageContent"
                  />
                </DialogContent>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        )}

        {/* <div style={{ aspectRatio: 1 }}> */}
        <img
          style={{ aspectRatio: 1, objectFit: "cover" }}
          className="smallRadius"
          src={resolveAsset("office1.png")}
          // TODO send http get request
        />
        {/* </div> */}
      </CardPreview>

      <CardHeader
        header={<Text weight="semibold">claws</Text>}
        // action={        }
      />
    </Card>
  );
};

export const CardSelectable = () => {
  // const styles = useStyles();
  const numberOfCards = 13;
  const [selectedStates, setSelectedStates] = useState(Array(numberOfCards).fill(false));

  const handleSelectionChange = (index: number, event: any) => {
    const isSelected = event.selected; // Adjust this line based on your event's structure
    const updatedStates = [...selectedStates];
    updatedStates[index] = isSelected;
    setSelectedStates(updatedStates);
  };
  // FIXME this is too redundant
  return (
    <div style={{ margin: '20px'}}>
      <div style={{ margin: '0 0 20px 0'}}>
        <SearchBar />
      </div>
      <div className="main">
        {Array.from({ length: numberOfCards }, (_, index) => (
          <ImageCard
            key={index}
            selected={selectedStates[index]}
            onSelectionChange={(event) => handleSelectionChange(index, event)}
          />
        ))}
      </div>
    </div>
  );
};

// export default ImageCard;