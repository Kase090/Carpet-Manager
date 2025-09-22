import { useState, useEffect } from "react";

export default function ProductsTable() {
  // --- GLOBAL CONFIG ---
  const MAX_CUSTOM_COLUMNS = 10;
  const MAX_COLUMN_NAME_LENGTH = 30;

  // --- FIXED COLUMNS (cannot be deleted) ---
  const fixedColumns = [
    "Carpet Name",
    "Supplier",
    "Ounce",
    "Cost",
    "RRP",
    "Sale Price",
    "Profit Margin",
    "Discount",
  ];

  // --- STATE ---
  const [products, setProducts] = useState([
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
  ]);

  const [customColumns, setCustomColumns] = useState([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [showModal, setShowModal] = useState(false);

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
  const [sortOption, setSortOption] = useState("None");

  // --- FUNCTIONS ---

  // Add row
  const handleAddRow = () => {
    if (products.length >= 1000) {
      alert(`You have reached the maximum number of rows (1000).`);
      return;
    }
    const newRow = {
      name: "Carpet X",
      supplier: "Supplier X",
      ounce: 60,
      cost: 120,
      rrp: 180,
      sale: 150,
      ...Object.fromEntries(customColumns.map((col) => [col, ""])),
    };
    setProducts([...products, newRow]);
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
  };

  // Delete custom column
  const handleDeleteColumn = () => {
    if (!columnToDelete) return;
    setCustomColumns(customColumns.filter((col) => col !== columnToDelete));
    setProducts((curProducts) =>
      curProducts.map((product) => {
        const { [columnToDelete]: _, ...rest } = product;
        return rest;
      })
    );
    setColumnToDelete("");
    setShowDeleteModal(false);
  };

  // Handle edit button click
  const handleEditClick = (product, index) => {
    setEditingProduct(index); // store row index being edited

    // Map product object keys to the column display names used in the modal
    const initialValues = {};

    // Only include editable columns (skip Profit Margin & Discount)
    fixedColumns.forEach((col) => {
      if (col === "Profit Margin" || col === "Discount") return; // skip these

      switch (col) {
        case "Carpet Name":
          initialValues[col] = product.name;
          break;
        case "Supplier":
          initialValues[col] = product.supplier;
          break;
        case "Ounce":
          initialValues[col] = product.ounce;
          break;
        case "Cost":
          initialValues[col] = product.cost;
          break;
        case "RRP":
          initialValues[col] = product.rrp;
          break;
        case "Sale Price":
          initialValues[col] = product.sale;
          break;
        default:
          initialValues[col] = product[col] ?? "";
      }
    });

    // Include any custom columns
    customColumns.forEach((col) => {
      initialValues[col] = product[col] ?? "";
    });

    setEditValues(initialValues);
  };

  // Save edited row
  const handleSaveEdit = () => {
    const updatedProducts = [...products];

    // Map back modal values to product keys
    const updatedProduct = { ...products[editingProduct] }; // start with original

    // Only update editable columns
    fixedColumns.forEach((col) => {
      if (col === "Profit Margin" || col === "Discount") return;

      switch (col) {
        case "Carpet Name":
          updatedProduct.name = editValues[col] ?? "";
          break;
        case "Supplier":
          updatedProduct.supplier = editValues[col] ?? "";
          break;
        case "Ounce":
          updatedProduct.ounce = editValues[col] ?? 0;
          break;
        case "Cost":
          updatedProduct.cost = editValues[col] ?? 0;
          break;
        case "RRP":
          updatedProduct.rrp = editValues[col] ?? 0;
          break;
        case "Sale Price":
          updatedProduct.sale = editValues[col] ?? 0;
          break;
        default:
          updatedProduct[col] = editValues[col] ?? "";
      }
    });

    // Include custom columns
    customColumns.forEach((col) => {
      updatedProduct[col] = editValues[col] ?? "";
    });

    updatedProducts[editingProduct] = updatedProduct;

    setProducts(updatedProducts);
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
      const key = filterColumn.toLowerCase().replace(" ", "");
      return String(product[key]).toLowerCase().includes(search);
    }
  });

  // Sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Name (A-Z)") return a.name.localeCompare(b.name);
    if (sortOption === "Name (Z-A)") return b.name.localeCompare(a.name);
    if (sortOption === "Price (Low-High)") return a.sale - b.sale;
    if (sortOption === "Price (High-Low)") return b.sale - a.sale;
    return 0;
  });
  // --- Pagination setup ---
  const rowsPerPage = 20; // adjust how many rows per page
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  // Reset page when filteredProducts changes
  useEffect(() => {
    // set current page to 1 when any of the following states change
    setCurrentPage(1);
  }, [searchQuery, filterColumn, sortOption, products]);

  return (
    <div className="pt-12 max-w-full mx-auto">
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
            {[...fixedColumns.slice(0, 6), ...customColumns].map((col, i) => (
              <option key={i}>{col}</option>
            ))}
          </select>
        </div>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="None">Sort by...</option>
          <option value="Name (A-Z)">Name (A-Z)</option>
          <option value="Name (Z-A)">Name (Z-A)</option>
          <option value="Price (Low-High)">Price (Low → High)</option>
          <option value="Price (High-Low)">Price (High → Low)</option>
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
                <th className="text-left px-4 py-5 font-semibold text-gray-900 text-lg rounded-tl-xl">
                  ✏
                </th>
              )}

              {/* Render fixed + custom columns */}
              {[...fixedColumns, ...customColumns].map((col, i) => (
                <th
                  key={i}
                  className={`text-left px-8 py-5 font-semibold text-gray-900 text-lg ${
                    i === fixedColumns.length + customColumns.length - 1
                      ? "rounded-tr-xl"
                      : ""
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {currentProducts.length > 0 ? ( // <-- use currentProducts instead of filteredProducts
              currentProducts.map((product, rowIndex) => {
                const profitMargin =
                  ((product.sale - product.cost) / product.sale) * 100;
                const discount =
                  ((product.rrp - product.sale) / product.rrp) * 100;

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

                    {/* Fixed columns */}
                    <td className="px-8 py-4">{product.name}</td>
                    <td className="px-8 py-4">{product.supplier}</td>
                    <td className="px-8 py-4">{product.ounce}</td>
                    <td className="px-8 py-4">${product.cost}</td>
                    <td className="px-8 py-4">${product.rrp}</td>
                    <td className="px-8 py-4">${product.sale}</td>
                    <td className="px-8 py-4">{profitMargin.toFixed(1)}%</td>
                    <td className="px-8 py-4">{discount.toFixed(1)}%</td>

                    {/* Custom columns */}
                    {customColumns.map((col, i) => (
                      <td key={i} className="px-8 py-4">
                        {product[col]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={
                    fixedColumns.length +
                    customColumns.length +
                    (editing ? 1 : 0)
                  }
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
        <div className="flex justify-center items-center gap-2 my-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <span>
            {currentPage} / {totalPages}
          </span>

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
            {/* Scrollable container for inputs */}
            <div className="flex-1 overflow-y-auto pr-2">
              {[...fixedColumns, ...customColumns].map((key) => {
                if (key === "Profit Margin" || key === "Discount") return null; // skip

                return (
                  <div key={key} className="mb-3">
                    <label className="block font-semibold mb-1">{key}</label>
                    <input
                      type="text"
                      value={editValues[key] ?? ""}
                      onChange={(e) =>
                        setEditValues({ ...editValues, [key]: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                    />
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditingProduct(null)}
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
      )}
    </div>
  );
}
