// Template section management
let sections = [];

function addSection() {
    const sectionList = document.querySelector('.section-list');
    const sectionIndex = sections.length;

    const sectionHtml = `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <label class="form-label">Unit</label>
                        <select class="form-select" onchange="updateSections(${sectionIndex}, 'unit', this.value)">
                            <option value="1">Unit 1</option>
                            <option value="2">Unit 2</option>
                            <option value="3">Unit 3</option>
                            <option value="4">Unit 4</option>
                            <option value="5">Unit 5</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Marks</label>
                        <input type="number" class="form-control" onchange="updateSections(${sectionIndex}, 'marks', this.value)">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Question Count</label>
                        <input type="number" class="form-control" onchange="updateSections(${sectionIndex}, 'count', this.value)">
                    </div>
                    <div class="col-md-3">
                        <button type="button" class="btn btn-danger mt-4" onclick="removeSection(${sectionIndex})">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    sectionList.insertAdjacentHTML('beforeend', sectionHtml);
    sections.push({unit: 1, marks: 0, count: 0});
    updateSectionsData();
}

function updateSections(index, field, value) {
    sections[index][field] = parseInt(value);
    updateSectionsData();
}

function removeSection(index) {
    sections.splice(index, 1);
    const sectionElements = document.querySelector('.section-list').children;
    sectionElements[index].remove();
    updateSectionsData();
}

function updateSectionsData() {
    const sectionsData = document.getElementById('sectionsData');
    if (sectionsData) {
        sectionsData.value = JSON.stringify(sections);
    }
}

// Template management variables
let partAQuestions = [];
let partBQuestions = [];

function addQuestionRow(part) {
    if (part === 'partA') {
        addPartAQuestion();
    } else {
        addPartBQuestion();
    }
}

function addPartAQuestion() {
    const tbody = document.getElementById('partABody');
    const questionIndex = partAQuestions.length;
    const subQuestionLetter = String.fromCharCode(97 + questionIndex); // a, b, c, ...

    const rowHtml = `
        <tr>
            <td>1</td>
            <td>${subQuestionLetter}</td>
            <td>
                <select class="form-select" name="partA_unit_${questionIndex + 1}" required onchange="updateQuestion('partA', ${questionIndex}, 'unit', this.value)">
                    <option value="">Select Unit</option>
                    <option value="1">Unit 1</option>
                    <option value="2">Unit 2</option>
                    <option value="3">Unit 3</option>
                    <option value="4">Unit 4</option>
                    <option value="5">Unit 5</option>
                </select>
            </td>
            <td><input type="number" class="form-control" value="2" readonly style="width: 80px;"></td>
            <td class="co-display"></td>
            <td class="bl-display"></td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="removeQuestionRow('partA', this)">Remove</button>
            </td>
        </tr>
    `;

    tbody.insertAdjacentHTML('beforeend', rowHtml);
    partAQuestions.push({
        qno: 1,
        sub_qno: subQuestionLetter,
        unit: '',
        marks: 2
    });
    updateQuestionsData();
}

function addPartBQuestion() {
    const tbody = document.getElementById('partBBody');
    const questionIndex = partBQuestions.length;
    const baseQno = Math.floor(questionIndex / 2) * 2 + 2; // Start from 2 and increment by 2
    const marksPerQuestion = parseInt(document.getElementById('marksPerQuestion').value) || 10;

    // First question in the pair
    const rowsHtml = `
        <tr>
            <td>${baseQno}</td>
            <td>
                <select class="form-select unit-select" name="partB_unit_${baseQno}" required onchange="syncUnitSelection(this, ${baseQno})">
                    <option value="">Select Unit</option>
                    <option value="1">Unit 1</option>
                    <option value="2">Unit 2</option>
                    <option value="3">Unit 3</option>
                    <option value="4">Unit 4</option>
                    <option value="5">Unit 5</option>
                </select>
            </td>
            <td><input type="number" class="form-control marks-input" value="${marksPerQuestion}" readonly style="width: 60px;"></td>
            <td class="co-display"></td>
            <td class="bl-display"></td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="removePartBQuestionSet(this)">Remove</button>
            </td>
        </tr>
        <tr class="table-secondary text-center">
            <td colspan="6"><strong>OR</strong></td>
        </tr>
        <tr>
            <td>${baseQno + 1}</td>
            <td>
                <select class="form-select unit-select" name="partB_unit_${baseQno + 1}" required>
                    <option value="">Select Unit</option>
                    <option value="1">Unit 1</option>
                    <option value="2">Unit 2</option>
                    <option value="3">Unit 3</option>
                    <option value="4">Unit 4</option>
                    <option value="5">Unit 5</option>
                </select>
            </td>
            <td><input type="number" class="form-control marks-input" value="${marksPerQuestion}" readonly style="width: 60px;"></td>
            <td class="co-display"></td>
            <td class="bl-display"></td>
            <td></td>
        </tr>
    `;

    tbody.insertAdjacentHTML('beforeend', rowsHtml);

    // Add both questions to the array
    partBQuestions.push({
        qno: baseQno,
        unit: '',
        marks: marksPerQuestion
    });

    partBQuestions.push({
        qno: baseQno + 1,
        unit: '',
        marks: marksPerQuestion
    });

    updateQuestionsData();
}

function updateQuestionsData() {
    const partAData = document.getElementById('partAData');
    const partBData = document.getElementById('partBData');

    if (partAData) {
        partAData.value = JSON.stringify(partAQuestions.map(q => ({
            qno: 1,
            unit: parseInt(q.unit) || 1,
            marks: parseInt(q.marks) || 2,
            sub_qno: q.sub_qno
        })));
    }

    if (partBData) {
        partBData.value = JSON.stringify(partBQuestions.map(q => ({
            qno: q.qno,
            unit: parseInt(q.unit) || 1,
            marks: parseInt(q.marks) || 10
        })));
    }
}

function removePartBQuestionSet(button) {
    const row = button.closest('tr');
    const orRow = row.nextElementSibling;
    const choiceRow = orRow.nextElementSibling;
    const index = Math.floor(Array.from(row.parentNode.children).indexOf(row) / 3) * 2;

    // Remove both questions from the array
    partBQuestions.splice(index, 2);

    row.remove();
    orRow.remove();
    choiceRow.remove();

    // Update question numbers
    document.querySelectorAll('#partBBody tr').forEach((row, idx) => {
        if (idx % 3 === 0 || idx % 3 === 2) {
            const qno = Math.floor(idx / 3) * 2 + 2;
            row.querySelector('td:first-child').textContent = qno;
        }
    });
    updateQuestionsData();
}

function syncUnitSelection(select, questionNo) {
    const row = select.closest('tr');
    const nextRow = row.nextElementSibling.nextElementSibling;
    if (nextRow) {
        nextRow.querySelector('select').value = select.value;
    }

    const index = Math.floor((questionNo - 2) / 2) * 2;
    if (partBQuestions[index]) {
        partBQuestions[index].unit = select.value;
    }
    if (partBQuestions[index + 1]) {
        partBQuestions[index + 1].unit = select.value;
    }
    updateQuestionsData();
}

function removeQuestionRow(part, button) {
    const row = button.closest('tr');
    const index = Array.from(row.parentNode.children).indexOf(row);

    if (part === 'partA') {
        partAQuestions.splice(index, 1);
        row.remove();
        // Update letters for remaining questions
        document.querySelectorAll('#partABody tr').forEach((row, idx) => {
            row.querySelector('td:nth-child(2)').textContent = String.fromCharCode(97 + idx);
        });
    }
    updateQuestionsData();
}


function updateQuestion(part, index, field, value) {
    const questions = part === 'partA' ? partAQuestions : partBQuestions;
    if (questions[index]) {
        questions[index][field] = value;
        updateQuestionsData();
    }
}

function updatePartBMarks(marks) {
    marks = parseInt(marks);
    document.querySelectorAll('#partBBody .marks-input').forEach(input => {
        input.value = marks;
    });
    partBQuestions.forEach(q => {
        q.marks = marks;
    });
    updateQuestionsData();
}

// Question bank filtering
document.getElementById('unitFilter')?.addEventListener('change', function() {
    const unit = this.value;
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        if (!unit || row.dataset.unit === unit) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Function to filter and populate questions in dropdown
function filterAndPopulateQuestions(select) {
    if (!select) return;
    
    const unit = select.dataset.unit;
    const part = select.dataset.part;
    const row = select.closest('tr');
    const subjectCode = document.getElementById('subject-code')?.value;
    
    if (!subjectCode || !unit) return;

    // Determine if this is a split question by checking either:
    // 1. The dataset attribute we added in toggleSplit
    // 2. The row class or the split button text (for backward compatibility)
    const isSplitQuestion = select.dataset.splitQuestion === 'true' || 
                           row.classList.contains('sub-question-row') || 
                           (row.classList.contains('question-row') && 
                            row.querySelector('.split-button')?.textContent === '-');

    // Clear existing options except the default one
    while (select.options.length > 1) {
        select.remove(1);
    }

    // Fetch questions for the specified unit
    fetch(`/get_questions/${unit}/${subjectCode}`)
        .then(response => response.json())
        .then(questions => {
            // Filter based on part and marks
            const filteredQuestions = questions.filter(q => {
                if (part === 'A') return q.marks === 2;  // Short Answer Questions

                // For Part B questions - when split, use 5 mark questions for both a) and b)
                if (isSplitQuestion) {
                    return q.marks === 5;  // Both a) and b) parts should use 5-mark questions
                } else {
                    return q.marks === 10;  // Full questions are 10 marks
                }
            });

            // Add options to select
            filteredQuestions.forEach(q => {
                const option = document.createElement('option');
                option.value = q.id;
                option.textContent = q.question_text;
                if (q.image_data) {
                    option.setAttribute('data-image', q.image_data);
                }
                option.dataset.co = q.co;
                option.dataset.bl = q.bl;
                option.dataset.marks = q.marks;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading questions:', error));
}

// Function to toggle split on questions
function toggleSplit(button) {
    const questionRow = button.closest('.question-row');
    const subQuestionRow = questionRow.nextElementSibling;
    const marksInput = questionRow.querySelector('.marks-input');
    const mainSelect = questionRow.querySelector('.question-select');
    const subSelect = subQuestionRow.querySelector('.question-select');
    const subMarksInput = subQuestionRow.querySelector('.marks-input');
    const originalMarks = parseInt(questionRow.getAttribute('data-original-marks')) || 10;

    // Clear current selections
    const mainCoDisplay = questionRow.querySelector('.co-display');
    const mainBlDisplay = questionRow.querySelector('.bl-display');
    const subCoDisplay = subQuestionRow.querySelector('.co-display');
    const subBlDisplay = subQuestionRow.querySelector('.bl-display');

    // Clear images if any
    const mainImageContainer = questionRow.querySelector('.question-image-container');
    if (mainImageContainer) mainImageContainer.remove();

    const subImageContainer = subQuestionRow.querySelector('.question-image-container');
    if (subImageContainer) subImageContainer.remove();

    if (button.textContent === '+') {
        // Split the question
        button.textContent = '-';
        subQuestionRow.classList.remove('d-none');
        subSelect.disabled = false;
        subMarksInput.disabled = false;

        // Split the marks
        const halfMarks = Math.floor(originalMarks / 2);
        marksInput.value = halfMarks;
        subMarksInput.value = halfMarks;

        // Update labels
        questionRow.querySelector('.sub-question-label').textContent = 'a)';
        subQuestionRow.querySelector('.sub-question-label').textContent = 'b)';

        // Clear main selection and repopulate with 5-mark questions
        if (mainSelect.value) {
            mainSelect.value = '';
            mainCoDisplay.textContent = '';
            mainBlDisplay.textContent = '';
        }

        // Set both selects to only show 5-mark questions
        mainSelect.dataset.splitQuestion = 'true';
        subSelect.dataset.splitQuestion = 'true';

        // Refresh the question lists with the appropriate mark values
        filterAndPopulateQuestions(mainSelect);
        filterAndPopulateQuestions(subSelect);
    } else {
        // Merge the questions
        button.textContent = '+';
        subQuestionRow.classList.add('d-none');
        subSelect.disabled = true;
        subMarksInput.disabled = true;

        // Restore original marks (typically 10)
        marksInput.value = originalMarks;

        // Clear main selection and repopulate with 10-mark questions
        if (mainSelect.value) {
            mainSelect.value = '';
            mainCoDisplay.textContent = '';
            mainBlDisplay.textContent = '';
        }

        // Clear sub-question selection
        if (subSelect.value) {
            subSelect.value = '';
            subCoDisplay.textContent = '';
            subBlDisplay.textContent = '';
        }

        // Update labels
        questionRow.querySelector('.sub-question-label').textContent = '';
        subQuestionRow.querySelector('.sub-question-label').textContent = '';

        // Remove split question flag
        delete mainSelect.dataset.splitQuestion;
        delete subSelect.dataset.splitQuestion;

        // Refresh the main question list with 10-mark questions
        filterAndPopulateQuestions(mainSelect);
    }
}

// Add this function for automated question selection
function autoSelectQuestions() {
    const questionSelects = document.querySelectorAll('.question-select');
    const selectedQuestions = new Set();

    questionSelects.forEach(select => {
        // Get all available options except the empty one
        const options = Array.from(select.options)
            .filter(opt => opt.value && !selectedQuestions.has(opt.value) && opt.value !== 'Select a Question');

        if (options.length > 0) {
            // Randomly select an option
            const randomIndex = Math.floor(Math.random() * options.length);
            const selectedOption = options[randomIndex];

            // Set the selected option
            select.value = selectedOption.value;
            selectedQuestions.add(selectedOption.value);

            // Trigger change event to update CO, BL displays and images
            select.dispatchEvent(new Event('change'));
        }
    });

    // Save the selections after automated selection
    saveSelections();
}

// Handle split/merge questions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('split-question')) {
        const qno = e.target.dataset.qno;
        const row = e.target.closest('tr');
        const currentMarks = parseInt(row.querySelector('.marks-input').value);
        const splitMarks = Math.floor(currentMarks / 2);

        const newRow = row.cloneNode(true);

        // Update buttons
        row.querySelector('.split-question').style.display = 'none';
        const mergeBtn = document.createElement('button');
        mergeBtn.type = 'button';
        mergeBtn.className = 'btn btn-sm btn-link merge-question';
        mergeBtn.textContent = '-';
        mergeBtn.dataset.qno = qno;
        row.querySelector('.split-question').parentNode.appendChild(mergeBtn);

        // Update labels
        row.querySelector('.sub-question-label').textContent = 'a)';
        newRow.querySelector('.sub-question-label').textContent = 'b)';


        // Update marks
        row.querySelector('.marks-input').value = splitMarks;
        newRow.querySelector('.marks-input').value = splitMarks;

        // Hide split button in both rows
        row.querySelector('.split-question').style.display = 'none';
        newRow.querySelector('.split-question').style.display = 'none';


        // Insert new row after current row
        row.after(newRow);
    }
});

function saveSelections() {
  const form = document.getElementById('questionForm');
  const formData = new FormData(form);
  const selections = {};
  let hasError = false;
  const usedQuestions = new Set();
  const requiredSelects = Array.from(form.querySelectorAll('select:not([disabled])[required]'));
  const emptySelects = [];
  const duplicateQuestions = [];

  // Skip validation if automated selection is in progress
  if (window.autoSelectionInProgress) {
      return true;
  }

  // First pass - check for empty required fields and build the used questions set
  for (let [name, value] of formData.entries()) {
    if (name.startsWith('part')) {
      const select = form.querySelector(`select[name="${name}"]`);

      // Skip disabled fields
      if (select.disabled) continue;

      // Check if it's empty
      if (!select.value && select.hasAttribute('required')) {
        emptySelects.push(name);
      } else if (select.value) {
        // Check for duplicate usage
        if (usedQuestions.has(select.value)) {
          duplicateQuestions.push(select.value);
        } else {
          usedQuestions.add(select.value);
        }

        // Proceed with saving
        const option = select.options[select.selectedIndex];
        selections[name] = {
          id: select.value,
          co: option.dataset.co,
          bl: option.dataset.bl
        };
      }
    }
  }

  // Check for errors - don't alert during automatic selection
  const isAutomated = window.autoSelectionInProgress === true;

  if (emptySelects.length > 0 && !isAutomated) {
    hasError = true;
    alert(`Please select questions for all required fields (${emptySelects.length} empty fields)`);
  } else if (duplicateQuestions.length > 0 && !isAutomated) {
    hasError = true;
    alert(`Each question can only be used once (${duplicateQuestions.length} duplicates found)`);
  }

  if (!hasError) {
    // Save even if there was an error in automated selection
    const hiddenInput = document.getElementById('savedSelectionsInput');
    if (hiddenInput) {
      hiddenInput.value = JSON.stringify(selections);
    }

    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) previewBtn.disabled = false;

    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) generateBtn.disabled = false;

    if (!isAutomated) {
      alert('Selections saved successfully!');
    }
  }

  return !hasError;
}

function previewPaper() {
    const form = document.getElementById('questionForm');
    const formData = new FormData(form);
    formData.append('preview', 'true');

    fetch(window.location.href, {
        method: 'POST',
        body: formData
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
    });
}

// Load saved selections if they exist
document.addEventListener('DOMContentLoaded', function() {
    const savedSelectionsInput = document.getElementById('savedSelectionsInput');
    if (savedSelectionsInput && savedSelectionsInput.value) {
        const selections = JSON.parse(savedSelectionsInput.value);
        Object.entries(selections).forEach(([name, data]) => {
            const select = document.querySelector(`select[name="${name}"]`);
            if (select) {
                select.value = data.id;
                const event = new Event('change');
                select.dispatchEvent(event);
            }
        });
    }
});

// Update the existing question selection change handler to show images
document.addEventListener('DOMContentLoaded', function() {
    const questionSelects = document.querySelectorAll('.question-select');

    questionSelects.forEach(select => {
        select.addEventListener('change', function() {
            const selectedValue = this.value;
            if (!selectedValue) return;

            // Check if this question is already selected
            const otherSelects = Array.from(questionSelects).filter(s => s !== this);
            const isDuplicate = otherSelects.some(s => s.value === selectedValue);

            if (isDuplicate) {
                alert('This question has already been selected. Please choose a different question.');
                this.value = '';
                return;
            }

            // Update CO and BL displays
            const selectedOption = this.options[this.selectedIndex];
            const container = this.closest('td');
            container.nextElementSibling.nextElementSibling.textContent = selectedOption ? `CO: ${selectedOption.dataset.co}` : '';
            container.nextElementSibling.nextElementSibling.nextElementSibling.textContent = selectedOption ? `BL: ${selectedOption.dataset.bl}` : '';

            // Add or update image display
            const imageData = selectedOption.dataset.image;
            const existingImageContainer = container.querySelector('.question-image-container');
            if (existingImageContainer) {
                existingImageContainer.remove();
            }
            
            if (imageData) {
                // Create container for the image
                const imageContainer = document.createElement('div');
                imageContainer.className = 'question-image-container mt-2';
                
                // Create the resizable image
                const img = document.createElement('img');
                img.src = `data:image/png;base64,${imageData}`;
                img.className = 'img-fluid question-image';
                img.alt = 'Question image';
                img.style.maxWidth = '300px';
                
                // Store original dimensions for the resized image to be used in PDF
                img.dataset.originalWidth = img.naturalWidth;
                img.dataset.originalHeight = img.naturalHeight;
                
                // Create hidden input for the question ID
                const questionIdInput = document.createElement('input');
                questionIdInput.type = 'hidden';
                questionIdInput.className = 'question-id-input';
                questionIdInput.name = `question_id_${selectedOption.value}`;
                questionIdInput.value = selectedOption.value;
                
                // Listen for the image resize end event
                img.addEventListener('mouseup', function() {
                    // Update dataset with current size after resize
                    this.dataset.resizedWidth = this.width;
                    this.dataset.resizedHeight = this.height;
                    
                    // Also add hidden inputs to store the resized dimensions for submission
                    const container = this.closest('.question-image-container');
                    const questionContainer = container.closest('td');
                    const questionRow = questionContainer.closest('tr');
                    const questionId = selectedOption.value;
                    
                    // Create or update hidden fields with question ID in the name
                    let widthInput = container.querySelector('.img-width-input');
                    let heightInput = container.querySelector('.img-height-input');
                    
                    if (!widthInput) {
                        widthInput = document.createElement('input');
                        widthInput.type = 'hidden';
                        widthInput.className = 'img-width-input';
                        widthInput.name = `image_width_${questionId}`;
                        container.appendChild(widthInput);
                    }
                    
                    if (!heightInput) {
                        heightInput = document.createElement('input');
                        heightInput.type = 'hidden';
                        heightInput.className = 'img-height-input';
                        heightInput.name = `image_height_${questionId}`;
                        container.appendChild(heightInput);
                    }
                    
                    widthInput.value = this.width;
                    heightInput.value = this.height;
                    
                    console.log(`Image resized to: ${this.width}x${this.height} for question ${questionId}`);
                });
                
                imageContainer.appendChild(img);
                container.appendChild(imageContainer);
            }
        });
    });
});


// Initialize from existing data if available
document.addEventListener('DOMContentLoaded', function() {
    const partAData = document.getElementById('partAData');
    const partBData = document.getElementById('partBData');

    if (partAData && partAData.value) {
        partAQuestions = JSON.parse(partAData.value);
    }
    if (partBData && partBData.value) {
        partBQuestions = JSON.parse(partBData.value);
    }
});

let currentPartBMarks = 8;

function updatePartBMarks(value) {
    currentPartBMarks = parseInt(value);
    const marksInputs = document.querySelectorAll('#partBTable .marks-input');
    marksInputs.forEach(input => {
        input.value = currentPartBMarks;
    });
}

function addOrQuestionRows(part) {
    const tbody = document.getElementById(part + 'Body');
    const rows = tbody.getElementsByTagName('tr');
    const qno = rows.length > 0 ? parseInt(rows[rows.length-1].querySelector('td:first-child').textContent) + 1 : 1;

    // First question row
    const row1 = tbody.insertRow();
    row1.innerHTML = `
        <td>${qno}</td>
        <td>
            <select class="form-select unit-select" onchange="updateOrQuestionUnit(this)">
                <option value="">Select Unit</option>
                <option value="1">Unit 1</option>
                <option value="2">Unit 2</option>
                <option value="3">Unit 3</option>
                <option value="4">Unit 4</option>
                <option value="5">Unit 5</option>
            </select>
        </td>
        <td><input type="number" class="form-control marks-input" value="${currentPartBMarks}" readonly style="width: 60px;"></td>
        <td><input type="text" class="form-control co-input"></td>
        <td><input type="text" class="form-control bl-input"></td>
        <td><button class="btn btn-danger" onclick="removeOrQuestions(this)">Remove</button></td>
    `;

    // OR separator row
    const orRow = tbody.insertRow();
    orRow.innerHTML = '<td colspan="6" class="text-center">OR</td>';

    // Second question row
    const row2 = tbody.insertRow();
    row2.innerHTML = `
        <td>${qno +1}</td>
        <td>
            <select class="form-select unit-select" onchange="updateOrQuestionUnit(this)" disabled>
                <option value="">Select Unit</option>
                <option value="1">Unit 1</option>
                <option value="2">Unit 2</option>
                <option value="3">Unit 3</option>
                <option value="4">Unit 4</option>
                <option value="5">Unit 5</option>
            </select>
        </td>
        <td><input type="number" class="form-control marks-input" value="${currentPartBMarks}" readonly style="width: 60px;"></td>
        <td><input type="text" class="form-control co-input"></td>
        <td><input type="text" class="form-control bl-input"></td>
        <td></td>
    `;
}

function updateOrQuestionUnit(select) {
    const row = select.closest('tr');
    const orRow = row.nextElementSibling;
    const secondRow = orRow.nextElementSibling;

    if (secondRow) {
        secondRow.querySelector('.unit-select').value = select.value;
    }
}

function removeOrQuestions(button) {
    const row = button.closest('tr');
    const orRow = row.nextElementSibling;
    const secondRow = orRow.nextElementSibling;

    row.remove();
    orRow.remove();
    secondRow.remove();
}

function updateQuestionMetadata(selectElement) {
    const row = selectElement.closest('tr');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const coDisplay = row.querySelector('.co-display');
    const blDisplay = row.querySelector('.bl-display');

    if (selectedOption.dataset.co && selectedOption.dataset.bl) {
        coDisplay.textContent = selectedOption.dataset.co;
        blDisplay.textContent = selectedOption.dataset.bl;
    }
}

function updateCoBlDisplay(select) {
    const selectedOption = select.options[select.selectedIndex];
    const container = select.closest('td');
    container.nextElementSibling.nextElementSibling.textContent = selectedOption ? `CO: ${selectedOption.dataset.co}` : '';
    container.nextElementSibling.nextElementSibling.nextElementSibling.textContent = selectedOption ? `BL: ${selectedOption.dataset.bl}` : '';
}

function updateHiddenFields() {
    // Update Part A
    const partAData = [];
    document.querySelectorAll('#partABody tr').forEach(row => {
        const unit = row.querySelector('select').value;
        if (unit) {
            partAData.push({
                qno: 1,
                sub_qno: row.querySelector('td:nth-child(2)').textContent,
                unit: parseInt(unit),
                marks: 2
            });
        }
    });
    if (document.getElementById('partAData')) {
        document.getElementById('partAData').value = JSON.stringify(partAData);
    }

    // Update Part B (assuming similar structure as Part A)
    const partBData = [];
    document.querySelectorAll('#partBBody tr').forEach(row => {
        const unit = row.querySelector('select').value;
        if (unit) {
            partBData.push({
                qno: parseInt(row.querySelector('td:first-child').textContent),
                unit: parseInt(unit),
                marks: parseInt(row.querySelector('.marks-input').value)
            });
        }
    });
    if (document.getElementById('partBData')) {
        document.getElementById('partBData').value = JSON.stringify(partBData);
    }
}

// Initialize existing data if available
document.addEventListener('DOMContentLoaded', function() {
    const partAData = document.getElementById('partAData');
    const partBData = document.getElementById('partBData');

    if (partAData && partAData.value) {
        partAQuestions = JSON.parse(partAData.value);
    }
    if (partBData && partBData.value) {
        partBQuestions = JSON.parse(partBData.value);
    }
    
    // Initialize the split functionality and question dropdowns
    const questionSelects = document.querySelectorAll('.question-select');
    if (questionSelects.length > 0) {
        // Add the course code as a hidden field if not already present
        const form = document.getElementById('questionForm');
        if (form) {
            const subjectCodeText = document.querySelector('.details')?.textContent;
            if (subjectCodeText) {
                const codeMatch = subjectCodeText.match(/\(([A-Z0-9]+)\)/);
                if (codeMatch && codeMatch[1]) {
                    let subjectCodeInput = document.getElementById('subject-code');
                    if (!subjectCodeInput) {
                        subjectCodeInput = document.createElement('input');
                        subjectCodeInput.type = 'hidden';
                        subjectCodeInput.id = 'subject-code';
                        subjectCodeInput.value = codeMatch[1];
                        form.appendChild(subjectCodeInput);
                    }
                }
            }
        }
        
        // Initialize the question dropdowns for each select
        questionSelects.forEach(select => {
            if (!select.disabled) {
                filterAndPopulateQuestions(select);
            }
        });
    }
});