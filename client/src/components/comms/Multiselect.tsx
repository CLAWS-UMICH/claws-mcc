import * as React from "react";
import {
  Dropdown,
  makeStyles,
  Option,
  shorthands,
  useId,
} from "@fluentui/react-components";
import type { DropdownProps } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    // Stack the label above the field with a gap
    display: "grid",
    gridTemplateRows: "repeat(1fr)",
    justifyItems: "start",
    ...shorthands.gap("2px"),
    maxWidth: "400px",
  },
});

export const Multiselect = (props: Partial<DropdownProps>) => {
  const comboId = useId("combo-multi");
  const options = ["Astronaut 1", "Astronaut 2"];
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <label id={comboId}>Send Information</label>
      <Dropdown
        aria-labelledby={comboId}
        multiselect={true}
        placeholder="Select Astronauts"
        {...props}
      >
        {options.map((option) => (
          <Option key={option}>
            {option}
          </Option>
        ))}
      </Dropdown>
    </div>
  );
};