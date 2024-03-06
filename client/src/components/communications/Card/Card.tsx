import * as React from "react";
import { useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardPreview,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogContent,
  DialogTitle,
  Text,
} from "@fluentui/react-components";
import { ArrowExpand24Regular, Dismiss24Regular } from "@fluentui/react-icons";

import SearchBar from "../SearchBar/SearchBar.tsx";
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

const ImageCard = ({ onClick, images, index, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const cardRef = useRef(null); // This ref is specific to this card

  // console.log("data:image/gif;base64," + images[Object.keys(images)[index]].img_binary);

  // Add an onClick handler to call the passed in onClick with this card's ref
  const handleClick = () => {
    if(onClick && !isDialogOpen) {
      onClick(cardRef);
    }
  };

  // Specifically handle clicks on the expand icon
  const handleIconClick = (event) => {
    event.stopPropagation(); // Stop the click from reaching the card
    setIsDialogOpen(true);
  };

  return (
    <Card className="card" {...props} onClick={handleClick} ref={cardRef}>
      <CardPreview
        className= "grayBackground"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ position: "relative" }} // FIXME verify. Ensure CardPreview container has relative positioning
      >
        {isHovered && (
          <Dialog open={isDialogOpen} onOpenChange={(_, data) => setIsDialogOpen(data.open)} >
            <DialogTrigger>
              <div onClick={handleIconClick}>
              <ArrowExpand24Regular className="iconExpand" />
              </div>
            </DialogTrigger>
            <DialogSurface className="dialogSurface">
              <DialogBody>
                <DialogTitle className="dialogTitle">
                  Image Name
                  <DialogTrigger disableButtonEnhancement>
                    <div>
                    <Dismiss24Regular className="iconDismiss" />
                    </div>
                  </DialogTrigger>
                </DialogTitle>
                <DialogContent>
                  <img
                    src={"data:image/gif;base64," + images[Object.keys(images)[index]].img_binary}
                    className="imageContent"
                    alt="alt"
                  />
                </DialogContent>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        )}
        
        <img
          style={{ aspectRatio: 1, objectFit: "cover" }}
          className="reviewImage"
          src={"data:image/gif;base64," + images[Object.keys(images)[index]].img_binary}
        />
      </CardPreview>

      <CardHeader
        header={<Text weight="semibold">{images[Object.keys(images)[index]].title}</Text>}
        // action={        }
      />
    </Card>
  );
};

export const CardSelectable = ({onCardClick, images}) => {
  return (
    <div className="cardSelectableContainer">
      <div className="searchBarContainer">
        <SearchBar />
      </div>
      <div className="main">
        {Array.from({ length: images.length }, (_, index) => (
          <ImageCard
            key={index}
            onClick={(ref) => onCardClick(index, ref)}
            images={images}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};