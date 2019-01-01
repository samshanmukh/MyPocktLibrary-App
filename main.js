// Book Class: About the book
class Book {
	constructor(title, author, isbn) {
		this.title = title
		this.author = author
		this.isbn = isbn
	}
}

// UI Class: Control the Ui Tasks
class UI {
	static displayBooks() {

		const books = Store.getBooks();

		books.forEach((book) => UI.addBookToList(book));
	}

	static addBookToList(book) {
		const list = document.querySelector('#book-list');

		const row = document.createElement('tr');

		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href="#" class="delete">X</a></td>
		`;

		list.appendChild(row);
	}

	static deleteBook(el) {
		if(el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
		}
	}

	static showAlert(mesaage, className){
		const div = document.createElement('div');

		div.className = `alert alert-${className}`;

		div.appendChild(document.createTextNode(mesaage));

		const main = document.querySelector('.main');

		const form = document.querySelector('#book-form');

		main.insertBefore(div, form);

		// Make vanish the alert message in 3 seconds
		setTimeout(() => document.querySelector('.alert').remove(), 3000);
	}

	static clearFields() {
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#isbn').value = '';
	}
}

// Store Class: Local Storage (temporary storage)
class Store {
	static getBooks() {
		let books;

		if(localStorage.getItem('books') === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}

  	static addBook(book) {
    	const books = Store.getBooks();
    	books.push(book);
    	localStorage.setItem('books', JSON.stringify(books));
  	}

  	static removeBook(isbn) {
    	const books = Store.getBooks();

	    books.forEach((book, index) => {
    	  if(book.isbn === isbn) {
        	books.splice(index, 1);
        }
    });

	    localStorage.setItem('books', JSON.stringify(books));
	}
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
	// Prevent actual/default submit
	e.preventDefault();

	// Get Form Values
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const isbn = document.querySelector('#isbn').value;

	// Required inputs
	if(title === ''){
		UI.showAlert('Please add title of book.', 'danger');
	} else if(author === ''){
		UI.showAlert('Please add author of book.', 'danger');
	} else if (isbn === '') {
		UI.showAlert('Please add isbn number of book.', 'danger');
	} else {
		// Instantiate Book
		const book = new Book(title, author, isbn);

		// Add instantiated book to UI
		UI.addBookToList(book);

		// Add books to local storage
		Store.addBook(book);

		// Success message of adding book
		UI.showAlert('Book Added', 'success')

		// Clear the input fields after submit
		UI.clearFields();

	}

});
 
// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
	// Remove book from UI
	UI.deleteBook(e.target);

	// Remove from local storage
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

	// Success message of adding book
	UI.showAlert('Book Removed', 'normal')
});

