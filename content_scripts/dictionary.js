let DATAJSON;

function getSelectionInfo(event) {
  let boundingRect;

  if (window.getSelection().toString().length > 1) {
    boundingRect = getSelectionCoords(window.getSelection());
  } else {
    return null;
  }

  let top = boundingRect.top + window.scrollY,
    bottom = boundingRect.bottom + window.scrollY,
    left = boundingRect.left + window.scrollX;

  if (boundingRect.height == 0) {
    top = event.pageY;
    bottom = event.pageY;
    left = event.pageX;
  }

  return {
    top: top,
    bottom: bottom,
    left: left,
    clientY: event.clientY,
    height: boundingRect.height
  };
}

function getSelectionCoords(selection) {
  const oRange = selection.getRangeAt(0); //get the text range
  const oRect = oRange.getBoundingClientRect();
  return oRect;
}

function createDiv(info, word) {
  const hostDiv = document.createElement("div");

  hostDiv.className = "dictionaryDiv";
  hostDiv.style.left = info.left - 10 + "px";
  hostDiv.style.position = "absolute";
  hostDiv.attachShadow({ mode: 'open' });

  const shadow = hostDiv.shadowRoot;
  let style = document.createElement("style");
  style.textContent = ".mwe-popups{background:#fff;position:absolute;z-index:110;-webkit-box-shadow:0 30px 90px -20px rgba(0,0,0,0.3),0 0 1px #efefef;box-shadow:0 30px 90px -20px rgba(0,0,0,0.3),0 0 1px #efefef;padding:0;font-size:14px;min-width:300px;border-radius:2px}.mwe-popups.mwe-popups-is-not-tall{width:320px}.mwe-popups .mwe-popups-container{color:#222;margin-top:-9px;padding-top:9px;text-decoration:none}.mwe-popups.mwe-popups-is-not-tall .mwe-popups-extract{min-height:40px;max-height:140px;overflow:hidden;margin-bottom:47px;padding-bottom:0}.mwe-popups .mwe-popups-extract{margin:16px;display:block;color:#222;text-decoration:none;position:relative} .mwe-popups.flipped_y:before{content:'';position:absolute;border:8px solid transparent;border-bottom:0;border-top: 8px solid #efefef;bottom:-8px;left:10px}.mwe-popups.flipped_y:after{content:'';position:absolute;border:11px solid transparent;border-bottom:0;border-top:11px solid #fff;bottom:-7px;left:7px} .mwe-popups.mwe-popups-no-image-tri:before{content:'';position:absolute;border:8px solid transparent;border-top:0;border-bottom: 8px solid #efefef;top:-8px;left:10px}.mwe-popups.mwe-popups-no-image-tri:after{content:'';position:absolute;border:11px solid transparent;border-top:0;border-bottom:11px solid #fff;top:-7px;left:7px} .audio{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAcUlEQVQ4y2P4//8/AyUYQhAH3gNxA7IAIQPmo/H3g/QA8XkgFiBkwHyoYnRQABVfj88AmGZcTuuHyjlgMwBZM7IE3NlQGhQe65EN+I8Dw8MLGgYoFpFqADK/YUAMwOsFigORatFIlYRElaRMWmaiBAMAp0n+3U0kqkAAAAAASUVORK5CYII=);background-position: center;background-repeat: no-repeat;cursor:pointer;margin-left: 8px;opacity: 0.5; width: 16px; display: inline-block;} .audio:hover {opacity: 1;}";
  shadow.appendChild(style);

  const encapsulateDiv = document.createElement("div");
  encapsulateDiv.style = "all: initial; text-shadow: transparent 0px 0px 0px, rgba(0,0,0,1) 0px 0px 0px !important;";
  shadow.appendChild(encapsulateDiv);

  const popupDiv = document.createElement("div");
  popupDiv.style = "font-family: arial,sans-serif; border-radius: 2px; border: 1px solid #efefef; width: auto;";
  encapsulateDiv.appendChild(popupDiv);

  const contentContainer = document.createElement("div");
  contentContainer.className = "mwe-popups-container";
  popupDiv.appendChild(contentContainer);

  const content = document.createElement("div");
  content.className = "mwe-popups-extract";
  content.style = "line-height: 1.4; margin-top: 0px; margin-bottom: 11px; max-height: none";
  contentContainer.appendChild(content);

  const heading = document.createElement("h3");
  heading.style = "margin-block-end: 0px; display:inline-block; color: #c90101";
  heading.textContent = word;

  const meaning = document.createElement("p");
  meaning.style = "margin: 5px 0;";

  const description = document.createElement("p");
  description.style = "margin: 5px 0;";
  description.textContent = "Searching...";

  const moreInfo = document.createElement("a");
  moreInfo.style = "margin-top: 5px; color: #494949;"
  moreInfo.target = "_blank";

  content.appendChild(heading);
  content.appendChild(meaning);
  content.appendChild(description);
  content.appendChild(moreInfo);

  // GOOGLE DIV
  const googleDefinitionDiv = document.createElement("div");
  googleDefinitionDiv.className = "google-info";
  googleDefinitionDiv.style = "margin-top: 20px; display: flex; flex-direction: column; font-style: italic";
  content.appendChild(googleDefinitionDiv);

  const googleDefinitionHeading = document.createElement("h3");
  googleDefinitionHeading.style = "margin-block-end: 0px; display:inline-block; color: #c90101;";

  const googleDefinitionDescription = document.createElement("p");
  googleDefinitionDescription.style = "color: #494949;";
  googleDefinitionDescription.target = "_blank";

  const googleDefinitionLink = document.createElement("a");
  googleDefinitionLink.style = "color: #494949;";
  googleDefinitionLink.target = "_blank";

  googleDefinitionDiv.appendChild(googleDefinitionHeading);
  googleDefinitionDiv.appendChild(googleDefinitionDescription);
  googleDefinitionDiv.appendChild(googleDefinitionLink);

  // WIKI DIV 
  const wikiDefinitionDiv = document.createElement("div");
  wikiDefinitionDiv.className = "wiki-info";
  wikiDefinitionDiv.style = "margin-top: 20px; display: flex; flex-direction: column; font-style: italic";
  content.appendChild(wikiDefinitionDiv);

  const wikiDefinition = document.createElement("h3");
  wikiDefinition.style = "margin-block-end: 0px; margin-block-start: 0px; display:inline-block; color: #c90101;";

  const wikiDefinitionLinkOne = document.createElement("a");
  wikiDefinitionLinkOne.style = "color: #494949;";
  wikiDefinitionLinkOne.target = "_blank";

  const wikiDefinitionLinkTwo = document.createElement("a");
  wikiDefinitionLinkTwo.style = "color: #494949;";
  wikiDefinitionLinkTwo.target = "_blank";

  const wikiDefinitionLinkThree = document.createElement("a");
  wikiDefinitionLinkThree.style = "color: #494949;";
  wikiDefinitionLinkThree.target = "_blank";

  wikiDefinitionDiv.appendChild(wikiDefinition);
  wikiDefinitionDiv.appendChild(wikiDefinitionLinkOne);
  wikiDefinitionDiv.appendChild(wikiDefinitionLinkTwo);
  wikiDefinitionDiv.appendChild(wikiDefinitionLinkThree);

  document.body.appendChild(hostDiv);

  if (info.clientY < window.innerHeight / 2) {
    popupDiv.className = "mwe-popups mwe-popups-no-image-tri mwe-popups-is-not-tall";
    hostDiv.style.top = info.bottom + 10 + "px";
    if (info.height == 0) {
      hostDiv.style.top = parseInt(hostDiv.style.top) + 8 + "px";
    }
  } else {
    popupDiv.className = "mwe-popups flipped_y mwe-popups-is-not-tall";
    hostDiv.style.top = info.top - 10 - popupDiv.clientHeight + "px";

    if (info.height == 0) {
      hostDiv.style.top = parseInt(hostDiv.style.top) - 8 + "px";
    }
  }

  return {
    heading,
    meaning,
    description,
    moreInfo,
    googleDefinitionHeading,
    googleDefinitionDescription,
    googleDefinitionLink,
    wikiDefinition,
    wikiDefinitionLinkOne,
    wikiDefinitionLinkTwo,
    wikiDefinitionLinkThree,
  };
}

function appendToDiv(createdDiv, dictionaryDefinition, googleDefinition, wikiDefinition) {
  const hostDiv = createdDiv.heading.getRootNode().host;
  const popupDiv = createdDiv.heading.getRootNode().querySelectorAll("div")[1];

  const heightBefore = popupDiv.clientHeight;

  if (dictionaryDefinition.meaning) {
    createdDiv.meaning.textContent = dictionaryDefinition.meaning;
    createdDiv.description.textContent = '';
  }
  if (dictionaryDefinition.description) {
    createdDiv.description.textContent = dictionaryDefinition.description;
  }
  if (dictionaryDefinition.more) {
    createdDiv.moreInfo.href = dictionaryDefinition.more;
    createdDiv.moreInfo.textContent = "More »";
  }
  if (googleDefinition?.description) {
    createdDiv.googleDefinitionHeading.textContent = googleDefinition.heading;
    createdDiv.googleDefinitionDescription.textContent = googleDefinition.description;
  }
  if (googleDefinition?.more) {
    createdDiv.googleDefinitionLink.href = googleDefinition.more;
    createdDiv.googleDefinitionLink.textContent = "More »";
  }
  if (wikiDefinition?.titles && wikiDefinition?.urls) {
    createdDiv.wikiDefinition.textContent = wikiDefinition.heading;
    createdDiv.wikiDefinitionLinkOne.textContent = `${wikiDefinition.titles[0]} »`;
    createdDiv.wikiDefinitionLinkOne.href = wikiDefinition.urls[0];
    createdDiv.wikiDefinitionLinkTwo.textContent = `${wikiDefinition.titles[1]} »`;
    createdDiv.wikiDefinitionLinkTwo.href = wikiDefinition.urls[1];
    createdDiv.wikiDefinitionLinkThree.textContent = `${wikiDefinition.titles[2]} »`;
    createdDiv.wikiDefinitionLinkThree.href = wikiDefinition.urls[2];
  }

  const heightAfter = popupDiv.clientHeight;
  const difference = heightAfter - heightBefore;

  if (popupDiv.classList.contains("flipped_y")) {
    hostDiv.style.top = parseInt(hostDiv.style.top) - difference + 1 + "px";
  }
}

function removeMeaning(event) {
  const element = event.target;
  if (!element.classList.contains("dictionaryDiv")) {
    document.querySelectorAll(".dictionaryDiv").forEach(function (Node) {
      Node.remove();
    });
  }
}

function init() {
  const url = chrome.runtime.getURL('dictionary.json');

  fetch(url)
    .then((response) => response.json()) //assuming file contains json
    .then(json => DATAJSON = json)
}
init();

// Extracts definition from Google API
function extractMeaning(document) {
  let website = document.querySelectorAll("div[class='yuRUbf']")[0].innerHTML;
  let more = website.substr(9, (website.indexOf(' ping=') - 10));

  let description = document.querySelectorAll("div[class='LGOjhe']")[0]?.textContent;
  description ? description : description = document.querySelectorAll("div[class='IsZvec']")[0]?.textContent;

  if (!description) { return null; }

  let googleDefinition = {
    heading: "Google definition",
    description,
    more,
  }

  return googleDefinition;
};

document.addEventListener('dblclick', (async (event) => {
  if (event.altKey === true) {

    const word = window.getSelection().toString();
    let info = getSelectionInfo(event);
    if (!info) { return; }

    let createdDiv = createDiv(info, word);

    // get dictionaryDefinition
    let dictionaryDefinition = DATAJSON.filter(term => term.acronym.toLowerCase() === word.toLowerCase())[0]
    if (!dictionaryDefinition) {
      dictionaryDefinition = { description: 'Term not found in local dictionary' }
    }

    // get googleDefinition
    const lang = 'en';
    const industry = 'cybersecurity';
    let urlGoogle = `https://www.google.com/search?hl=${lang}&q=define+${word}+${industry}`;
    const proxyurl = "https://cors-anywhere.herokuapp.com/";

    let googleDefinition = await fetch(proxyurl + urlGoogle, {
      method: 'GET',
      credentials: 'omit'
    })
      .then((response) => response.text()
        .then((text) => {
          const document = new DOMParser().parseFromString(text, 'text/html');
          return extractMeaning(document);
        })
      )
      .catch(() => console.log("Can’t access " + urlGoogle + " response. Blocked by browser?"))

    // get wikiDefinition
    let urlWiki = "https://en.wikipedia.org/w/api.php";

    let params = {
      action: "opensearch",
      search: word,
      limit: "3",
      namespace: "0",
      format: "json"
    };

    urlWiki = urlWiki + "?origin=*";
    Object.keys(params).forEach(function (key) { urlWiki += "&" + key + "=" + params[key]; });

    let responseWiki = await fetch(urlWiki)
      .then(function (response) { return response.json(); })
      .catch(function (error) { console.log(error); });

    let wikiDefinition;

    if (responseWiki[1].length > 0) {
      wikiDefinition = {
        heading: 'Related Wikipedia Articles',
        titles: responseWiki[1],
        urls: responseWiki[3],
      }
    }

    appendToDiv(createdDiv, dictionaryDefinition, googleDefinition, wikiDefinition);
  }
}));

document.addEventListener('click', removeMeaning);
