import React, { useState } from "react";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import {
  createMuiTheme,
  fade,
  makeStyles,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import { Button, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";
import Popup from "reactjs-popup";
import { Search } from "@material-ui/icons";
import Modal from "../Modal/Modal";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

interface IHeaderProps {
  request: () => void;
}

export default function Header(props: IHeaderProps) {
  const [search, setSearch] = useState("");
  const history = useHistory();
  const location = useLocation();

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (location.pathname == "/search-notes") {
      location.state = { search: search };
      props.request();
      // console.log("hello");
    } else {
      history.push("/search-notes", { search: search });
    }
  };

  const handleEnterSearch = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      history.push("/search-notes", { search: search });
      // console.log('enter press here! ')
    }
  };

  return (
    <div className="header">
      <div className="left">
        {/* <Logo /> */}
        <div className="title">UQ Notes</div>

        {/* <img src={logo} alt="logo" className="login-logo" /> */}
      </div>

      <div className="right">
        <HeaderSearchTextField
          className="search"
          placeholder="Search..."
          variant="outlined"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="search"
                  style={{ color: "#51247a" }}
                  onClick={(e) => handleSearch(e)}
                  // onClick={handleClickShowPassword}
                  // onMouseDown={handleMouseDownPassword}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => handleEnterSearch(e)}
        />
        <Popup
          contentStyle={{ borderRadius: "1rem" }}
          trigger={
            <Button className="upload" color="primary" startIcon={<PublishIcon />}>
              Upload Notes
            </Button>
          }
          modal
          closeOnDocumentClick={false}
        >
          {(close) => <Modal onClose={() => close()} onSubmit={() => props.request()} />}
        </Popup>
      </div>

      {/* <Toolbar>
				<div className={classes.search}>
					<div className={classes.searchIcon}>
						<SearchIcon />
					</div>
					<InputBase
						placeholder="Search notes..."
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput,
						}}
						inputProps={{ "aria-label": "search" }}
					/>
				</div>
				<div className={classes.upload}>
					<Popup
						trigger={
							<Button color="primary">
								Upload Notes <PublishIcon />
							</Button>
						}
						modal>
						<div>Popup content here !!</div>
					</Popup>
				</div>
			</Toolbar> */}
    </div>
  );
}

export const HeaderSearchTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 100,
      // boxShadow: "2px 2px 5px #dddddd",
      background: "#ffffff",
      "& input": {
        background: "#ffffff",
        borderRadius: "100rem 0rem 0rem 100rem",
        padding: "12px 14px;",
      },
      "& fieldset": {
        transition: "box-shadow 0.3s",
        borderColor: "#dddddd",
      },
      "&:hover fieldset": {
        borderColor: "#dddddd",
        // boxShadow: "2px 2px 10px #dddddd",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#dddddd",
        // boxShadow: "2px 2px 10px #dddddd",
      },
    },
    "& .Mui-error": {
      "& fieldset": {
        transition: "box-shadow 0.3s",
        borderColor: "#e62645",
      },
    },
  },
})(TextField);

// import logo from "../../assets/logo.svg";

// const useStyles = makeStyles((theme) => ({
// 	search: {
// 		position: "relative",
// 		borderRadius: theme.shape.borderRadius,
// 		backgroundColor: fade(theme.palette.common.white, 0.15),
// 		"&:hover": {
// 			backgroundColor: fade(theme.palette.common.white, 0.25),
// 		},
// 		marginLeft: 0,
// 		width: "100%",
// 		[theme.breakpoints.up("sm")]: {
// 			marginLeft: theme.spacing(1),
// 			width: "auto",
// 		},
// 	},
// 	searchIcon: {
// 		padding: theme.spacing(0, 2),
// 		height: "100%",
// 		position: "absolute",
// 		pointerEvents: "none",
// 		display: "flex",
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	inputRoot: {
// 		color: "inherit",
// 	},
// 	inputInput: {
// 		padding: theme.spacing(1, 1, 1, 0),
// 		// vertical padding + font size from searchIcon
// 		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
// 		transition: theme.transitions.create("width"),
// 		width: "100%",
// 		[theme.breakpoints.up("sm")]: {
// 			width: "12ch",
// 			"&:focus": {
// 				width: "20ch",
// 			},
// 		},
// 	},
// 	upload: {
// 		display: "flex",
// 		flexDirection: "row",
// 		alignItems: "center",
// 		justifyContent: "center",
// 		paddingLeft: "24px",
// 	},
// }));
