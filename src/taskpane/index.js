import App from "./components/App";
import { AppContainer } from "react-hot-loader";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import * as React from "react";
import * as ReactDOM from "react-dom";
/* global document, Office, module, require */

initializeIcons();

// const title = "Contoso Task Pane Add-in";

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById("container")
  );
};

// function getAccessToken() {
//   return new Promise((resolve, reject) => {
//     // Request an access token for the specified resource
//     Office.context.mailbox.getCallbackTokenAsync({ isRest: true }, (result) => {
//       if (result.status === Office.AsyncResultStatus.Succeeded) {
//         const accessToken = result.value;
//         resolve(accessToken);
//       } else {
//         reject(new Error(`Error getting access token: ${result.error.message}`));
//       }
//     });
//   });
// }

/* Render application after Office initializes */
Office.onReady(() => {
  // const item = Office.context.mailbox.item;
  // console.log("office item is",item)
  // console.log("info is",info);
  // const accessToken = await  getAccessToken();
  // console.log("accessToken us",accessToken)

  // const response = await fetch('https://graph.microsoft.com/v1.0/me', {
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`
  //   }
  // });

  // const userData = await response.json();
  // console.log('User Data:', userData)
  // if (info.host === Office.HostType.Outlook) {
  // Get a reference to the current message
  // const item = Office.context.mailbox.item;
  // Office.context.mailbox.getUserIdentityTokenAsync(()=>{
  //   console.log("result.value;",result.value);
  // })

  // console.log("office context",Office.context)
  // console.log("itemssss",item)
  // }
  render(App);
});

/* Initial render showing a progress bar */
render(App);

if (module.hot) {
  module.hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    render(NextApp);
  });
}
