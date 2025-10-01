import { useState, useEffect, useMemo } from "react";
import { getUserMessage } from "./UserMessages";

const defaultFixedColumns = [
  {
    key: "name",
    label: "Carpet Name",
    defaultValue: "Carpet X",
  },
  {
    key: "supplier",
    label: "Supplier",
    defaultValue: "Supplier X",
  },
  {
    key: "ounce",
    label: "Ounce",
    isNumeric: true,
    defaultValue: 60,
  },
  {
    key: "cost",
    label: "Cost",
    isNumeric: true,
    headerSuffix: " /lm",
    format: (value) => `$${value}`,
    defaultValue: 120,
  },
  {
    key: "rrp",
    label: "RRP",
    isNumeric: true,
    headerSuffix: " /lm",
    format: (value) => `$${value}`,
    defaultValue: 180,
  },
  {
    key: "sale",
    label: "Sale Price",
    isNumeric: true,
    headerSuffix: " /lm",
    format: (value) => `$${value}`,
    defaultValue: 150,
  },
  {
    key: "profitMargin",
    label: "Profit Margin",
    isDerived: true,
    format: (value) => `${value.toFixed(1)}%`,
    derive: (row) => {
      if (!row) return 0;
      const cost = Number(row.cost ?? 0);
      const sale = Number(row.sale ?? 0);
      if (sale === 0) return 0;
      return ((sale - cost) / sale) * 100;
    },
  },
  {
    key: "discount",
    label: "Discount",
    isDerived: true,
    format: (value) => `${value.toFixed(1)}%`,
    derive: (row) => {
      if (!row) return 0;
      const rrp = Number(row.rrp ?? 0);
      const sale = Number(row.sale ?? 0);
      if (rrp === 0) return 0;
      return ((rrp - sale) / rrp) * 100;
    },
  },
];

const toKey = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+(\w)/g, (_, char) => char.toUpperCase())
    .replace(/\s/g, "");

const normalizeColumn = (column) => {
  const columnObject =
    typeof column === "string" ? { label: column } : { ...column };

  if (!columnObject.label) {
    throw new Error("Column definitions must include a label");
  }

  return {
    format: (value) => value,
    headerSuffix: "",
    isDerived: false,
    isNumeric: false,
    ...columnObject,
    key: columnObject.key ?? toKey(columnObject.label),
  };
};
const normalizeSortOption = (option, columnMap, fallbackKey) => {
  if (!option || !option.label) {
    throw new Error("Sort options must include a label");
  }

  const columnFromLabel = option.columnLabel
    ? columnMap[option.columnLabel]
    : undefined;
  const deriveValue =
    option.getValue ??
    (columnFromLabel && columnFromLabel.isDerived && columnFromLabel.derive
      ? (row) => columnFromLabel.derive(row)
      : undefined);
  const valueAccessor =
    deriveValue ||
    (columnFromLabel
      ? (row) => row[columnFromLabel.key]
      : option.key
      ? (row) => row[option.key]
      : fallbackKey
      ? (row) => row[fallbackKey]
      : () => undefined);

  const isNumeric = option.numeric ?? columnFromLabel?.isNumeric ?? false;
  const direction = option.direction === "desc" ? -1 : 1;

  const comparator =
    option.comparator ??
    ((a, b) => {
      const valueA = valueAccessor(a);
      const valueB = valueAccessor(b);

      if (isNumeric) {
        const numericA = Number(valueA ?? 0);
        const numericB = Number(valueB ?? 0);
        return direction * (numericA - numericB);
      }

      const stringA = String(valueA ?? "");
      const stringB = String(valueB ?? "");
      return (
        direction *
        stringA.localeCompare(stringB, undefined, {
          sensitivity: "base",
          numeric: true,
        })
      );
    });

  return {
    ...option,
    value: option.value ?? option.label,
    comparator,
  };
};
export default function ProductsTable({
  fixedColumns: fixedColumnsProp,
  initialData,
  sortOptions: sortOptionsProp,
  onRowsChange,
}) {
  // --- GLOBAL CONFIG ---
  const MAX_CUSTOM_COLUMNS = 10;
  const MAX_COLUMN_NAME_LENGTH = 30;

  // --- FIXED COLUMNS (cannot be deleted) ---
  const fixedColumns = useMemo(
    () => (fixedColumnsProp ?? defaultFixedColumns).map(normalizeColumn),
    [fixedColumnsProp]
  );

  const columnMap = useMemo(
    () =>
      Object.fromEntries(fixedColumns.map((column) => [column.label, column])),
    [fixedColumns]
  );
  const defaultProducts = useMemo(
    () => [
      {
        name: "Carpet 1",
        supplier: "Supplier 1",
        ounce: 99,
        cost: 100,
        rrp: 150,
        sale: 120,
      },
      {
        name: "Carpet 2",
        supplier: "Supplier 2",
        ounce: 40,
        cost: 90,
        rrp: 140,
        sale: 110,
      },
      {
        name: "Carpet 3",
        supplier: "Supplier 3",
        ounce: 60,
        cost: 120,
        rrp: 180,
        sale: 150,
      },
    ],
    []
  );

  const [products, setProducts] = useState(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      return initialData.map((item) => ({ ...item }));
    }
    return defaultProducts;
  });

  useEffect(() => {
    if (typeof onRowsChange === "function") {
      onRowsChange(products);
    }
  }, [onRowsChange, products]);

  useEffect(() => {
    if (!Array.isArray(initialData)) return;
    // if theres no initial data set it to default products
    if (initialData.length === 0) {
      setProducts([]);
      return;
    }
    // otherwise set it to initial data prop
    setProducts(initialData.map((item) => ({ ...item })));
  }, [initialData]);

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(""); // which column user wants to rename
  const [renameValue, setRenameValue] = useState(""); // new name input

  const [customColumns, setCustomColumns] = useState([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ------------------------------------------------------------------------
  const [userMessage, setUserMessage] = useState("");

  // formated headings function
  const formatColumnHeader = (columnLabel) => {
    const column = columnMap[columnLabel];
    if (!column) return columnLabel;
    if (column.headerSuffix) {
      return `${column.label}${column.headerSuffix}`;
    }

    return column.label;
  };

  // Tracks which column headers should be hidden from the table UI
  const [hiddenColumns, setHiddenColumns] = useState([]);

  // Delete column modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState("");

  //  state for edit buttons toggle
  const [editing, setEditing] = useState(false);

  // stores the product being edited - default as null - will change to the product
  // null so that can apply falsy / truthy values for modal open/close
  const [editingProduct, setEditingProduct] = useState(null);
  // stores edited values
  const [editValues, setEditValues] = useState({});

  // Search + filter + sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterColumn, setFilterColumn] = useState("All");
  const [selectedSort, setSelectedSort] = useState("None");

  // --- FUNCTIONS ---

  // Add row
  const handleAddRow = () => {
    if (products.length >= 1000) {
      alert(`You have reached the maximum number of rows (1000).`);
      return;
    }
    const newRow = {};
    fixedColumns.forEach((column) => {
      if (column.isDerived) return;
      if (column.defaultValue !== undefined) {
        newRow[column.key] = column.defaultValue;
      } else {
        newRow[column.key] = column.isNumeric ? 0 : "";
      }
    });
    customColumns.forEach((column) => {
      newRow[column] = "";
    });
    setProducts((prev) => [...prev, newRow]);
    const primaryColumn = fixedColumns[0];
    setUserMessage(
      getUserMessage({
        type: "rowAdded",
        label: (primaryColumn ? newRow[primaryColumn.key] : undefined) || "Row",
      })
    );
  };

  // Add custom column
  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    const colName = newColumnName.trim();
    if (customColumns.includes(colName)) {
      alert("This column already exists!");
      return;
    }
    if (colName.length > MAX_COLUMN_NAME_LENGTH) {
      alert(`Column name must be under ${MAX_COLUMN_NAME_LENGTH} characters.`);
      return;
    }
    if (customColumns.length + 1 > MAX_CUSTOM_COLUMNS) {
      alert("There are too many columns added!");
      return;
    }
    setCustomColumns([...customColumns, colName]);
    setProducts((prevProducts) =>
      prevProducts.map((p) => ({ ...p, [colName]: "" }))
    );
    setNewColumnName("");
    setShowModal(false);
    setUserMessage(getUserMessage({ type: "columnAdded", label: colName }));
  };

  // Delete custom column
  const handleDeleteColumn = () => {
    if (!columnToDelete) return;
    const deletedColumn = columnToDelete;

    setCustomColumns(customColumns.filter((col) => col !== deletedColumn));
    setHiddenColumns((prevHidden) =>
      prevHidden.filter((col) => col !== columnToDelete)
    );
    setProducts((curProducts) =>
      curProducts.map((product) => {
        const { [deletedColumn]: _, ...rest } = product;
        return rest;
      })
    );
    setColumnToDelete("");
    setShowDeleteModal(false);
    if (deletedColumn) {
      setUserMessage(
        getUserMessage({ type: "columnDeleted", label: deletedColumn })
      );
    }
  };

  // Handle edit button click
  const handleEditClick = (product, index) => {
    setEditingProduct(index); // store row index being edited

    // Map product object keys to the column display names used in the modal
    const initialValues = {};

    // Only include editable columns (skip derived columns)
    fixedColumns.forEach((column) => {
      if (hiddenColumns.includes(column.label)) return;
      if (column.isDerived) return;

      initialValues[column.label] = product[column.key] ?? "";
    });

    // Include any custom columns
    customColumns.forEach((col) => {
      if (hiddenColumns.includes(col)) return; // skip hidden custom columns

      initialValues[col] = product[col] ?? "";
    });

    setEditValues(initialValues);
  };

  // Save edited row
  const handleSaveEdit = () => {
    // Validate all numeric values before adding them to the row
    const numericValues = {};

    // find the input fields for the edited values
    for (const column of fixedColumns) {
      if (!column.isNumeric) continue;
      if (!(column.label in editValues)) continue;

      const rawValue = String(editValues[column.label]).trim();

      // boundary case - empty value
      if (rawValue === "") {
        alert(`${column.label} cannot be empty.`);
        return;
      }

      // boundary case - not a number
      // turn the value into a number (if possible)
      const numericValue = Number(rawValue);
      // if it doesn't turn into a number - alert user
      if (!Number.isFinite(numericValue)) {
        alert(`Please enter a valid number for ${column.label}.`);
        return;
      }
      // if all is valid then set value
      numericValues[column.key] = numericValue;
    }

    const updatedProducts = [...products];

    // Map back modal values to product keys
    const updatedProduct = { ...products[editingProduct] }; // start with original

    // Only update editable columns
    fixedColumns.forEach((column) => {
      if (hiddenColumns.includes(column.label)) return;
      if (column.isDerived) return;

      if (column.isNumeric) {
        updatedProduct[column.key] = numericValues[column.key] ?? 0;
      } else {
        updatedProduct[column.key] = editValues[column.label] ?? "";
      }
    });

    // Include custom columns
    customColumns.forEach((col) => {
      updatedProduct[col] = editValues[col] ?? "";
    });

    updatedProducts[editingProduct] = updatedProduct;

    setProducts(updatedProducts);
    const primaryColumn = fixedColumns[0];
    const editedRowLabel =
      updatedProduct.name || `Row ${Number(editingProduct) + 1}`;
    (primaryColumn ? updatedProduct[primaryColumn.key] : undefined) ||
      `Row ${Number(editingProduct) + 1}`;
    setUserMessage(
      getUserMessage({ type: "rowEdited", label: editedRowLabel })
    );
    setEditingProduct(null);
  };

  // Filtering
  let filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    if (filterColumn === "All") {
      return Object.values(product).some((val) =>
        String(val).toLowerCase().includes(search)
      );
    } else {
      const column = columnMap[filterColumn];
      const key = column ? column.key : filterColumn;
      const value =
        column && column.isDerived && column.derive
          ? column.derive(product)
          : product[key];
      return String(value ?? "")
        .toLowerCase()
        .includes(search);
    }
  });
  const primaryColumnKey = fixedColumns[0]?.key ?? "name";

  const normalizedSortOptions = useMemo(() => {
    const baseOptions = [
      { label: "Name (A-Z)", key: primaryColumnKey, direction: "asc" },
      { label: "Name (Z-A)", key: primaryColumnKey, direction: "desc" },
    ];

    const mergedOptions =
      Array.isArray(sortOptionsProp) && sortOptionsProp.length > 0
        ? [...baseOptions, ...sortOptionsProp]
        : baseOptions;

    return mergedOptions.map((option) =>
      normalizeSortOption(option, columnMap, primaryColumnKey)
    );
  }, [columnMap, primaryColumnKey, sortOptionsProp]);

  const selectedSortDefinition = useMemo(
    () =>
      normalizedSortOptions.find((option) => option.value === selectedSort) ||
      null,
    [normalizedSortOptions, selectedSort]
  );

  // Sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (!selectedSortDefinition) return 0;
    return selectedSortDefinition.comparator(a, b);
  });
  // Build a list of visible columns so to reuse  when rendering headers and rows
  const visibleColumns = [
    ...fixedColumns.map((column) => column.label),
    ...customColumns,
  ].filter((columnLabel) => !hiddenColumns.includes(columnLabel));
  // Filter so they are able to be sorted
  const visibleFilterableColumns = [
    ...fixedColumns
      .filter((column) => !column.isDerived)
      .map((column) => column.label),
  ].filter((columnLabel) => !hiddenColumns.includes(columnLabel));

  // --- Pagination setup ---
  const rowsPerPage = 20; // adjust how many rows per page
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  // Reset page when filteredProducts changes
  useEffect(() => {
    // set current page to 1 when any of the following states change
    setCurrentPage(1);
  }, [searchQuery, filterColumn, selectedSort, products]);

  useEffect(() => {
    // keep the page input synchronized with the current page and available pages
    // if there are no pages then default value 1
    if (totalPages === 0) {
      setPageInput("1");
      return;
    }

    const clampedCurrent = Math.min(currentPage, totalPages);
    if (clampedCurrent !== currentPage) {
      setCurrentPage(clampedCurrent);
    }
    setPageInput(String(clampedCurrent));
  }, [currentPage, totalPages]);
  // for when the user changes the input
  const handlePageInputChange = (event) => {
    // set page input to the value
    setPageInput(event.target.value);
  };
  //  go to page
  const handleGoToPage = () => {
    // set current page
    const pageNumber = Number(pageInput);

    if (!Number.isFinite(pageNumber)) return;

    const clampedPage = Math.min(
      Math.max(Math.floor(pageNumber), 1),
      totalPages
    );
    if (clampedPage) {
      setCurrentPage(clampedPage);
    }
  };

  useEffect(() => {
    // if a filtered column becomes hidden, reset back to "All" to avoid confusion
    if (filterColumn !== "All" && hiddenColumns.includes(filterColumn)) {
      setFilterColumn("All");
    }
  }, [filterColumn, hiddenColumns]);
  // ----------------------------------------------------------------------------------------------------------------
  // automatically updates when user messages changes
  useEffect(() => {
    if (!userMessage) return undefined;
    //  4 second timer
    const timeout = setTimeout(() => {
      setUserMessage("");
    }, 4000);

    return () => {
      clearTimeout(timeout);
    };
  }, [userMessage]);

  return (
    <div className=" max-w-full mt-0 mx-auto">
      {userMessage ? (
        <div className="mx-6 mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-blue-800">
          {userMessage}
        </div>
      ) : (
        <div className="mx-6 mb-4 rounded-lg  h-[42px] py-2 "></div>
      )}
      {/* --- SEARCH + FILTER + SORT --- */}
      <div className="flex flex-wrap items-center justify-between m-6 gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterColumn}
            onChange={(e) => setFilterColumn(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            {visibleFilterableColumns.map((col, i) => (
              <option key={i}>{col}</option>
            ))}
          </select>
        </div>

        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="None">Sort by...</option>

          {normalizedSortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => setEditing(!editing)}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        {editing ? "Hide Edit" : "Show Edit"}
      </button>

      {/* --- TABLE --- */}
      <div className="bg-white shadow-base rounded-2xl m-6 overflow-x-auto relative">
        <table className="w-full text-base border-collapse table-auto">
          <thead className="bg-gray-200 rounded-2xl">
            <tr>
              {/* Add "Actions" as first column */}
              {editing && (
                <td className="text-center">
                  <button
                    onClick={() => setShowRenameModal(true)}
                    className="text-left px-4 py-5 font-semibold text-gray-900 text-lg rounded-tl-xl"
                  >
                    ✏
                  </button>
                </td>
              )}

              {/* Render fixed + custom columns */}
              {visibleColumns.map((col, i) => (
                <th
                  key={i}
                  className={`text-left px-8 py-5 font-semibold text-gray-900 text-lg ${
                    i === visibleColumns.length - 1 ? "rounded-tr-xl" : ""
                  }`}
                >
                  {formatColumnHeader(col)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {currentProducts.length > 0 ? ( // <-- use currentProducts instead of filteredProducts
              currentProducts.map((product, rowIndex) => {
                return (
                  <tr key={rowIndex} className="hover:bg-gray-50 align-top">
                    {/* Edit button */}
                    {editing && (
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleEditClick(product, rowIndex)}
                          className="hover:text-blue-600"
                          title="Edit Row"
                        >
                          ✏
                        </button>
                      </td>
                    )}

                    {visibleColumns.map((columnLabel, i) => {
                      const column = columnMap[columnLabel];
                      let content;

                      if (column) {
                        const rawValue =
                          column.isDerived && column.derive
                            ? column.derive(product)
                            : product[column.key];
                        const safeValue =
                          rawValue === undefined || rawValue === null
                            ? ""
                            : rawValue;
                        content = column.format
                          ? column.format(safeValue)
                          : safeValue;
                      } else {
                        content = product[columnLabel] ?? "";
                      }

                      return (
                        <td key={i} className="px-8 py-4">
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length + (editing ? 1 : 0)}
                  className="px-8 py-6 text-center text-gray-500"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 my-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700" htmlFor="page-input">
              Page
            </label>
            <input
              id="page-input"
              type="number"
              min={1} // first page
              max={totalPages} // last page
              value={pageInput}
              // when user types -
              onChange={handlePageInputChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleGoToPage();
                }
              }}
              className="w-16 px-2 py-1 border border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">of {totalPages}</span>
            <button
              onClick={handleGoToPage} // function to go the the page
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Go
            </button>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* --- ACTION BUTTONS --- */}
      <div className="flex justify-between">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 ml-6 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          + Add Row
        </button>
        <div className="px-6 flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700"
          >
            + Add Column
          </button>
          {customColumns.length > 0 && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              🗑 Delete Column
            </button>
          )}
        </div>
      </div>

      {/* --- MODALS --- */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80">
            <h2 className="text-lg font-bold mb-4">Add New Column</h2>
            <input
              type="text"
              placeholder="Enter column name..."
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddColumn}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80">
            <h2 className="text-lg font-bold mb-4">Delete Column</h2>
            <select
              value={columnToDelete}
              onChange={(e) => setColumnToDelete(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
            >
              <option value="">Select column...</option>
              {customColumns.map((col, i) => (
                <option key={i} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteColumn}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={!columnToDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editingProduct !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96 max-h-[80vh] flex flex-col">
            <h2 className="text-lg font-bold mb-4">Edit Row</h2>

            {/* Scrollable container for inputs */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {visibleColumns.map((columnLabel) => {
                const column = columnMap[columnLabel];
                if (column && column.isDerived) return null; // skip derived fields

                return (
                  <div key={columnLabel}>
                    <label className="block font-semibold mb-1">
                      {columnLabel}
                    </label>
                    <input
                      type="text"
                      value={editValues[columnLabel] ?? ""}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          [columnLabel]: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    />
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex justify-between gap-2 mt-4">
              {/* Delete Row Button */}
              <button
                onClick={() => {
                  // editingProduct stores the row index (not the product object)
                  const idx = editingProduct;

                  // Safety: make sure the index is valid and get a readable name
                  const primaryColumn = fixedColumns[0];
                  const productLabel = primaryColumn
                    ? products[idx]?.[primaryColumn.key]
                    : undefined;
                  const productName = productLabel ?? `row ${idx + 1}`;

                  // Confirm with the user
                  if (
                    !window.confirm(
                      `Are you sure you want to delete "${productName}"?`
                    )
                  ) {
                    return; // user cancelled
                  }

                  // Remove the row by index (non-mutating)
                  setProducts((prev) => prev.filter((_, i) => i !== idx));
                  setUserMessage(
                    getUserMessage({ type: "rowDeleted", label: productName })
                  );

                  // Reset modal state
                  setEditingProduct(null);
                  setEditValues({}); // optional: clear edit values
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Row
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRenameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Manage Columns</h2>

            {/* Column Hidden toggle section */}
            <div className="mb-5 space-y-2">
              <p className="text-sm text-gray-600">
                Toggle a column to hide or show it in the table without deleting
                any data.
              </p>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                {/* iterate over the visiable columns and add check boxes for each */}
                {[
                  ...fixedColumns.map((column) => column.label),
                  ...customColumns,
                ].map((col) => (
                  <label
                    key={col}
                    className="flex items-center justify-between px-3 py-2 text-sm"
                  >
                    <span>{col}</span>
                    <input
                      type="checkbox"
                      // if its checked it is becaue it is inside the column and vice versa
                      checked={!hiddenColumns.includes(col)}
                      // when checked or not checked
                      onChange={() =>
                        // change value of hidden columns
                        setHiddenColumns((prevHidden) =>
                          // check whether it is checked or not
                          prevHidden.includes(col)
                            ? // if it is being unticked then filter the column out
                              prevHidden.filter((item) => item !== col)
                            : // otherwise add it to the hidden state
                              [...prevHidden, col]
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* --- Rename custom columns section --- */}
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
            >
              <option value="">Select column to rename...</option>
              {customColumns.map((col, i) => (
                <option key={i} value={col}>
                  {col}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter new column name..."
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
              disabled={!selectedColumn}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedColumn("");
                  setRenameValue("");
                  setShowRenameModal(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const trimmedSelected = selectedColumn.trim();
                  const trimmedRename = renameValue.trim();

                  if (trimmedSelected && !trimmedRename) {
                    alert("Please enter a new name for the selected column.");
                    return;
                  }

                  if (trimmedSelected && trimmedRename) {
                    // Update column name in customColumns array
                    const updatedColumns = customColumns.map((c) =>
                      c === trimmedSelected ? trimmedRename : c
                    );

                    // Update keys in product objects
                    setProducts((prevProducts) =>
                      prevProducts.map((product) => {
                        const { [trimmedSelected]: oldVal, ...rest } = product;
                        return { ...rest, [trimmedRename]: oldVal };
                      })
                    );
                    // Keep the hidden list in sync when a column is renamed
                    setHiddenColumns((prevHidden) =>
                      prevHidden.map((col) =>
                        col === trimmedSelected ? trimmedRename : col
                      )
                    );

                    setCustomColumns(updatedColumns);
                  }

                  setSelectedColumn("");
                  setRenameValue("");
                  setShowRenameModal(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
