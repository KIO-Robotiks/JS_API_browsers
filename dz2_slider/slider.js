document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll(".slider img");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const dots = document.querySelectorAll(".dot");
    let currentIndex = 0;

    // скрываем все слады, делаем неактивными доты, показываем слайд index и дот index
    function showSlide(index) {
        slides.forEach((slide) => {
            slide.style.display = "none";
        });
        dots.forEach((dot) => {
            dot.classList.remove("active");
        });
        slides[index].style.display = "block";
        dots[index].classList.add("active");
    }

    // следующий слайд
    function showNextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    // предыдущий слайд
    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    // жмём на доты
    function showSlideByDot(dotIndex) {
        currentIndex = dotIndex;
        showSlide(currentIndex);
    }

    // добавляем все события
    prevBtn.addEventListener("click", showPrevSlide);
    nextBtn.addEventListener("click", showNextSlide);
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlideByDot(index);
        });
    });

    // показываем первый слайд в начале
    showSlide(currentIndex);
});
