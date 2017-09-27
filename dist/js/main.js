(function () {
    if (window.addEventListener) {
        window.addEventListener('load', setUpSlideShow, false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', setUpSlideShow);
    }
})();


var slidePrefix = "slide-",
    slideControlPrefix = "slide-control-",
    slideHighlightClass = "highlight",
    slidesContainerID = "slides",
    slidesControlsID = "slides-controls",
    slideDelay = 3000,
    slideAnimationInterval = 20,
    slideTransitionSteps = 10;

function setUpSlideShow() {
    slidesCollection = getId(slidesContainerID).children;
    slidesControllersCollection = getId(slidesControlsID).children;
    totalSlides = slidesCollection.length;
    if (totalSlides < 2) { return; }
    for (var i = 0; i < slidesCollection.length; i++) {
        slidesCollection[i].id = slidePrefix + (i + 1);
        slidesControllersCollection[i].id = slideControlPrefix + (i + 1);
        slidesControllersCollection[i].onclick = function () { clickSlide(this); };
        if (i > 0) {
            slidesCollection[i].style.display = "none";
        } else {
            slidesControllersCollection[i].className = slideHighlightClass;
        }
    }
    slideTransStep = 0;
    transTimeout = 0;
    crtSlideIndex = 1;
    showSlide(2);
}

function showSlide(slideNo, immediate) {
    if (slideTransStep != 0 || slideNo == crtSlideIndex) {
        return;
    }
    clearTimeout(transTimeout);
    nextSlideIndex = slideNo;
    crtSlide = getId(slidePrefix + crtSlideIndex);
    nextSlide = getId(slidePrefix + nextSlideIndex);
    slideTransStep = 0;
    if (immediate == true) {
        transSlide();
    } else {
        transTimeout = setTimeout("transSlide()", slideDelay);
    }
}

function clickSlide(control) {
    showSlide(Number(control.id.substr(control.id.lastIndexOf("-") + 1)), true);
}

function transSlide() {
    nextSlide.style.display = "block";
    var opacity = slideTransStep / slideTransitionSteps;
    crtSlide.style.opacity = "" + (1 - opacity);
    crtSlide.style.filter = "alpha(opacity=" + (100 - opacity * 100) + ")";
    nextSlide.style.opacity = "" + opacity;
    nextSlide.style.filter = "alpha(opacity=" + (opacity * 100) + ")";
    if (++slideTransStep <= slideTransitionSteps) {
        transTimeout = setTimeout("transSlide()", slideAnimationInterval);
    } else {
        crtSlide.style.display = "none";
        transComplete();
    }
}

function transComplete() {
    slideTransStep = 0;
    crtSlideIndex = nextSlideIndex;
    if (nextSlide.style.removeAttribute) {
        nextSlide.style.removeAttribute("filter");
    }
    showSlide((crtSlideIndex >= totalSlides) ? 1 : crtSlideIndex + 1);
    for (var i = 0; i < slidesControllersCollection.length; i++) {
        slidesControllersCollection[i].className = "";
    }
    getId("slide-control-" + crtSlideIndex).className = slideHighlightClass;
}

function getId(id) {
    return document.getElementById(id);
};