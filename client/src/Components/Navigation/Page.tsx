import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";

interface IPageProps {
	children: any;
	request?: () => void;
}

export default function Page(props: IPageProps) {
	const request = props.request ? props.request : () => {};
	return (
		<div className="page">
			<Header request={request} />
			<div className="content">
				<Navigation />
				<div className="body">{props.children}</div>
			</div>
		</div>
	);
}
