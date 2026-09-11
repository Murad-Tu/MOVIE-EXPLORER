// =============================================================
//  MOVIE EXPLORER  –  Vanilla JS Events (Learning File)
//  Every section teaches a different type of JS event.
// =============================================================

// ─────────────────────────────────────────────────────────────
// KEY CONCEPT: DOMContentLoaded
//    We wrap everything in this event so our JS only runs AFTER
//    the browser has finished reading the HTML.
//    Without this, querySelector() could return null.
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1.  GRAB ELEMENTS  (querySelector / getElementById)
  //     We select elements ONCE and store them in variables.
  //     This is faster than calling querySelector every time.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const searchInput      = document.getElementById("searchInput");
  const searchBtn        = document.querySelector(".search-btn");
  const genrePills       = document.querySelectorAll(".genre-pill");
  const saveBtns         = document.querySelectorAll(".save-btn");
  const removeBtns       = document.querySelectorAll(".remove-btn");
  const clearBtn         = document.querySelector(".clear-watchlist-btn");
  const bookmarkBtns     = document.querySelectorAll(".bookmark-btn");
  const darkToggle       = document.querySelector(".dark-toggle");
  const movieCards       = document.querySelectorAll(".movie-card");
  const watchlistCount   = document.querySelector(".watchlist-count");
  const wlCountBadge     = document.querySelector(".wl-count-badge");

  let watchlistTotal = document.querySelectorAll(".watchlist-item").length;


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2.  CLICK EVENT  –  Search Button
  //     addEventListener(eventType, callbackFunction)
  //     The callback receives an "event" object automatically.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  searchBtn.addEventListener("click", function (event) {
    const query = searchInput.value.trim();

    if (query === "") {
      searchInput.style.outline = "2px solid crimson";
      setTimeout(() => { searchInput.style.outline = ""; }, 1000);
      return;
    }

    console.log("Search clicked! Query:", query);
    showToast('Searching for "' + query + '"...');
  });


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3.  KEYBOARD EVENT  –  Enter / Escape inside search input
  //     "keydown" fires the moment a key is pressed.
  //     event.key gives the name of the key ("Enter", "Escape")
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchBtn.click();
    }
    if (event.key === "Escape") {
      searchInput.value = "";
      console.log("Search cleared with Escape");
    }
  });


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4.  INPUT EVENT  –  Live character-by-character filtering
  //     "input" fires on every keystroke, paste, or deletion.
  //     event.target is the element that triggered the event.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  searchInput.addEventListener("input", function (event) {
    const liveValue = event.target.value.toLowerCase();
    console.log("Live input:", liveValue);

    movieCards.forEach(function (card) {
      const title = card.querySelector(".movie-title").textContent.toLowerCase();
      const col   = card.closest('[class*="col-"]');
      if (col) col.style.display = title.includes(liveValue) ? "" : "none";
    });
  });


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5.  CLICK EVENT + CLASS TOGGLING  –  Genre Filter Pills
  //     forEach() loops over a NodeList.
  //     classList.remove() / classList.add() update CSS classes.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  genrePills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      const selectedGenre = this.textContent;

      genrePills.forEach(function (p) { p.classList.remove("active-genre"); });
      this.classList.add("active-genre");

      console.log("Genre selected:", selectedGenre);
      showToast("Genre: " + selectedGenre);
    });
  });


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6.  CLICK EVENT  –  Save buttons (Add to Watchlist)
  //     closest() walks UP the DOM tree to find a parent.
  //     disabled = true prevents the button being clicked again.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  saveBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const card  = btn.closest(".movie-card");
      const title = card.querySelector(".movie-title").textContent;

      btn.innerHTML = '<i class="fa-solid fa-check me-1"></i>Saved!';
      btn.disabled  = true;
      btn.style.opacity = "0.7";

      watchlistTotal++;
      updateWatchlistCount(watchlistTotal);

      console.log("Saved to watchlist:", title);
      showToast('"' + title + '" added to watchlist!');
    });
  });


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 7.  CLICK EVENT  –  Remove buttons (Watchlist sidebar)
  //     element.remove() deletes the element from the DOM.
  //     setTimeout() delays code by X milliseconds.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  removeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const item  = btn.closest(".watchlist-item");
      const title = item.querySelector(".watchlist-movie-title").textContent;

      item.style.transition = "opacity 0.3s, transform 0.3s";
      item.style.opacity    = "0";
      item.style.transform  = "translateX(20px)";

      setTimeout(function () {
        item.remove();
        watchlistTotal = Math.max(0, watchlistTotal - 1);
        updateWatchlistCount(watchlistTotal);
        console.log("Removed:", title);
        showToast('"' + title + '" removed');
      }, 300);
    });
  });


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 8.  CLICK EVENT  –  Clear Entire Watchlist
  //     querySelectorAll returns a NodeList – we use forEach
  //     to loop over every item and remove it.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      const allItems = document.querySelectorAll(".watchlist-item");

      if (allItems.length === 0) {
        showToast("Watchlist is already empty!");
        return;
      }

      allItems.forEach(function (item) { item.remove(); });
      watchlistTotal = 0;
      updateWatchlistCount(0);
      console.log("Watchlist cleared");
      showToast("Watchlist cleared!");
    });
  }


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 9.  CLICK EVENT  –  Bookmark buttons (Top Rated)
  //     classList.toggle() adds a class if absent, removes if present.
  //     classList.replace(oldClass, newClass) swaps one class for another.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  bookmarkBtns.forEach(function (btn) {
    if (btn.classList.contains("text-danger")) return;

    btn.addEventListener("click", function () {
      const icon = btn.querySelector("i");
      icon.classList.toggle("fa-regular");
      icon.classList.toggle("fa-solid");
      btn.classList.toggle("bookmarked");

      const isBookmarked = btn.classList.contains("bookmarked");
      const title = btn.closest(".top-rated-item").querySelector(".top-rated-title").textContent;

      console.log(isBookmarked ? "Bookmarked:" : "Un-bookmarked:", title);
      showToast(isBookmarked ? '"' + title + '" bookmarked!' : '"' + title + '" un-bookmarked');
    });
  });


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 10. CLICK EVENT  –  Dark Mode Toggle
  //     document.body.classList.toggle() flips a class on <body>.
  //     All CSS rules scoped to that class apply/disappear instantly.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (darkToggle) {
    darkToggle.addEventListener("click", function () {
      document.body.classList.toggle("light-mode");
      const isDark = !document.body.classList.contains("light-mode");
      const toggleIcon = darkToggle.querySelector(".toggle-icon");
      const moonIcon   = darkToggle.querySelector(".fa-moon, .fa-sun");

      if (isDark) {
        toggleIcon.classList.replace("fa-toggle-off", "fa-toggle-on");
        if (moonIcon) moonIcon.className = moonIcon.className.replace("fa-sun", "fa-moon");
      } else {
        toggleIcon.classList.replace("fa-toggle-on", "fa-toggle-off");
        if (moonIcon) moonIcon.className = moonIcon.className.replace("fa-moon", "fa-sun");
      }

      console.log("Dark mode:", isDark);
    });
  }


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 11. MOUSE EVENTS  –  mouseenter / mouseleave on cards
  //     These fire when the mouse enters or leaves an element.
  //     "this" inside a regular function = the element with the listener.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  movieCards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      this.style.transform  = "translateY(-6px) scale(1.02)";
      this.style.transition = "transform 0.25s ease";
      this.style.zIndex     = "10";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "";
      this.style.zIndex    = "";
    });
  });


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 12. SCROLL EVENT  –  Navbar shadow when page scrolls
  //     The "scroll" event fires on the window object.
  //     window.scrollY = how many pixels down the page is scrolled.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const siteHeader = document.querySelector(".site-header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  });


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 13. FOCUS & BLUR EVENTS  –  Search input highlight
  //     "focus" fires when the element is activated (clicked in).
  //     "blur"  fires when it loses focus (clicked elsewhere).
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const searchBar = document.querySelector(".search-bar");

  searchInput.addEventListener("focus", function () {
    searchBar.classList.add("search-focused");
    console.log("Search input focused");
  });

  searchInput.addEventListener("blur", function () {
    searchBar.classList.remove("search-focused");
    console.log("Search input blurred");
  });


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 14. CONTEXTMENU EVENT  –  Right-click on movie cards
  //     event.preventDefault() blocks the browser's default action.
  //     Here it stops the right-click menu from appearing.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  movieCards.forEach(function (card) {
    card.addEventListener("contextmenu", function (event) {
      event.preventDefault();
      const title = card.querySelector(".movie-title").textContent;
      console.log("Right-clicked on:", title);
      showToast('Right-clicked: "' + title + '"');
    });
  });


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 15. DBLCLICK EVENT  –  Double-click for quick add
  //     "dblclick" fires when the user clicks twice rapidly.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  movieCards.forEach(function (card) {
    card.addEventListener("dblclick", function () {
      const title = card.querySelector(".movie-title").textContent;
      console.log("Double-click quick-add:", title);
      showToast('Quick-added "' + title + '" to watchlist!');
    });
  });


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HELPER: updateWatchlistCount(n)
  //   Updates both the navbar count pill and the sidebar badge.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function updateWatchlistCount(n) {
    if (watchlistCount) watchlistCount.textContent = n;
    if (wlCountBadge)   wlCountBadge.textContent   = "(" + n + ")";
  }


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HELPER: showToast(message)
  //   Creates a toast notification using:
  //   - document.createElement()   -> makes a new element
  //   - document.body.appendChild() -> adds it to the page
  //   - setTimeout()               -> runs code after a delay
  //   - element.remove()           -> removes it from the DOM
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;

    Object.assign(toast.style, {
      position:      "fixed",
      bottom:        "80px",
      left:          "50%",
      transform:     "translateX(-50%)",
      background:    "rgba(30,30,40,0.95)",
      color:         "#fff",
      padding:       "10px 22px",
      borderRadius:  "999px",
      fontSize:      "0.9rem",
      zIndex:        "9999",
      boxShadow:     "0 4px 20px rgba(0,0,0,0.4)",
      transition:    "opacity 0.3s",
      pointerEvents: "none",
      whiteSpace:    "nowrap",
    });

    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = "0";
      setTimeout(function () { toast.remove(); }, 300);
    }, 2000);
  }

  console.log("Movie Explorer JS loaded! All events ready.");

}); // end DOMContentLoaded
