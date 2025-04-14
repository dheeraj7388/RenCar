(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });


    // Car Categories
    $(".categories-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:3
            }
        }
    });


    // testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : false,
        navText : [
            '<i class="fa fa-angle-right"></i>',
            '<i class="fa fa-angle-left"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 5,
        time: 2000
    });


    // Back to top button
    $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Book Now button handler
    $(document).on('click', '.btn-book-now', function(e) {
        e.preventDefault();
        
        // Fetch cars data from backend
        $.ajax({
            url: '/cars',
            method: 'GET',
            success: function(response) {
                // Create modal content
                let modalContent = '<div class="modal fade" id="carsModal" tabindex="-1" aria-labelledby="carsModalLabel" aria-hidden="true">' +
                    '<div class="modal-dialog modal-lg">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<h5 class="modal-title" id="carsModalLabel">Available Cars</h5>' +
                    '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="row">';

                // Add car cards to modal
                response.forEach(car => {
                    modalContent += `
                        <div class="col-md-6 mb-4">
                            <div class="card h-100">
                                <img src="${car.imageUrl}" class="card-img-top" alt="${car.carModel}">
                                <div class="card-body">
                                    <h5 class="card-title">${car.carModel}</h5>
                                    <p class="card-text">
                                        <strong>Price:</strong> $${car.rentPerDay}/day<br>
                                        <strong>Location:</strong> ${car.location}<br>
                                        <strong>Seats:</strong> ${car.seats}<br>
                                        <strong>Transmission:</strong> ${car.transmission}<br>
                                        <strong>Fuel Type:</strong> ${car.fuelType}
                                    </p>
                                    <button class="btn btn-primary btn-select-car" data-car-id="${car._id}">
                                        Select Car
                                    </button>
                                </div>
                            </div>
                        </div>`;
                });

                modalContent += '</div></div></div></div></div>';

                // Add modal to body and show it
                $('body').append(modalContent);
                $('#carsModal').modal('show');
            },
            error: function(xhr, status, error) {
                console.error('Error fetching cars:', error);
                alert('Error loading available cars. Please try again later.');
            }
        });
    });

    // Handle car selection
    $(document).on('click', '.btn-select-car', function() {
        const carId = $(this).data('car-id');
        // Redirect to booking form with carId
        window.location.href = `/form.html?carId=${carId}`;
    });

})(jQuery);

