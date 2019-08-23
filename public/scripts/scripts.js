"use strict";

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

function getServices(category) {
    $("#serviceCard").hide();
    $("#servicesList").html("");

    // Grab data from current services
    $.getJSON(`/api/services/bycategory/${category}`, (services) => {
        // Loop through each service
        $.each(services, (index, service) => {
            let newCard = createCard(service);

            $("#servicesList").append(newCard)
            .on("click", (e) => {
                e.preventDefault();
                //getSelectedService(service.ServiceID);
            });
        });

        $("#servicesContainer").show();
    });
}

function createCard(service) {

    let card = $("<div>", {class: "card col-md-3 m-4"});
    let cardBody = $("<div>", {class: "card-body", id: service.ServiceID});
    let cardTitle = $("<h4>", {text: service.ServiceName});
    let cardText1 = $("<p>", {text: service.Description});
    let cardText2 = $("<p>", {text: service.Price});
    let cardButton = $("<a>", {href: "#", class: "btn btn-info", text: "More info"});

    card.append(cardBody);

    cardBody.append(cardTitle)
        .append(cardText1)
        .append(cardText2)
        .append(cardButton);

    // for(let i = 0; i < objs.Students.length; i++) {
    //     $("#student" + i).on("click", function() {
    //         captainCrunch = 
    //         "courseid=" + courseId + 
    //         "&studentname=" + objs.Students[i].StudentName + 
    //         "&email=" + objs.Students[i].Email;
    //         $("#unregisterModal").modal(focus);
    //     });
    // }

    return card;
}

// WIP
function getSelectedService(serviceId) {
    // Display service info in a card
    $.getJSON(`/api/services/${serviceId}`, (service) => {
        $("#cardTitle").html(service.ServiceName);
        $("#cardText1").html(service.Description);
        $("#cardText2").html("$" + Number(service.Price).toFixed(2));
        $("#serviceCard").show();
    });
}

function getCountDown(countDownDate) {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    $("#countDown").text(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");

    // If the count down is finished, commence party
    if (distance < 0) {
      clearInterval(x);
      $("#countDown").text("Opening day!");
    }
}

$(function() {
    // Load category and services
    getCategories();

    // Display category and hide home view
    $("#viewServicesBtn").on("click", () => {
        $("#categoryContainer").show();
        $("#homeView").hide();
    })

    // Display home view and hide category
    $("#homeBtn").on("click", () => {
        $("#homeView").show();
        $("#categoryContainer").hide();
        
        $("#categoryName").empty();
        $("#servicesList").empty();
        $("#serviceCard").hide();
    })

    var countDownDate = new Date("September 6, 2019").getTime();
    // Show on start up and then update below
    $("#countDown").text(getCountDown(countDownDate));
    // Update the count down every 1 second
    setInterval(getCountDown, 1000, countDownDate);
});