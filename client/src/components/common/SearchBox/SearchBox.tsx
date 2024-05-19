import * as React from 'react';
import { useId, Input, Button, makeStyles } from '@fluentui/react-components';
import { Search12Regular, Dismiss16Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: "1rem",
    paddingRight: ".75rem",
    paddingBottom: "11px",
  },
  input: {
    width: "150px",
  },
  dismiss: {
    paddingRight: "0",
  }
});

interface SearchComponentProps {
  handleDismiss: () => void;
  handleSearch: (query: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ handleDismiss, handleSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const inputId = useId("search bar");
  const styles = useStyles();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    handleSearch(searchQuery);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <form onSubmit={onSubmit} className={styles.root}>
      <Input
        className={styles.input}
        id={inputId}
        value={searchQuery}
        onChange={onInputChange}
        contentBefore={<Button
          appearance="transparent"
          icon={<Search12Regular />}
          aria-label="Search"
          size="small"
          type="submit" // Make it a submit button
        />}
      />
      <Button
        className={styles.dismiss}
        icon={<Dismiss16Regular />}
        appearance="transparent"
        onClick={handleDismiss}
      />
    </form>
  );
};

export default SearchComponent;

// import * as React from "react";
// import type { ButtonProps, FieldProps } from "@fluentui/react-components";
// import { SearchBox } from "@fluentui/react"
// import { makeStyles, useId, Field, Input, Button, shorthands } from "@fluentui/react-components";
// import { Search12Regular, Dismiss16Regular} from "@fluentui/react-icons"


// const useStyles = makeStyles({
//   root: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingLeft: "1rem",
//     paddingRight: ".75rem",
//     paddingBottom: "11px",
//   },
//   input: {
//     // flexBasis: "50%"
//     width: "150px",
//     // marginRight: "auto"
//   },
//   dismiss: {
//     paddingRight: "0"
//     // marginRight: "-10px"
//   }
// });

// const SearchButton: React.FC<ButtonProps> = (props, handleSearch) => {
//   return (
//     <Button
//       {...props}
//       appearance="transparent"
//       icon={<Search12Regular />}
//       size="small"
//       onClick={handleSearch}
//     />
//   );
// };

// const SearchComponent = ({handleDismiss, handleSearch}) => {
//   const inputId = useId("search bar");
//   const styles = useStyles();

//   return (
//     <div className={styles.root}>
//       {/* <SearchBox></SearchBox> */}
//       <Input className={styles.input} contentBefore={<SearchButton aria-label="Enter by voice" />} id={inputId}/>
//       <Button className={styles.dismiss} icon={<Dismiss16Regular/>} appearance="transparent" onClick={handleDismiss}></Button>
//     </div>
//   );
// };

// export default SearchComponent;
