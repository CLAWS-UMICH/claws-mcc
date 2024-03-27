import React, { useState, useRef } from "react";
import "./Card.css";

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

// TODO make image gray on selection, make selection more starkly visible
// TODO aspect ratio. 1:1 square
// TODO make the scrollbar invisible or less ugly ? overflow: hidden;
// BUG in case where need to scroll on main page, make sure you keep that position when scrolling in mini page https://forum.bubble.io/t/tutorial-scroll-within-a-popup-without-scrolling-the-page/144153

const ImageCard = ({ onClick, images, index, ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const cardRef = useRef(null);

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
    <Card className="card" {...props} onClick={handleClick} ref={cardRef} style ={{backgroundColor: "#000000", alignItems:"center"}}>
      <CardPreview
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
                  {images[Object.keys(images)[index]].title}
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
      />
    </Card>
  );
};

export const CardSelectable = ({onCardClick, images, searchInput}) => {
  const filteredImages = images.filter(image =>
    image.title.toLowerCase().includes(searchInput.toLowerCase())
  );
  
  return (
    <div className="cardSelectableContainer">
      <div className="main">
      {filteredImages.map((image, index) => (
          <ImageCard
            key={index}
            onClick={(ref) => onCardClick(image.id, ref)}
            images={filteredImages}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};