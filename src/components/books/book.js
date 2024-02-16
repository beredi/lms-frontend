export const createNewBook = ({
  book_id,
  title,
  pages,
  year,
  description,
  authors,
  categories,
}) => {
  const authorsIds = authors.map((author) => {
    return author.value;
  });
  const categoriesIds = categories.map((category) => {
    return category.value;
  });
  return {
    book_id,
    title,
    pages,
    year,
    description,
    authors: authorsIds,
    categories: categoriesIds,
  };
};

export const updateBook = (
  book,
  { book_id, title, pages, year, description, authors, categories },
) => {
  const patch = {};

  if (title !== book.title) patch["title"] = title;
  if (book_id !== book.book_id) patch["book_id"] = book_id;
  if (pages !== book.pages) patch["pages"] = pages;
  if (year !== book.year) patch["year"] = year;
  if (description !== book.description) patch["description"] = description;

  if (!arraysAreEqual(book.authors, authors)) {
    const authorsIds = authors.map((author) => author.value);
    patch["authors"] = authorsIds;
  }
  if (!arraysAreEqual(book.categories, categories)) {
    const categoriesIds = categories.map((category) => category.value);
    patch["categories"] = categoriesIds;
  }

  return patch;
};

const canCreate = (authUser) => {
  return (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("CREATE_BOOK")
  );
};

const canEdit = (authUser) => {
  return (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("EDIT_BOOK")
  );
};

const canDelete = (authUser) => {
  return (
    authUser.roles.includes("admin") ||
    authUser.permissions.includes("DELETE_BOOK")
  );
};

export const check = (action, authUser) => {
  switch (action) {
    case "edit":
      return canEdit(authUser);
    case "delete":
      return canDelete(authUser);
    case "create":
      return canCreate(authUser);
    default:
      return false;
  }
};

export const arraysAreEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const arr1Ids = arr1.map((item) =>
    typeof item === "object" ? item.id : item,
  );
  const arr2Ids = arr2.map((item) =>
    typeof item === "object" ? item.value : item,
  );

  return arr1Ids.every((id) => arr2Ids.includes(id));
};
