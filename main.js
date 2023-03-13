let BOOKS = [];
let SEARCH_BOOKS = [];
const RENDER_UI = 'render-ui';
const TOAST_MSG = 'toast-message';
const RENDER_SEARCH_UI = 'render-search-ui';
const STORAGE_KEY = 'BOOKSHELF-APPS'

// Initial Function
document.addEventListener('DOMContentLoaded', function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const inputBookForm = document.getElementById('inputBook');
  inputBookForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addBook();
  });

  const searchBookForm = document.getElementById('searchBook');
  searchBookForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('searchBookTitle').value;
    getBook(title);
  })
});
// End Initial Function


// Utility Function
const generateId = () => {
  return +new Date();
};

const generateBookObject = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete
  };
};

const findBook = id => {
  for (const book of BOOKS) {
    if (book.id === id) {
      return book;
    }
  }
  return null;
}

const findBookByTitle = title => {
  SEARCH_BOOKS = [];
  for (const index in BOOKS) {
    const bookTitle = BOOKS[index].title;
    if (bookTitle.match(title)) {
      SEARCH_BOOKS.push(BOOKS[index]);
    }
  }
}

const findBookIndex = id => {
  for (const index in BOOKS) {
    if (BOOKS[index].id === id) {
      return index;
    }
  }
  return -1;
}

const setMessageToast = state => {
  const snackbar = document.getElementById('snackbar');
  if (state === 'move') {
    snackbar.innerText = 'Berhasil Menambah/Memindahkan Buku';
    snackbar.style.backgroundColor = 'green';
  } else if (state === 'delete') {
    snackbar.innerText = 'Berhasil Menghapus Buku';
    snackbar.style.backgroundColor = 'red';
  } else {
    snackbar.innerText = 'Berhasil Mengubah Buku';
    snackbar.style.backgroundColor = 'darkgoldenrod';
  }
}
// End Utility Function

// Storage Function
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(BOOKS);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      BOOKS.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_UI));
}
// End Storage Function

// Main Function
const addBook = () => {
  const id = generateId();
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  const bookObject = generateBookObject(id, title, author, year, isComplete);

  BOOKS.push(bookObject);
  document.dispatchEvent(new Event(RENDER_UI));
  setMessageToast('move');
  document.dispatchEvent(new Event(TOAST_MSG));
  saveData();
};

const getBook = title => {
  findBookByTitle(title);
  document.dispatchEvent(new Event(RENDER_SEARCH_UI));
}

const makeBook = (book) => {
  const { id, title, author, year, isComplete } = book;

  const bookTitle = document.createElement('h3');
  bookTitle.innerText = title;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = `Penulis: ${author}`;

  const bookYear = document.createElement('p');
  bookYear.innerText = `Tahun: ${year}`;

  const btnContainer = document.createElement('div');
  btnContainer.classList.add('action');

  const btnDone = document.createElement('button');
  btnDone.classList.add('green');

  const btnDelete = document.createElement('button');
  btnDelete.innerText = 'Hapus Buku';
  btnDelete.classList.add('red');
  btnDelete.addEventListener('click', function () {
    deleteBook(id);
  });

  const btnEdit = document.createElement('button');
  btnEdit.innerText = 'Edit Buku';
  btnEdit.classList.add('yellow');
  btnEdit.addEventListener('click', function () {
    showModal(id);
  });

  if (isComplete) {
    btnDone.innerText = 'Belum selesai dibaca';
    btnDone.addEventListener('click', function () {
      addBookToIncompleteShelf(id);
    })
  } else {
    btnDone.innerText = 'Selesai dibaca';
    btnDone.addEventListener('click', function () {
      addBookToCompleteShelf(id);
    });
  }

  btnContainer.append(btnDone, btnDelete, btnEdit);

  const bookArticle = document.createElement('article');
  bookArticle.classList.add('book_item');
  bookArticle.append(bookTitle, bookAuthor, bookYear, btnContainer);
  bookArticle.setAttribute('id', id);

  return bookArticle;
};

const makeSearchedBook = (book) => {
  const { id, title, author, year } = book;

  const bookTitle = document.createElement('h3');
  bookTitle.innerText = title;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = `Penulis: ${author}`;

  const bookYear = document.createElement('p');
  bookYear.innerText = `Tahun: ${year}`;

  const bookArticle = document.createElement('article');
  bookArticle.classList.add('book_item');
  bookArticle.append(bookTitle, bookAuthor, bookYear);
  bookArticle.setAttribute('id', id);
  return bookArticle;
}

const addBookToCompleteShelf = id => {
  const book = findBook(id);
  if (book == null) {
    console.log('Book Not Found');
    return;
  }
  book.isComplete = true;
  setMessageToast('move');
  document.dispatchEvent(new Event(TOAST_MSG));
  document.dispatchEvent(new Event(RENDER_UI));
  saveData();
}

const addBookToIncompleteShelf = id => {
  const book = findBook(id);
  if (book == null) {
    console.log('Book Not Found');
    return;
  }
  book.isComplete = false;
  setMessageToast('move');
  document.dispatchEvent(new Event(TOAST_MSG));
  document.dispatchEvent(new Event(RENDER_UI));
  saveData();
}

const deleteBook = id => {
  const bookId = findBookIndex(id);
  if (bookId === -1) {
    console.log('Book Index Not Found');
    return;
  }
  BOOKS.splice(bookId, 1);
  setMessageToast('delete');
  document.dispatchEvent(new Event(TOAST_MSG));
  document.dispatchEvent(new Event(RENDER_UI));
  saveData();
}
// End Main Function

// Custom-Event Listener
document.addEventListener(RENDER_UI, () => {
  console.log(`Isi BOOKS sekarang:`);
  console.log(BOOKS);

  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  for (const book of BOOKS) {
    const bookArticle = makeBook(book);
    if (book.isComplete) {
      completeBookshelfList.append(bookArticle);
    } else {
      incompleteBookshelfList.append(bookArticle);
    }
  }
});

document.addEventListener(RENDER_SEARCH_UI, function () {
  const searchResult = document.getElementById('searchResult');
  searchResult.innerHTML = '';
  for (const book of SEARCH_BOOKS) {
    const bookArticle = makeSearchedBook(book);
    searchResult.append(bookArticle);
  }
});

document.addEventListener(TOAST_MSG, () => {
  const snackbar = document.getElementById('snackbar');
  snackbar.classList.toggle('show');
  setTimeout(function () {
    snackbar.classList.toggle('show');
  }, 2000)
});

// End Custom-Event Listener

// Show Edit Modal Function
const showModal = id => {
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];
  const formEdit = document.getElementById('editBook');
  const bookTitle = document.getElementById('editBookTitle');
  const bookAuthor = document.getElementById('editBookAuthor');
  const bookYear = document.getElementById('editBookYear');
  const book = findBook(id);
  const filteredBooks = BOOKS.filter(item => item.title !== book.title);
  console.log('Filtered:');
  console.log(filteredBooks);

  bookTitle.value = book.title;
  bookAuthor.value = book.author;
  bookYear.value = book.year;
  modal.style.display = "block";

  span.onclick = function () {
    modal.style.display = "none";
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  formEdit.addEventListener('submit', function (e) {
    e.preventDefault();
    const bookObject = generateBookObject(book.id, bookTitle.value, bookAuthor.value, bookYear.value, book.isComplete);
    BOOKS = filteredBooks;
    BOOKS.push(bookObject);
    modal.style.display = 'none';
    document.dispatchEvent(new Event(RENDER_UI));
    setMessageToast('edit');
    document.dispatchEvent(new Event(TOAST_MSG));
    saveData();
  });
};
// End Show Edit Modal Function