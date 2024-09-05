import React from "react";
import { GOOGLE_CLIENT_ID } from "../core/constants";
import useEphemeralKeyPair from "../core/useEphemeralKeyPair";
import GoogleLogo from "./GoogleLogo";
import { collapseAddress } from "@/core/utils";

type HeaderProps = {
  activeAccount: any;
  balance: number | null;
};

export const Header: React.FC<HeaderProps> = ({ activeAccount, balance }) => {
  const ephemeralKeyPair = useEphemeralKeyPair();
  const [copied, setCopied] = React.useState(false);

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  const searchParams = new URLSearchParams({
    /**
     * Replace with your own client ID
     */
    client_id: GOOGLE_CLIENT_ID,
    /**
     * The redirect_uri must be registered in the Google Developer Console. This callback page
     * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
     * derive the keyless account.
     *
     * window.location.origin == http://localhost:5173
     */
    redirect_uri: `${window.location.origin}/callback`,
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs as it does not require a backend server.
     */
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  });
  redirectUrl.search = searchParams.toString();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copy status after 2 seconds
    });
  };

  return (
    <header>
      <h1>
        ROCK <br />
        PAPER <br />
        SCISSORS
      </h1>

      {!activeAccount && (
        <a
          href={redirectUrl.toString()}
          className="flex justify-center items-center border rounded-lg px-8 py-2 hover:bg-gray-100 hover:shadow-sm active:bg-gray-50 active:scale-95 transition-all"
        >
          <GoogleLogo />
          Sign in with Google
        </a>
      )}

      {activeAccount && (
        <div className="btns">
          <div className="flex justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed">
            <GoogleLogo />
            {collapseAddress(activeAccount?.accountAddress.toString())}
            <i
              className="fa-regular fa-copy ml-2 cursor-pointer hover:text-gray-600"
              onClick={() => copyToClipboard(activeAccount?.accountAddress.toString())}
              title="Copy address"
            ></i>
            {copied && <span className="ml-2 text-green-500">Copied!</span>}
          </div>
          {balance && <p className="pt-3">Balance: {balance} APT</p>}
        </div>
      )}
    </header>
  );
};
