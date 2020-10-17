import React, { useState } from "react";
import {
	TextField,
	Button,
	withStyles,
	InputAdornment,
	IconButton,
	Typography,
} from "@material-ui/core";
import { AccountCircle, Lock, Visibility, VisibilityOff } from "@material-ui/icons";
import { login } from "../Services/LoginService";
import { ToastContainer, toast } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";

interface ILoginState {
	username: string;
	password: string;
	showPassword: boolean;
	usernameError: boolean;
	passwordError: boolean;
	errorStatus: boolean;
	errorMessage: string;
}

export default function Login() {
	const [state, setState] = useState<ILoginState>({
		username: "",
		password: "",
		showPassword: false,
		usernameError: false,
		passwordError: false,
		errorStatus: false,
		errorMessage: "",
	});

	const history = useHistory();
	const location = useLocation();

	// Prevents default behaviour when hiding/showing password
	const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
	};

	// Toggles between showing and hiding password
	const handleClickShowPassword = () => {
		setState({ ...state, showPassword: !state.showPassword });
	};

	const handlePasswordChange = (e: any) => {
		setState({
			...state,
			password: e.target.value,
			passwordError: false,
			errorStatus: false,
		});
	};

	const handleUsernameChange = (e: any) => {
		setState({
			...state,
			username: e.target.value,
			usernameError: false,
			errorStatus: false,
		});
	};

	const navigateToSignUp = () => history.push("/register");
	const navigateToForgot = () => history.push("/forgot-password");

	const handleSuccess = () => {
		let path = new URLSearchParams(location.search);
		const redirect = path.get("redirect") ? path.get("redirect") : "/";
		history.push(redirect!);
	};

	const handleError = (e: any) => {
		toast.error(e.message);
		console.log(e);
	};

	const validateForm = (e: any) => {
		e.preventDefault();

		const usernameError = state.username.length > 0 ? false : true;
		const passwordError = state.username.length > 0 ? false : true;

		setState({
			...state,
			usernameError: usernameError,
			passwordError: passwordError,
		});

		if (state.username.length > 0 && state.password.length > 0) {
			login(state.username, state.password, handleSuccess, handleError);
		}
	};

	return (
		<div className="login">
			<div className="left">
				<div className="logo-container">
					<Logo />
					<div className="logo-text">UQ Notes</div>
				</div>
			</div>
			<div className="right">
				<div className="welcome-field">Sign In</div>
				<div className="welcome-underline" />
				<form className="form" onSubmit={validateForm}>
					<LoginTextField
						className="username"
						placeholder="Username"
						variant="outlined"
						fullWidth
						error={state.usernameError}
						helperText={state.usernameError ? "Please enter a valid username" : ""}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<AccountCircle style={{ color: "#51247a" }} />
								</InputAdornment>
							),
						}}
						onChange={handleUsernameChange}
					/>
					<LoginTextField
						className="password"
						placeholder="Password"
						variant="outlined"
						fullWidth
						error={state.passwordError}
						helperText={state.passwordError ? "Please enter a valid password" : ""}
						type={state.showPassword ? "text" : "password"}
						value={state.password}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Lock style={{ color: "#51247a" }} />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}>
										{state.showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							),
						}}
						onChange={handlePasswordChange}
					/>

					<LoginButton className="login-button" type="submit" variant="contained" fullWidth>
						Submit
					</LoginButton>
					<div className="form-footer">
						<div className="create-text" onClick={navigateToSignUp}>
							Create an account
						</div>
						<div className="forgot-text" onClick={navigateToForgot}>
							Forgot password
						</div>
					</div>
					{/* <Typography
						variant="subtitle2"
						style={{ color: "#0000EE", margin: "12px 12px", cursor: "pointer" }}
						onClick={() => navigateToSignUp()}>
						Create an account
					</Typography> */}
				</form>
				{/* <ToastContainer /> */}
			</div>
		</div>
	);
}

const LoginTextField = withStyles({
	root: {
		"& .MuiOutlinedInput-root": {
			borderRadius: 100,
			boxShadow: "2px 2px 5px #dddddd",
			"& fieldset": {
				transition: "box-shadow 0.3s",
				borderColor: "#dddddd",
			},
			"&:hover fieldset": {
				borderColor: "#dddddd",
				boxShadow: "2px 2px 10px #dddddd",
			},
			"&.Mui-focused fieldset": {
				borderColor: "#dddddd",
				boxShadow: "2px 2px 10px #dddddd",
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

const LoginButton = withStyles({
	root: {
		background: "linear-gradient(171deg, rgba(81, 36, 122, 1) 0%, rgba(150, 42, 187, 1) 100%);",
		borderRadius: 100,
		height: "48px",
		marginTop: "1rem",
		color: "white",
		fontSize: "1rem",
		fontFamily: "'Poppins', sans-serif",
		boxShadow: "2px 4px 4px -2px #962abb",
		"&:hover": {
			boxShadow: "2px 5px 8px -1px #962abb",
		},
	},
})(Button);
