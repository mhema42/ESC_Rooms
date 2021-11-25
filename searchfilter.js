let value;
let challenge;
let modal = document.querySelector(".modal");
let overlay = document.querySelector(".overlay");
let selectTime = document.getElementById("time");
let selectNumber = document.getElementById("number");
let valueDate = document.getElementById("date").value;
let RatingFilterFrom = 0;
let RatingFilterTo = 5;

addEventListener("load", async function loadData() {
  let challenges = "https://lernia-sjj-assignments.vercel.app/api/challenges";
  const response = await fetch(challenges);
  const data = await response.json();
  challenge = data.challenges;
  renderChallenge(challenge);
});

// starrating from
document.addEventListener("DOMContentLoaded", () => {
  starsFrom = document.querySelectorAll(".rating-from li");
  starsFrom.forEach((item) => {
    item.addEventListener("click", function () {
      let ratingFrom = this.getAttribute("star-rating-from");
      star1 = document.getElementById("star1");
      if (ratingFrom > 1) {
        star1.setAttribute("star-rating-from", 1);
      }
      if (ratingFrom == 1) {
        this.setAttribute("star-rating-from", 0);
      }
      if (ratingFrom == 0) {
        this.setAttribute("star-rating-from", 1);
      }
      RatingFilterFrom = ratingFrom;
      let data = searchData(value, challenge);
      renderChallenge(data);
      return SetRatingStar(ratingFrom, starsFrom);
    });
  });
});

// starrating to
document.addEventListener("DOMContentLoaded", () => {
  starsTo = document.querySelectorAll(".rating-to li");

  starsTo.forEach((item) => {
    item.addEventListener("click", function () {
      let ratingTo = this.getAttribute("star-rating-to");
      star2 = document.getElementById("star2");
      if (ratingTo > 1) {
        star2.setAttribute("star-rating-to", 1);
      }
      if (ratingTo == 1) {
        this.setAttribute("star-rating-to", 0);
      }
      if (ratingTo == 0) {
        this.setAttribute("star-rating-to", 1);
      }
      RatingFilterTo = ratingTo;
      let data = searchData(value, challenge);
      renderChallenge(data);
      return SetRatingStar(ratingTo, starsTo);
    });
  });
});

// render stars before the star which got "click" and return rating value */
function SetRatingStar(rating, stars) {
  for (let i = 0; i < stars.length; i++) {
    if (i < rating) {
      stars[i].innerHTML = '<i class="fas fa-star"></i>';
    } else {
      stars[i].innerHTML = '<i class="far fa-star"></i>';
    }
  }
}

// return value to array from "type" if checked
let typeBoxes = document.querySelectorAll(".cb-type");
let typeArray = [];

typeBoxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", function () {
    typeArray = Array.from(typeBoxes)
      .filter((i) => i.checked)
      .map((i) => i.value);

    let data = searchData(value, challenge);
    renderChallenge(data);
  });
});

// return value to array from "labels" if checked
let labelBoxes = document.querySelectorAll(".cb-label");
let labelArray = [];

labelBoxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", function () {
    labelArray = Array.from(labelBoxes)
      .filter((i) => i.checked)
      .map((i) => i.value);

    let data = searchData(value, challenge);
    renderChallenge(data);
  });
});

// key word filter
inputData = document.getElementById("inputSearch");
inputData.addEventListener("keyup", function () {
  let data = searchData(value, challenge);
  renderChallenge(data);
});

// run filter
function searchData(value, data) {
  let filteredData = [];
  document.getElementById('filter-error').innerHTML = "";

  for (var i = 0; i < data.length; i++) {
    let value = inputData.value.toLowerCase();
    let title = data[i].title.toLowerCase();
    let description = data[i].description.toLowerCase();
    let labels = data[i].labels;
    let rating = data[i].rating;
    let type = data[i].type;

    if (rating >= RatingFilterFrom && rating <= RatingFilterTo) {
      if (type.includes(typeArray) || typeArray.length == 2) {
        if (labelArray.every((v) => labels.includes(v))) {
          if (title.includes(value) || description.includes(value)) {
            filteredData.push(data[i]);
          }
        }
      }
    }
  }
  if (filteredData.length == 0) {
    document.getElementById('filter-error').innerHTML = "No room match search";
    document.querySelector("#filter-error").classList.toggle("active", true);
  } else {
    document.querySelector("#filter-error").classList.toggle("active", false);
}
  return filteredData;
}

// display challenges
function renderChallenge(data) {
  let ul = document.getElementById("challenges-list");
  ul.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    rating = data[i].rating;
    let type = data[i].type;
    const starsTotal = 5;
    const starPercentage = (rating / starsTotal) * 100;
    const starPercentageRounded = Math.round(starPercentage / 10) * 10 + "%";

    let item = `
    <img class="challenge-picture" src=${data[i].image} />
    <h3 class="challenge-title">${data[i].title} (${data[i].type})</h3>
    <div class="challenge-meta">
        <ul class="challenge-rating">
            <div class="stars-outer">
            <div class="stars-inner" style=width:${starPercentageRounded}>
            </div>
            </div>
       </ul>
       <small class="challenge-size">${data[i].minParticipants}-${data[i].maxParticipants} participants </small>
    </div>
       <p class="challenge-description">${data[i].description}</p>    
    `;
    let bookBtn1 = `<a class="challenge-cta" href="#">Book this room</a>`;
    let bookBtn2 = `<a class="challenge-cta" href="#">Take challenge online</a>`;
    const li = document.createElement("li");

    if (type == "online") {
      li.innerHTML = item + bookBtn2;
    } else {
      li.innerHTML = item + bookBtn1;
    }

    li.querySelector(".challenge-cta").addEventListener(
      "click",

      function () {
        let min = Number(`${data[i].minParticipants}`);
        let max = Number(`${data[i].maxParticipants}`);

        while (min <= max) {
          selectNumber.options[selectNumber.options.length] = new Option(
            min + " participants"
          );
          min++;
        }
        document.querySelector(".RoomName1").innerHTML = `${data[i].title}`;
        document.querySelector(".RoomName2").innerHTML = `${data[i].title}`;

        modal.classList.toggle("open");
        overlay.classList.toggle("active");
      }
    );
    li.classList.add("challenges-item");
    ul.append(li);
  }
}

// mobile menu
document.querySelector(".main-nav-toggle").addEventListener("click", () => {
  document.querySelector(".main-nav").classList.toggle("open");
});

// toggle filters
document.querySelector(".filter-btn").addEventListener("click", () => {
  document.querySelector(".filter-btn").classList.toggle("close"),
    document.querySelector("#search").classList.toggle("open");
});
document.querySelector(".close-filter").addEventListener("click", () => {
  document.querySelector(".filter-btn").classList.remove("close"),
    document.querySelector("#search").classList.remove("open");

});

// bookning
document.querySelector(".modal-btn").addEventListener("click", () => {
  let today = new Date()
  let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  let datePlusYear = today.getFullYear() + 1 + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  valueDate = document.getElementById("date").value;

  if (valueDate < date) {
    alert("Date must be after todays date");
    return false;
  }
  if (valueDate > datePlusYear) {
    alert("Date can not exceed 1 year from todays date");
    return false;
  }
  if (!valueDate) {
    alert("Input must not be empty");
    return false;
  } else {

    async function datefunction() {
      avalibleDate = "https://lernia-sjj-assignments.vercel.app/api/booking/available-times?date=" + valueDate;
      let response = await fetch(avalibleDate);
      let dateArray = await response.json();

      for (let i = 0; i < dateArray.slots.length; i++) {
        selectTime.options[selectTime.options.length] = new Option(
          dateArray.slots[i]);
      }
    }
    datefunction();

    document.querySelector(".modal-step1").classList.toggle("close", true),
      document.querySelector(".modal-step2").classList.toggle("open", true);
  }
});

document.querySelector(".modal-btn2").addEventListener("click", () => {
  let valueName = document.getElementById("name").value;
  let valueEmail = document.getElementById("email").value;
  let valueDate = document.getElementById("date").value;
  let valueTime = document.getElementById("time").value;
  let valueNumber = document.getElementById("number").value;

  let booking = { name: valueName, email: valueEmail, date: valueDate, time: valueTime, participants: parseInt(valueNumber) };

  if (!valueName || !valueEmail || !valueTime || !valueNumber) {
    alert("Input must not be empty");
    return false;
  } else {

    fetch('https://lernia-sjj-assignments.vercel.app/api/booking/reservations', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    })
      .then(response => response.json())
      .then(booking => {
        console.log('Success:', booking);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    document.querySelector(".modal-step2").classList.toggle("close"),
      document.querySelector(".modal-step3").classList.toggle("open");
  }
});

//toggle modal
function removeOptions(selectTime, selectNumber) {
  let i, L = selectTime.options.length - 1;
  for(i = L; i >= 0; i--) {
     selectTime.options.remove(i);
  }
  let j, F = selectNumber.options.length - 1;
  for(j = F; j >= 0; j--) {
     selectNumber.options.remove(j);
  }
  document.getElementById("date").value = "";
  document.getElementById("email").value = "";
  document.getElementById("name").value = "";
}

function toggleClose() {
document.querySelector(".overlay").classList.toggle("active", false);
document.querySelector(".modal").classList.toggle("open", false);
document.querySelector(".modal-step1").classList.toggle("close", false);
document.querySelector(".modal-step2").classList.toggle("close", false);
document.querySelector(".modal-step2").classList.toggle("open", false);
document.querySelector(".modal-step3").classList.toggle("open", false);

removeOptions(selectTime, selectNumber);
}

document.querySelector(".close-modal").addEventListener("click", function E() {
  toggleClose();
})

document.querySelector(".modal-btn3").addEventListener("click", function F() {
  toggleClose();
})