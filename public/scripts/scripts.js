/*
* Handles populating the drop downs as well as displaying card/info
* 
* Author: Neo
*/
"use strict";

/*
* Grab categories and populate
* 
*/
function getCategories() {
    // Grab data from categories
    $.getJSON("/api/categories/", (categories) => {
        // Loop through each category and assign attr
        $.each(categories, (index, category) => {
            $("#categoryList").append($("<a />")
            .text(category.Category)
            .attr("class", "dropdown-item")
            .attr("href", "#")
            .on("click", (e) => {
                e.preventDefault();
                $("#categoryName").text(category.Category);
                getServices(category.Value);
            }));
        });
    });
}

/*
* Grab services and populate
* 
* @param newCard (object) - Holds created card to be apended
* @param element (element) - Element to be appended to modal
*/
function getServices(category) {
    $("#serviceCard").hide();
    $("#servicesList").html("");

    // Grab data from current services
    $.getJSON(`/api/services/bycategory/${category}`, (services) => {
        // Loop through each service
        $.each(services, (index, service) => {
            let newCard = createCard(service);

            // Appends newly created card and fade in
            $("#servicesList").append(newCard)
            .hide()
            .fadeIn(200);

            // Wire in click event for each btn
            $("#" + service.ServiceID).on("click", function() {
                $("#modal-service").text(service.ServiceName);
                $("#infoModal").modal(focus);
            });
        });

        $("#servicesContainer").show();
    });
}


/*
* Dynamically create cards for each service
* 
* @param card (element) - Create main div
* @param cardBody (element) - Create body for div
* @param cardTitle (element) - Create title for div
* @param cardText1 (element) - Create text1 for div
* @param cardText2 (element) - Create text2 for div
* @param cardButton (element) - Create button for div
*/
function createCard(service) {
    // Remove any spaces
    let cardSrc = service.CategoryName.replace(/\s/g, "");

    // Dynamically create card info
    let card = $("<div>", {class: "card col-md-3 m-4"});
    let cardImg = $("<img>", {
        class: "card-img-top", 
        src: "images/" + cardSrc.toLowerCase() + ".jpg", 
        alt: service.CategoryName + " image"});
    let cardBody = $("<div>", {class: "card-body"});
    let cardTitle = $("<h4>", {text: service.ServiceName});
    let cardText1 = $("<p>", {text: service.Description});
    let cardText2 = $("<p>", {text: "Minutes: " + service.Minutes})
    let cardText3 = $("<p>", {text: "$" + service.Price});
    let cardButton = $("<a>", {href: "#", class: "btn btn-info far fa-calendar-check", id: service.ServiceID, text: "  Book Now"});

    // Append the body
    card.append(cardImg);
    card.append(cardBody);

    // Append each tag to the body
    cardBody.append(cardTitle)
        .append(cardText1)
        .append(cardText2)
        .append(cardText3)
        .append(cardButton);

    return card;
}

/*
* Resets reservation form
*/
function resetForm($form) {
    $form.find("input, textarea").val("");
}

/*
* Calculate countdown
* 
* @param now (date) - Grabs current date
* @param distance (date) - Compares difference between target date and now
* @param days (int) - Calculate days
* @param hours (int) - Calculate hours
* @param minutes (int) - Calculate minutes
* @param seconds (int) - Calculate seconds
*/
function getCountDown(countDownDate) {
    // Get today's date and time
    let now = new Date().getTime();

    // Find the distance between now and the count down date
    let distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    $("#countDown").text(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");

    // If the count down is finished, commence party
    if (distance < 0) {
      clearInterval(x);
      $("#countDown").text("Opening day!");
    }
}

/*
* Disables previous day from today in drop downs
*/
function disablePreviousDays() {
    const currDate = new Date();
    const currMonth = currDate.getMonth() > 9 ? currDate.getMonth() + 1 : '0' + (currDate.getMonth() + 1);
    const currDay = currDate.getDate() > 9 ? currDate.getDate() : '0' + currDate.getDate();
    const dateStr = currDate.getFullYear() + '-' + currMonth + '-' + currDay;
    return dateStr;
}

/*
* Validates reserve form
*/
function validateForm() {
    $("#errDate").empty();
    $("#errName").empty();

    if($("#reservationDate").val() == "") {
        $("#errDate").text("\u2022 Please select a date.")
        .prop("class", "red");
    }
    if($("#reservationName").val().trim() == "") {
        $("#errName").text("\u2022 Please enter your name.")
        .prop("class", "red");
    }

    if($("#errName").text() != "" || $("#errDate").text() != "") {
        return false;
    }
}

$(function() {
    // Load category and services
    getCategories();

    $("#reservationDate").val(new Date());
    $("#reservationDate").attr("min", disablePreviousDays());

    // Display category and hide home view
    $("#viewServicesBtn").on("click", () => {
        $("#homeView").fadeOut(200);
        $("#categoryContainer").fadeIn(2000);
    })

    // Display home view and hide category
    $("#homeBtn").on("click", () => {
        $("#categoryContainer").hide();
        $("#homeView").fadeIn(2000);
        
        $("#categoryName").empty();
        $("#servicesList").empty();
        $("#serviceCard").hide();
    })

    $("#contactUsBtn").on("click", () => {
        $("#contactModal").modal(focus);
    })

    $("#cancelModalBtn").on("click", () => {
        resetForm($("#reserveForm"));

        $("#errDate").empty();
        $("#errName").empty();
    })

    $("#confirmModalBtn").on("click", () => {
        let isValid = validateForm();

        if(isValid == false) {
            return false;
        }

        resetForm($("#reserveForm"));
    })

    var countDownDate = new Date("September 6, 2019").getTime();
    // Show on start up and then update below
    $("#countDown").text(getCountDown(countDownDate));
    // Update the count down every 1 second
    setInterval(getCountDown, 1000, countDownDate);
});