import React from "react";
import { GoogleLogout } from "react-google-login";

const client =
  "822679158214-b1j8dn9b5k18g1pvuo8sctstod8bi6qa.apps.googleusercontent.com";

const Googlelogout = () => {
  const onsuccess = () => {
    localStorage.removeItem("SSUID");
    window.location.reload();
  };
  return (
    <GoogleLogout
      onLogoutSuccess={onsuccess}
      clientId={client}
      buttonText="logout"
    ></GoogleLogout>
  );
};

export default Googlelogout;
