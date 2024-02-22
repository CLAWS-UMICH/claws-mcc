import * as React from "react";
import { useState } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
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

// TODO make image gray on selection, make selection more starkly visible
// TODO aspect ratio. 1:1 square
// TODO make the scrollbar invisible or less ugly ? overflow: hidden;
// BUG in case where need to scroll on main page, make sure you keep that position when scrolling in mini page https://forum.bubble.io/t/tutorial-scroll-within-a-popup-without-scrolling-the-page/144153

const resolveAsset = (asset: string) => {
  const ASSET_URL =
    "https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-card/stories/assets/";

  return `${ASSET_URL}${asset}`;
};

const useStyles = makeStyles({
  main: {
    ...shorthands.gap("16px"),
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: '#000000',
  },

  card: {
    width: "285px", // FIXME bad to have px hardcoded?
    // height: "180px",
    // maxWidth: "100%",
    height: "fit-content",
  },

  caption: {
    color: tokens.colorNeutralForeground3,
  },

  smallRadius: {
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
  },

  grayBackground: {
    backgroundColor: tokens.colorNeutralBackground3,
  },

  logoBadge: {
    // FIXME
    ...shorthands.padding("5px"),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    backgroundColor: "#FFF",
    boxShadow:
      "0px 1px 2px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.12)",
  },
});

// const Enlarge = bundleIcon(SlideSize24Regular, SlideSizeFilled24); // change to guides icon

const ImageCard = (props: CardProps) => {
  const styles = useStyles();
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleIconClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // Prevent the event from propagating to parent elements
    setIsDialogOpen(true); // Open the Dialog
  };

  return (
    <Card className={styles.card} {...props}>
      <CardPreview
        className={styles.grayBackground}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
                  Image Name
                  <DialogTrigger disableButtonEnhancement>
                    <div>
                      <Dismiss24Regular
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          cursor: "pointer",
                        }}
                      ></Dismiss24Regular>
                    </div>
                  </DialogTrigger>
                </DialogTitle>
                <DialogContent>
                  <img
                    src={resolveAsset("office1.png")}
                    style={{ width: "100%", height: "auto" }}
                  />
                </DialogContent>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        )}

        {/* <div style={{ aspectRatio: 1 }}> */}
        <img
          style={{ aspectRatio: 1, objectFit: "cover" }}
          className={styles.smallRadius}
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
  const styles = useStyles();

  // FIXME this is too redundant
  const [selected1, setSelected1] = React.useState(false);
  const [selected2, setSelected2] = React.useState(false);
  const [selected3, setSelected3] = React.useState(false);
  const [selected4, setSelected4] = React.useState(false);
  const [selected5, setSelected5] = React.useState(false);
  const [selected6, setSelected6] = React.useState(false);
  const [selected7, setSelected7] = React.useState(false);
  const [selected8, setSelected8] = React.useState(false);
  const [selected9, setSelected9] = React.useState(false);

  return (
    <div style={{ margin: '20px'}}>
      <div style={{ margin: '0 0 20px 0'}}>
        <SearchBar />
      </div>
      <div className={styles.main}>
        <ImageCard
          selected={selected1}
          onSelectionChange={(_, { selected }) => setSelected1(selected)}
        />
        <ImageCard
          selected={selected2}
          onSelectionChange={(_, { selected }) => setSelected2(selected)}
        />
        <ImageCard
          selected={selected3}
          onSelectionChange={(_, { selected }) => setSelected3(selected)}
        />
        <ImageCard
          selected={selected4}
          onSelectionChange={(_, { selected }) => setSelected4(selected)}
        />
        <ImageCard
          selected={selected5}
          onSelectionChange={(_, { selected }) => setSelected5(selected)}
        />
        <ImageCard
          selected={selected6}
          onSelectionChange={(_, { selected }) => setSelected6(selected)}
        />
        <ImageCard
          selected={selected7}
          onSelectionChange={(_, { selected }) => setSelected7(selected)}
        />
        <ImageCard
          selected={selected8}
          onSelectionChange={(_, { selected }) => setSelected8(selected)}
        />
        <ImageCard
          selected={selected9}
          onSelectionChange={(_, { selected }) => setSelected9(selected)}
        />
      </div>
    </div>
  );
};

// export default ImageCard;