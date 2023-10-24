import React, { useState, useEffect } from "react";
import DropdownForm2 from "./DropdownForm2.js";
import RequestStatus from "./RequestStatus.js";
import getMicrosoftAccessToken from "./GetToken.js";
/* global Office, alert, fetch, console */

function TokenFile() {
  const [clientToken, setClientToken] = useState("");
  const [clientDomain, setClientDomain] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [auth, setAuth] = useState(false);
  const [formTypes, setFormTypes] = useState([]);
  const [reqId, setReqId] = useState("");

  function setOfficeKeyValue(key, value) {
    Office.context.roamingSettings.set(key, value);
    Office.context.roamingSettings.saveAsync(); // Save changes asynchronously
  }

  function getOfficeKeyValue(key) {
    return Office.context?.roamingSettings.get(key);
  }
  useEffect(() => {
    const conversation = Office.context?.mailbox.initialData.conversationId;
    const requestId = getOfficeKeyValue(conversation);
    if (requestId) {
      setReqId(requestId);
    }
    const domain = getOfficeKeyValue("clientDomain");
    const token = getOfficeKeyValue("clientToken");

    if (domain && token) {
      setAuth(true);
      const orgId = token.split(".").pop();
      fetchAndSaveStreamlineForms(domain, orgId);

      setClientToken(token);
      setClientDomain(domain);
    }
  }, []);

  async function saveStreamlineSettings(e) {
    e.preventDefault();
    if (!clientToken || !clientDomain) {
      return alert("Failed: Client token and domain both are required");
    }
    // if (!domainPattern.test(clientDomain)) {
    //   return console.log("Invalid streamline domain, please provide a valid streamline domain");
    // }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clientEmail}`,
      },
      body: JSON.stringify({
        clientToken,
        clientDomain,
        clientEmail,
      }),
    };
    const response = await fetch(`${clientDomain}/api/outlook/validate`, options);

    if (response.status === 400) {
      return alert("Failed: Invalid Client Token.");
    }

    if (response.status === 401) {
      return alert("Failed: Please sign in to Streamline using your Google account to continue.");
    }

    if (response.status !== 204) {
      return alert("Failed: Please check the client token and domain.");
    }

    setOfficeKeyValue("clientToken", clientToken);
    setOfficeKeyValue("clientDomain", clientDomain);
    setOfficeKeyValue("clientEmail", clientEmail);
    await fetchAndSaveStreamlineForms(clientDomain, clientToken.split(".").pop());
    setAuth(true);
    Office.context.roamingSettings.set("clientToken", clientToken);
    Office.context.roamingSettings.set("clientDomain", clientDomain);
  }

  async function fetchAndSaveStreamlineForms(clientDomain, orgId) {
    const response = await fetch(`${clientDomain}/api/outlook/request-forms/${orgId}`, {
      headers: {
        Authorization: `Bearer ${clientEmail}`,
      },
    });
    const formData = await response.json();
    setFormTypes([...formData]);
    if (response.status === 400) {
      return alert("Failed: Ensure integration is enabled and log in with your Google account in Streamline.");
    }
  }

  useEffect(() => {
    function deleteAllKeys() {
      Office.context?.roamingSettings.remove("clientToken");
      Office.context?.roamingSettings.remove("clientDomain");
      Office.context?.roamingSettings.saveAsync();
    }
    deleteAllKeys();
  }, []);

  useEffect(() => {
    Office.context.mailbox.getUserIdentityTokenAsync(function (result) {
      if (result.status === "succeeded") {
        let token = result.value;
        console.log(token, "token");
      } else {
        // Handle error
        console.log(result.error);
      }
    });
  }, []);

  useEffect(() => {
    async function getTokens() {
      const token = await getMicrosoftAccessToken();
      console.log(token);
    }
    getTokens();
  }, []);
  return (
    <>
      {reqId && auth ? (
        <RequestStatus reqId={reqId} clientToken={clientToken} clientDomain={clientDomain} />
      ) : auth ? (
        <>
          <DropdownForm2 formDetails={formTypes} clientDomain={clientDomain} orgId={clientToken.split(".").pop()} />
        </>
      ) : (
        <>
          <p
            style={{
              fontWeight: "bold",
              fontFamily: "sans-serif",
              fontSize: "20px",
              padding: "10px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          >
            Set up Streamline Access 0
          </p>
          <form>
            <label
              style={{
                marginTop: "10px",
                paddingLeft: "5%",
                fontSize: "18px",
                width: "80%",
                fontFamily: "sans-serif",
              }}
            >
              Client Token
            </label>
            <br />
            <input
              placeholder="Client Token"
              style={{
                marginTop: "10px",
                marginLeft: "5%",
                marginRight: "5%",
                width: "80%",
                border: "1px solid #eee",
                borderRadius: "2px",
                fontSize: "14px",
                padding: "10px 10px",
              }}
              onChange={(e) => {
                setClientToken(e.target.value);
              }}
            />{" "}
            <br />
            <div style={{ marginTop: "20px" }}>
              <label
                style={{
                  marginTop: "10px",
                  paddingLeft: "5%",
                  fontSize: "18px",
                  width: "80%",
                  fontFamily: "sans-serif",
                }}
              >
                Domain Name
              </label>{" "}
              <br />
              <input
                placeholder="Streamline Domain"
                onChange={(e) => {
                  setClientDomain(e.target.value);
                }}
                style={{
                  marginTop: "10px",
                  marginLeft: "5%",
                  marginRight: "5%",
                  width: "80%",
                  border: "1px solid #eee",
                  borderRadius: "2px",
                  fontSize: "14px",
                  padding: "10px",
                }}
              />
            </div>
            <div style={{ marginTop: "20px" }}>
              <label
                style={{
                  marginTop: "10px",
                  paddingLeft: "5%",
                  fontSize: "18px",
                  width: "80%",
                  fontFamily: "sans-serif",
                }}
              >
                E-mail
              </label>{" "}
              <br />
              <input
                placeholder="E-mail"
                onChange={(e) => {
                  setClientEmail(e.target.value);
                }}
                style={{
                  marginTop: "10px",
                  marginLeft: "5%",
                  marginRight: "5%",
                  width: "80%",
                  border: "1px solid #eee",
                  borderRadius: "2px",
                  fontSize: "14px",
                  padding: "10px",
                }}
              />
            </div>
            <button
              style={{
                marginLeft: "10px",
                width: "50%",
                marginTop: "10px",
                backgroundColor: "white",
                border: "1px solid #ccc",
                fontSize: "16px",
                borderRadius: "2px",
                padding: "10px 0px",
                cursor: "pointer",
              }}
              onClick={(e) => {
                saveStreamlineSettings(e);
              }}
            >
              Save Settings
            </button>
          </form>
        </>
      )}
    </>
  );
}

TokenFile.propTypes = {};

export default TokenFile;
