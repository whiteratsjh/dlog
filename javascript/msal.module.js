/*
* MicroSoft Azure Active Directory Graph API Client.
*
* References
* 	https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2
* 	https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-overview
*
* Code Sample
* 	https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/blob/quickstart/JavaScriptSPA/index.html
*
* Creator : whiterat
* Create Date : 2019-03-12
*
* Use Example
* 	fnLogin.fnInit();
* */

const fnLogin = function () {
	let gAuthObj;

	const gAuthConfig = {
			// 등록한 애플리케이션의 애플리케이션(클라이언트) ID
			clientID: '5366a5ce-361a-4147-a0da-099352143f67'
		,	authority: "https://login.microsoftonline.com/common"
		,	graphScopes: ["user.read"]
		,	graphEndpoint: "https://graph.microsoft.com/v1.0/me"
		};

	// Azure AD Option
	const gAuthOption = {
			storeAuthStateInCookie: true
		,	cacheLocation: "localStorage"
		,	navigateToLoginRequestUrl: false
		};

	const fnInit = () => {
		// MSAL 객체 생성
		gAuthObj = new Msal.UserAgentApplication(gAuthConfig.clientID, gAuthConfig.authority, fnAcquireTokenRedirectCallBack, gAuthOption);

		if ( gAuthObj.getUser() ) {
			fnShowWelcomeMessage();
			fnAcquireTokenPopupAndCallMSGraph();
		}
		else {
			fnSignIn();
		}
	};

	const fnAcquireTokenRedirectCallBack = (pErrorDesc, pToken, pError, pTokenType) => {
		if ( pTokenType === "access_token" ) {
			fnCallMSGraph(gAuthConfig.graphEndpoint, pToken, fnGraphAPICallback);
		}
	};
	const fnSignIn = () => {
		gAuthObj.loginRedirect(gAuthConfig.graphScopes);
	};

	const fnSignOut = () => {
		gAuthObj.logout();
	};

	const fnAcquireTokenPopupAndCallMSGraph = () => {
		//Microsoft Graph 용 토큰을 얻으려면 acquireTokenSilent 를 호출하십시오
		gAuthObj.acquireTokenSilent(gAuthConfig.graphScopes).then(pAccessToken => {
			fnCallMSGraph(gAuthConfig.graphEndpoint, pAccessToken, fnGraphAPICallback);
		}, pError => {
			console.log(pError);
			// acquireTokenSilent가 실패한 경우에만 acquireTokenPopup 을 호출하십시오
			if ( pError.indexOf("consent_required") !== -1 || pError.indexOf("interaction_required") !== -1 || pError.indexOf("login_required") !== -1 ) {
				gAuthObj.acquireTokenPopup(gAuthConfig.graphScopes).then(pAccessToken => {
					fnCallMSGraph(gAuthConfig.graphEndpoint, pAccessToken, fnGraphAPICallback);
				}, pError => {
					console.log(pError);
				});
			}
		});
	};

	const fnCallMSGraph = (pUrl, pAccessToken, pCallBack) => {
		let xmlHttp = new XMLHttpRequest();

		xmlHttp.onreadystatechange = function () {
			if ( this.readyState === 4 && this.status === 200 )
				pCallBack(JSON.parse(this.responseText));
		};
		xmlHttp.open("GET", pUrl, true);
		xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xmlHttp.setRequestHeader('Authorization', 'Bearer ' + pAccessToken);
		xmlHttp.send();
	};

	const fnGraphAPICallback = data => {
		document.getElementById("json").innerHTML = JSON.stringify(data, null, 2);
	};

	const fnShowWelcomeMessage = () => {
		let vBtnLogin = document.getElementById('SignIn');
		vBtnLogin.innerHTML = 'Sign Out';
		vBtnLogin.setAttribute('onclick', 'fnLogin.fnSignOut();');
	};

	return {
			gAuthObj
		,	fnInit
		,	fnSignIn
		,	fnSignOut
		}
}();