import React, { useEffect, useState } from "react";
import * as firebase from "firebase/app";

export default function useAuth() {
	const [authWasListened, setAuthWasListened] = useState(false);

	useEffect(() => {
		const authListener = firebase.auth().onAuthStateChanged((authUser) => {
			if (authUser) {
				setAuthWasListened(true);
			} else {
				setAuthWasListened(true);
			}
		});
		return authListener; // THIS MUST BE A FUNCTION, AND NOT A FUNCTION CALL
	}, []);

	return authWasListened;
}
