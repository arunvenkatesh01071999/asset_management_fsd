document.addEventListener("DOMContentLoaded", () => {

  const tableBody = document.querySelector("#employeeTable tbody");
  const addBtn = document.getElementById("btnAddEmployee");
  const saveBtn = document.getElementById("saveEmp");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const paginationArea = document.getElementById("paginationArea");
  const active = document.getElementById("active").checked;

  let currentPage = 1;
  let limit = 10;
  let totalPages = 1;
  let editMode = false;
  let editId = null;

  // Utility: safe value getter for backend responses
  function extractEmployeeFromResponse(res) {
    if (!res || !res.data) return null;
    // try common response shapes
    return res.data.employee || res.data.data || res.data.result || res.data;
  }

  // -----------------------------------------------------------
  // LOAD EMPLOYEES
  // -----------------------------------------------------------
  async function loadEmployees() {
    try {
      const search = searchInput.value.trim();

      const res = await axios.get(`/api/employees/get/all/${currentPage}/${limit}`, {
        params: {
          search: search,
          status: "All"
        }
      });


      // Defensive: check shapes
      const apiData = res.data || {};
      const employees = apiData.employees || apiData.data || [];
      // pagination may be under apiData.pagination or apiData.meta
      totalPages = (apiData.pagination && apiData.pagination.totalPages) ||
        (apiData.meta && apiData.meta.totalPages) ||
        Math.max(1, Math.ceil((apiData.total || employees.length) / limit));

      // Update table
      tableBody.innerHTML = "";

      employees.forEach(emp => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${emp.id ?? ""}</td>
          <td>${emp.is_active ?? ""}</td>
          <td>${emp.first_name ?? ""}</td>
          <td>${emp.last_name ?? ""}</td>
          <td>${emp.email ?? ""}</td>
          <td>
            <button class="btn btn-sm btn-primary edit-btn" data-id="${emp.id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${emp.id}">Delete</button>
          </td>
        `;

        tableBody.appendChild(row);
      });

      renderPagination();

    } catch (err) {
      console.error("Error loading employees:", err);
      // show minimal feedback
      tableBody.innerHTML = `<tr><td colspan="5">Failed to load employees</td></tr>`;
    }
  }

  // -----------------------------------------------------------
  // RENDER PAGINATION
  // -----------------------------------------------------------
  function renderPagination() {
    if (!paginationArea) return;
    paginationArea.innerHTML = "";

    let html = "";

    html += `<li class="page-item ${currentPage === 1 ? "disabled" : ""}">
              <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
            </li>`;

    // if many pages, show condensed window (simple approach)
    const maxButtons = 7;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) { end = totalPages; start = Math.max(1, end - maxButtons + 1); }

    for (let i = start; i <= end; i++) {
      html += `<li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
              </li>`;
    }

    html += `<li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
              <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
            </li>`;

    paginationArea.innerHTML = html;

    // delegated click handler for pagination
    paginationArea.querySelectorAll(".page-link").forEach(btn => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        const page = Number(btn.getAttribute("data-page"));
        if (page >= 1 && page <= totalPages && page !== currentPage) {
          currentPage = page;
          loadEmployees();
        }
      });
    });
  }

  // -----------------------------------------------------------
  // SEARCH BUTTON
  // -----------------------------------------------------------
  searchBtn.addEventListener("click", () => {
    currentPage = 1;
    loadEmployees();
  });

  // also allow Enter key in search input
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      currentPage = 1;
      loadEmployees();
    }
  });

  // -----------------------------------------------------------
  // SAVE / UPDATE EMPLOYEE
  // -----------------------------------------------------------
  async function saveEmployee() {
    const form = document.getElementById("employeeForm");
    if (!form) return alert("Form not found");

    const payload = {
      first_name: form.first_name.value.trim(),
      last_name: form.last_name.value.trim(),
      email: form.email.value.trim(),
      is_active: active,
    };

    try {
      let res;
      if (!editMode) {
        res = await axios.post("/api/employees/add", payload);
      } else {
        res = await axios.put(`/api/employees/update/${editId}`, payload);
      }

      // You may have different success shapes; handle loosely
      if (res?.data?.success) {
        alert(`${editMode ? 'Employee updated successfully' : 'Employee created successfully'}`)
        // reset edit state
        editMode = false;
        editId = null;
        // hide modal
        const modalEl = document.getElementById("employeeModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();

        // reload current page (could reset to 1 if you'd prefer)
        loadEmployees();
      } else {
        console.warn("Unexpected save response:", res);
        alert("Save returned unexpected response (check console).");
      }

    } catch (err) {
      console.error("Save/Update error:", err);
      const msg = (err.response && err.response.data && err.response.data.message) || err.message;
      alert("Failed to save employee: " + msg);
    }
  }

  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    saveEmployee();
  });

  // -----------------------------------------------------------
  // EVENT DELEGATION FOR EDIT / DELETE
  // using a single delegated listener avoids lost handlers
  // -----------------------------------------------------------
  tableBody.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-btn");
    if (editBtn) {
      const id = editBtn.getAttribute("data-id");
      if (id) openEditModal(id);
      return;
    }

    const delBtn = e.target.closest(".delete-btn");
    if (delBtn) {
      const id = delBtn.getAttribute("data-id");
      if (id) handleDelete(id);
      return;
    }
  });

  // -----------------------------------------------------------
  // OPEN EDIT MODAL (GET ONE EMPLOYEE)
  // -----------------------------------------------------------
  async function openEditModal(id) {
    try {
      const res = await axios.get(`/api/employees/get-one/${id}`);

      let emp = extractEmployeeFromResponse(res);
      // sometimes API returns object wrapped in an array or with nesting
      if (Array.isArray(emp) && emp.length) emp = emp[0];

      if (!emp || Object.keys(emp).length === 0) {
        console.warn("No employee data found in response:", res);
        alert("Failed to load employee details (no data). See console.");
        return;
      }

      const form = document.getElementById("employeeForm");
      form.first_name.value = emp.first_name ?? "";
      form.last_name.value = emp.last_name ?? "";
      form.email.value = emp.email ?? "";
      // populate hidden id if you use it
      const empIdInput = document.getElementById("empId");
      document.getElementById("active").checked = emp.is_active ? true : false;
      document.getElementById("saveEmp").innerText = "Update";
      if (empIdInput) empIdInput.value = emp.id ?? id;

      editMode = true;
      editId = emp.id ?? id;

      const modalEl = document.getElementById("employeeModal");
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();

    } catch (err) {
      console.error("Error fetching employee:", err);
      alert("Failed to load employee (see console)");
    }
  }

  // -----------------------------------------------------------
  // DELETE HANDLER
  // -----------------------------------------------------------
  async function handleDelete(id) {
    if (!confirm("Delete employee?")) return;

    try {
      const res = await axios.delete(`/api/employees/delete/${id}`);
      const success = (res && res.data && (res.data.success === true || res.status === 200));
      if (success) {
        // if deleting last item on page, optionally move back a page
        loadEmployees();
      } else {
        console.warn("Unexpected delete response:", res);
        alert("Delete returned unexpected response. See console.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete employee");
    }
  }

  // -----------------------------------------------------------
  // ADD EMPLOYEE BUTTON
  // -----------------------------------------------------------
  addBtn.addEventListener("click", () => {
    const form = document.getElementById("employeeForm");
    if (form) form.reset();
    const empIdInput = document.getElementById("empId");
    if (empIdInput) empIdInput.value = "";

    editMode = false;
    editId = null;

    const modalEl = document.getElementById("employeeModal");
    document.getElementById("active").checked = true;
    document.getElementById("saveEmp").innerText = "Save";
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  });

  // -----------------------------------------------------------
  // INITIAL LOAD
  // -----------------------------------------------------------
  loadEmployees();

});
