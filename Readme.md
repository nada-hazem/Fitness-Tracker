# MY FINAL PROJECT  
MoveMate is a Fitness Tracker system where users can **view, add, create, update, and remove activities**.  
It uses **Flask** for the backend, with **JSON files** for storing activities and user-specific activities.  
Authentication is handled via a separate **blueprint**.  

## What does it do?  
A web app that lets users:  
- ✅ View and select fitness activities.  
- ✅ Add activities to their personal tracker.  
- ✅ Set goals and track progress.  
- ✅ Analyze performance with charts.  

## What is the "new feature" which you have implemented that we haven't seen before?  
**"Chart drawing library graphs the user data using Chart.js"**  

---

## Prerequisites  
Did you add any additional modules that someone needs to install?  
- ✅ Python (>=3.x)  
- ✅ Flask (`pip install flask`)  

---

## Project Checklist  
- [✅] It is available on **GitHub**.  
- [✅] It uses the **Flask** web framework.  
- [✅] It uses at least one module from the **Python Standard Library** other than `random`.  

  - **Modules used:**  
    - `os` – For interacting with the operating system (e.g., file paths, environment variables).  
    - `functools` – Provides utilities like `wraps` for decorators.  
    - `re` – Handles regular expressions for pattern matching.  
    - `datetime` – Manages time-related functions (e.g., `timedelta`).  
    - `json` – Works with JSON data.  

- [✅] It contains at least **one class** written by me with properties and methods.  

  - **File name:** `authentication.py`  
  - **Line number(s):** **16** (class `User`)  
  - **Two properties:** `username`, `email`  
  - **Two methods:** `hash_password()`, `check_password()`  
  - **File name and line numbers where the methods are used:**  
    - `hash_password()` → Used inside `__init__()` at **line 20**  
    - `check_password()` → Used in `login()` at **line 97**  

- [✅] It makes use of **JavaScript** in the front end and uses the `localStorage` of the web browser.  
- [✅] It uses **modern JavaScript** (`let` and `const` instead of `var`).  
- [✅] It makes use of the **reading and writing to the same file** feature.  

---

## Code Features  

- [✅] It contains **conditional statements**.  
  - **File name:** `app.py`  
  - **Line number(s):** **147**  
  - **Example:**  
    ```python
    if not data or "id" not in data:
        return jsonify({"error": "Invalid request payload"}), 400
    ```  

- [✅] It contains **loops**.  
  - **File name:** `home.js`  
  - **Line number(s):** **24**  
  - **Example:**  
    ```javascript
    activities.forEach((activity) => {
        const activityCard = document.createElement("div");
    });
    ```  

- [✅] It lets the user enter a value in a **text box**, which is processed by the backend Python code.  
- [✅] It handles **incorrect user input gracefully** without generating error messages.  
- [✅] It is styled using **custom CSS**.  
- [✅] The code follows **best practices**:  
  - Well-commented  
  - No unused or experimental code  
  - Uses **proper logging** instead of `print()` or `console.log()` for debugging  
- [✅] All exercises have been **completed** as per the requirements and **pushed** to the respective GitHub repository.  
