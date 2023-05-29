import select from "./lib.js";
const headers = new Headers();
headers.append("X-CSCAPI-KEY", "N0E0U1dBa2NVcTEydlg3YW9idGd5aTM1Rm5kVVl2aHZOdU5pVm5uRA==");

const requestOptions = {
  method: 'GET',
  headers: headers,
  redirect: 'follow'
};
const birthCountry = select("#birth-country");
const birthState = select("#birth-state");
const birthCity = select("#birth-city");

function getNames(url, name) {
  modal("loaderAni", "start");
  let baseUrl = "https://api.countrystatecity.in/v1/countries/"+url;
  console.log(baseUrl);
  fetch(baseUrl, requestOptions)
  .then(response => response.json())
  .then(data => {
    assignOptions(data, name)
    console.log(data)
  })
  .then(result => console.log(`Successfully fetched ${name} Names`))
  .catch(error => console.log('error', error));
}
getNames("", "Country");
/******/
const currentDate = new Date();
// Set the max attribute of the date input
select("#dob").setAttribute("max", currentDate.toISOString().split("T")[0]);


/*---------------------*/
function assignOptions(data, type) {
  const setOpt = ((elem, data)=> {
    elem.innerHTML = `<option selected disabled>Select ${type}</option>`
    //sorting data in ascending order of name
    data.sort((a, b)=> a.name.localeCompare(b.name));
    data.map(item => {
      elem.innerHTML += `<option value=${item.iso2},${item.name.split(" ").join("-")}> ${item.name} </option>`
      //assigned 2 values (item.iso2, item.name) to value attr.
    });
    modal("loaderAni", "stop");
  });
  if (type == "Country") {
    setOpt(birthCountry, data);
  } else if (type == "State") {
    setOpt(birthState, data);
  } else if (type == "City") {
    setOpt(birthCity, data);
  }
}
birthCountry.addEventListener("change", function() {
  const url = this.value.split(",")[0]+"/states";
  getNames(url, "State");
})
birthState.addEventListener("change", function() {
  const url = birthCountry.value.split(",")[0]+"/states/"+this.value.split(",")[0]+"/cities";
  getNames(url, "City");
})

function modal(type, command) {
  const loader = select("#loader");
  const modal = select(".modal");

  if (type == "loaderAni" && command == "start") {
    loader.classList.toggle("spinner");
    modal.style.width = "100vw";
  } else if (type == "loaderAni" && command == "stop") {
    loader.classList.toggle("spinner")
    modal.style.width = "0";
  } else if (type == "confirm" && command == "show") {
    modal.style.width = "100vw";
    loader.style.display = "none";
  } else if (type == "confirm" && command == "hide") {
    modal.style.width = "0";
  }
}


/*----------------*/

let obj = {
  name: "Sonu Prem Shivcharan",
  gender: "Male",
  dateOfBirth: "11/09/2003",
  birthTime: "20:35",
  birthPlace: "Solapur"
}



let objKeys = Object.keys(obj);



select("#form").addEventListener("submit", (event)=> {
  event.preventDefault();
  setObj();
});
function setObj() {
  const getValue = ((elem)=>select(elem).value.trim());
  const fullName = `${getValue("#first-name")} ${getValue("#mid-name")} ${getValue("#last-name")}`;
  const birthPlace = `${birthCity.value.split(",")[1]}, ${birthState.value.split(",")[1]}, ${birthCountry.value.split(",")[1]}`;
  const arrOfElem = [fullName,
    getValue("#gender"),
    getValue("#dob"),
    getValue("#tob"),
    birthPlace.trim()];
  //checking if all fields are filled
  const check = arrOfElem.some(item => /undefined|select/ig.test(item));
  if (check) {
    console.log("fill info");
  } else {
    for (let i = 0; i < objKeys.length; i++) {
      obj[objKeys[i]] = arrOfElem[i];
    }
    confirm(obj);
  }
}
function confirm(data) {
  const confirmDetails = select("#confirm-details");
  let details = ["Name",
    "Gender",
    "Date of Birth",
    "Time of birth",
    "Birth Place"];
  let temp;
  confirmDetails.innerHTML = `<h3>Confirm Details</h3>`;
  for (let i = 0; i < objKeys.length; i++) {
    temp = data[objKeys[i]];
    confirmDetails.innerHTML += `<p class="data">${details[i]} : <b>${temp}</b></p>`
    details[i] += ` : *${temp}*`;
  }
  sendMessage(details);
}
function sendMessage(data) {
  const encodedTxt = encodeURIComponent(data.join("\n"));
  const url = "https://wa.me/+918010096692?text="+encodedTxt;
  window.open(url, "_blank");
}
