import jwt_decode from "jwt-decode";
import PATH from "../constants/path";

import { HexaToken, SubContact, TokenPayload } from "../redux/domains/Auth";
import { isJsonString } from "./jsonHelper";

require("dotenv").config();

export const isAuthenticated = () => {
  return localStorage.getItem("token") ? true : false;
};

export function triggerImmediateLogin(): void {
  // Clarify that what type of user are loging on and redirect to the correct path.
  const token = readToken();
  if (token && (token.role === "Admin" || token.role === "Staff"))
    window.location.pathname = PATH.ADMIN.LOGIN;
  else window.location.href = `${process.env.REACT_APP_MARKETING_URL}`;
}

export const readToken = () => {
	const token = localStorage.getItem('token') ?? null;
	if (token && isJsonString(token)) {
		const hexaToken: HexaToken = JSON.parse(token) as HexaToken
		const decoded = jwt_decode(hexaToken.token);
		if (decoded) {
			return decoded as TokenPayload;
		}
	}
	return null;
}

export const readSubContacts = () => {
	const contacts = localStorage.getItem('contacts') ?? null;
	if (contacts && isJsonString(contacts)) {
		const contact: SubContact = JSON.parse(contacts) as SubContact
		if (contact) {
			return contact;
		}
	}
	return null;
}
