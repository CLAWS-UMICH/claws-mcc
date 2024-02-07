import * as React from "react";
import {
  makeStyles,
  shorthands,
  Button,
  Caption1,
  tokens,
  Text,
} from "@fluentui/react-components";
import { MoreHorizontal20Regular } from "@fluentui/react-icons";
import {
  Card,
  CardHeader,
  CardPreview,
  CardProps,
} from "@fluentui/react-components";


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
  },

  card: {
    width: "350px",
    maxWidth: "100%",
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
    ...shorthands.padding("5px"),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    backgroundColor: "#FFF",
    boxShadow:
      "0px 1px 2px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.12)",
  },
});

const ImageCard = (props: CardProps) => {
  const styles = useStyles();

  return (
    <Card className={styles.card} {...props}>
      <CardPreview
        className={styles.grayBackground}
        logo={
          <img
            className={styles.logoBadge}
            src={resolveAsset("logo3.svg")}
            alt="Figma app logo"
          />
        }
      >
        <img
          className={styles.smallRadius}
          src={resolveAsset("office1.png")}
          alt="Presentation Preview"
        />
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
  );
};