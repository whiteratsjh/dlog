domready(() => {
	const dvProfile = getTag(".dropdown-toggle");
	if ( !dvProfile ) {
		return;
	}

	dvProfile.addEventListener("click", function() {
		const ilParent = this.parentElement;
		if ( ilParent.hasClass("open") ) {
			ilParent.removeClass("open");
			this.setAttribute("aria-expanded", false);
		}
		else {
			ilParent.addClass("open");
			this.setAttribute("aria-expanded", true);
		}
		event.stopPropagation();
	});
	document.addEventListener("click", () => {
		const aProfile = getTag(".dropdown-toggle");
		aProfile.parentElement.removeClass("open");
		aProfile.setAttribute("aria-expanded", false);
	});
	getTag("#aFolding").addEventListener("click", fnMenuFolding);
});

const fnCheckMobile = () => {
	const vFilter = "win16|win32|win64|mac|macintel|macamd";
	return vFilter.indexOf(navigator.platform.toLowerCase()) <= -1;
};

const fnSelectInit = (pElement, pTitle, pOptions) => {
	const vOption = document.createElement("option");
	vOption.value = "";
	vOption.text = pTitle;
	pElement.appendChild(vOption);

	pOptions.forEach(pItem => {
		const vOption = document.createElement("option");
		vOption.value = pItem;
		vOption.text = pItem;
		pElement.appendChild(vOption);
	});
};

// 메뉴 접힘상태 유지
const fnMenuFolding = () => {
	if ( !fnStorage.fnGetSession("cFolding") ) {
		fnStorage.fnSetSession("cFolding", "sidebar-collapse");
	} else {
		fnStorage.fnDropSession("cFolding");
	}
};

// fnRight("1234", 1) => "4"
const fnRight = (pValue, pLen) => {
	const vLen = pValue.length;
	return vLen <= pLen ? pValue : pValue.substring(vLen - pLen);
};

const fnMakeForm = (pOption, gTemplate) => {
	return gTemplate.form[pOption.type].formatObj(pOption);
};

// url 파라미터 가져오기
const fnGetParam = pParam => {
	const vLink = new URL(location.href);
	return vLink.searchParams.get(pParam);
};


// es6 selector
const getTag = pElement => {
	return document.querySelector(pElement);
};
// es6 selectors
const getTags = pElement => {
	const vElements = document.querySelectorAll(pElement);
	return vElements ? vElements : [];
};
const newTag = pElement => {
	return document.createElement(pElement);
};
const newText = pText => {
	return document.createTextNode(pText);
};
// left padding
const fnPad = (pValue, pLen) => {
	return fnRight(`${"0".repeat(pLen)}${pValue}`, pLen);
};
const getKeys = pObject => {
	return Object.getOwnPropertyNames(pObject);
};

const fnStorage = function () {
	// get data from localStorage
	const fnGetStorage = pKey => {
		const oResult = localStorage.getItem(pKey);
		return oResult === null ? "" : oResult;
	};
	// set data to localStorage
	const fnSetStorage = (pKey, pData) => {
		return localStorage.setItem(pKey, pData);
	};
	const fnDropStorage = pKey => {
		localStorage.removeItem(pKey);
	};

	// get data from localStorage
	const fnGetSession = pKey => {
		const oResult = sessionStorage.getItem(pKey);
		return oResult === null ? "" : oResult;
	};
	// set data to localStorage
	const fnSetSession = (pKey, pData) => {
		return sessionStorage.setItem(pKey, pData);
	};
	const fnDropSession = pKey => {
		sessionStorage.removeItem(pKey);
	};

	// 쿠키 가져오기
	const fnGetCookie = pName => {
		let vValue = "";
		const vCookie = document.cookie;

		pName += "=";
		let vStart = vCookie.indexOf(pName);

		if ( vStart > -1 ) {
			vStart += pName.length;
			let vEnd = vCookie.indexOf(";", vStart);
			if ( vEnd === -1 ) vEnd = vCookie.length;
			vValue = vCookie.substring(vStart, vEnd);
		}

		return unescape(vValue);
	};
	// 쿠키 생성
	const fnSetCookie = (pName, pValue, pDay) => {
		const vExpire = new Date();
		// 한글 깨짐을 막기위해 escape(pValue)를 합니다.
		let vCookies = `${pName}=${encodeURIComponent(pValue)}; Domain=.${document.domain}; path=/`;
		vExpire.setDate(vExpire.getDate() + pDay);

		// 만료일자 추가
		if ( typeof pDay !== "undefined" ) {
			vCookies += `; expires=${vExpire.toGMTString()};`;
		}

		document.cookie = vCookies;
	};
	// 쿠키 삭제
	const fnDropCookie = pName => {
		let vExpire = new Date();
		vExpire.setDate(vExpire.getDate() - 1);
		document.cookie = `${pName}= ; expires=${vExpire.toGMTString()}; path=/"`;
	};

	return {
			fnGetStorage
		,	fnSetStorage
		,	fnDropStorage
		,	fnGetSession
		,	fnSetSession
		,	fnDropSession
		,	fnSetCookie
		,	fnGetCookie
		,	fnDropCookie
		}
}();


Object.assign(Element.prototype, {
	// es6 selector
	getTag(pElement) {
		return this.querySelector(pElement);
	}
	// es6 selectors
,	getTags(pElement) {
		const vElements = this.querySelectorAll(pElement);
		return vElements ? vElements : [];
	}

,	newTag(pElement) {
		return this.appendChild(newTag(pElement));
	}
,	newText(pText) {
		return this.appendChild(newText(pText));
	}
,	setAttr(pKey, pValue) {
		this.setAttribute(pKey, pValue);
		return this;
	}
,	hasClass(pName) {
		return this.classList.contains(pName);
	}
,	addClass(pName) {
		if ( this.hasClass(pName) ) {
				return;
		}
		this.classList.add(pName);
		return this;
	}
,	removeClass(pName) {
		if ( !this.hasClass(pName) ) {
			return;
		}
		this.classList.remove(pName);
		return this;
	}
	// object 끼워넣기
,	insertAfter(pTarget, pBefore) {
		// 높은 번호에서 낮은 번호로 이동
		if ( pBefore ) {
			this.parentNode.insertBefore(this, pTarget);
		}
		// 낮은 번호에서 높은 번호로 이동
		else {
			if ( this.nextSibling ) {
				this.parentNode.insertBefore(this, pTarget.nextSibling);
			}
			else {
				this.parentNode.appendChild(pTarget);
			}
		}
	}
});

Object.assign(String.prototype, {
	/**
	 * 문자 치환
	 * ex: "가{0}다{1}마{0}".format("나","라") => "가나다라마나"
	 */
	format() {
		const args = arguments;
		return this.replace(/{(\d+)}/g, (m, n) => { return args[n] });
	}
,	formatObj() {
		const args = arguments;
		return this.replace(/{[A-Za-z]+}/g, pId => {
			return args[0][pId.substr(1, pId.length-2)];
		});
	}

	// 전체 replace
,	replaces() {
		const args = arguments;
		return this.replace(new RegExp(args[0], "gi"), args[1]);
		//	return this.split(args[0]).join(args[1]);
	}
	/**
	 * 문자열 좌측에 지정한 길이만큼 지정된 문자로 채움
	 * ex: "1".lpad("0", 2) => "01"
	 */
,	lpad() {
		const args = arguments;
		return fnRight(`${args[0].repeat(args[1])}${this}`, args[1]);
	}
});

Object.assign(Number.prototype, {
	lpad() {
		const args = arguments;
		return fnRight(`${args[0].repeat(args[1])}${this}`, args[1]);
	}
,	fnAddComma() {
		if ( isNaN(Number(this)) ) {
			return this;
		}
		if ( this.toString().indexOf(".") > -1 ) {
			let vResult = this.toString().split(".");
			vResult[1] = `.${vResult[1]}`;
			return `${vResult[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${vResult[1]}`;
		}

		return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
});

// 화면 상단우측 위치링크 만들기
// 사용법 아래참조
// fnInitTopPath([
// 	{	name: "영수증 목록"
// 	,	path: "/expense/index"
// 	,	icon: ""
// 	}
// ]);
// fnInitTopPath(vPagePathList);
const fnInitTopPath = pPathList => {
	const olPath = getTag("#olPath");
	const vLenght = pPathList.length;

	pPathList.forEach((pItem, pIdx) => {
		const vLink = vLenght === ++pIdx ? "javascript:" : pItem.path;
		const vObject = document.createElement("li");
		vObject.innerHTML = `<i class="fa fa-${pItem.icon}"></i> <a href="${vLink}">${pItem.name}</a>`;
		olPath.appendChild(vObject);
	});
};

const gFormatter = {
	phone : pPhone => {
		let vPhone = pPhone.toString();
		return `0${vPhone.substr(0,2)}-${vPhone.substr(2,4)}-${vPhone.substr(6,4)}`
	}
};