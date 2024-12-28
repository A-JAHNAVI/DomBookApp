const baseUrl = "https://global-nasal-environment.glitch.me";


// Ensure the user is logged in
document.addEventListener("DOMContentLoaded", () => {
  const loginData = JSON.parse(localStorage.getItem("loginData"));

  if (!loginData || loginData.email !== "user@empher.com") {
    alert("User Not Logged In");
    window.location.href = "index.html";
  }
});

// Function to render books
function renderBooks(books) {
  const grid = document.getElementById("bookGrid");
  grid.innerHTML = ""; // Clear the grid

  if (books.length === 0) {
    grid.innerHTML = `<p>No books found.</p>`;
    return;
  }

  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    bookCard.innerHTML = `
      <img src="${book.imageUrl}" alt="${book.title}" style="width:100%">
      <h3>${book.title}</h3>
      <p>Author: ${book.author}</p>
      <p>Category: ${book.category}</p>
      <p>Status: ${book.isAvailable ? "Available" : "Borrowed"}</p>
      ${
        book.isAvailable
          ? `<button onclick="borrowBook(${book.id})">Borrow</button>`
          : `<p>Borrowed Days: ${book.borrowedDays || "N/A"}</p>`
      }
    `;

    grid.appendChild(bookCard);
  });
}

// Fetch and display available books
document.getElementById("showAvailable").addEventListener("click", () => {
  fetch(`${baseUrl}?isAvailable=true`)
    .then((response) => response.json())
    .then((books) => {
      renderBooks(books);
    })
    .catch((error) => console.error("Error fetching available books:", error));
});

// Fetch and display borrowed books
document.getElementById("showBorrowed").addEventListener("click", () => {
  fetch(`${baseUrl}?isAvailable=false`)
    .then((response) => response.json())
    .then((books) => {
      renderBooks(books);
    })
    .catch((error) => console.error("Error fetching borrowed books:", error));
});

// Borrow a book
function borrowBook(id) {
  const borrowedDays = prompt("Enter the number of days to borrow the book:");
  if (!borrowedDays || isNaN(borrowedDays) || borrowedDays <= 0) {
    alert("Invalid input. Please enter a positive number.");
    return;
  }

  fetch(`${baseUrl}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isAvailable: false, borrowedDays }),
  })
    .then(() => {
      alert("Book borrowed successfully!");
      document.getElementById("showAvailable").click(); // Refresh available books
    })
    .catch((error) => console.error("Error borrowing book:", error));
}
