import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://champions-dad1e-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementListInDB = ref(database, "endorsementList");

const textAreaEl = document.getElementById("endorsement-textarea");
const publishButtonEl = document.getElementById("publish-button");
const endorsementListEl = document.getElementById("endorsement-list");

publishButtonEl.addEventListener("click", function () {
  let endorsementValue = textAreaEl.value;

  push(endorsementListInDB, endorsementValue);

  cleartextAreaEl();
});

onValue(endorsementListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let endorsementArray = Object.entries(snapshot.val());

    clearEndorsementList();

    for (let i = 0; i < endorsementArray.length; i++) {
      let currentEndorsement = endorsementArray[i];
      let currentEndorsementID = currentEndorsement[i];
      let currentEndorsementValue = currentEndorsement[1];

      appendEndorsementToEndorsementListEl(currentEndorsement);
    }
  } else {
    endorsementListEl.innerHTML = "No endorsements yet...";
  }
});

function clearEndorsementList() {
  endorsementListEl.innerHTML = "";
}

function cleartextAreaEl() {
  textAreaEl.value = "";
}

function appendEndorsementToEndorsementListEl(endorsement) {
  let endorsementID = endorsement[0];
  let endorsementValue = endorsement[1];

  let newEl = document.createElement("li");

  newEl.textContent = endorsementValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfendorsementInDB = ref(
      database,
      `endorsementList/${endorsementID}`
    );

    remove(exactLocationOfendorsementInDB);
  });

  endorsementListEl.append(newEl);
}
