import React from "react";
import { DotLoader } from "react-spinners";

export default function PageSpinner() {
	return (
		<div className="page-spinner">
			<DotLoader size={150} color={"#51247a"} />
		</div>
	);
}
