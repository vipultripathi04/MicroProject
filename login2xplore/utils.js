(function () {
  const token = "90931648|-31949326796023252|90961448";
  const baseURL = "http://api.login2explore.com:5577/";
  const dbName = "SCHOOL-DB";
  const relation = "STUDENT-TABLE";
  const saveBtn = document.getElementById("saveBtn");
  const updateBtn = document.getElementById("updateBtn");
  const resetBtn = document.getElementById("resetBtn");
  const rollNo = document.getElementById("inputRoll");
  const fullName = document.getElementById("inputName");
  const inputClass = document.getElementById("inputClass");
  const birthDate = document.getElementById("inputBirthDate");
  const enrollDate = document.getElementById("inputEnrollment");
  const address = document.getElementById("inputAddress");
  rollNo.focus();

  rollNo.addEventListener("focusout", (event) => {
    
    let rollNumber = { "Roll-No": event.target.value };
    if(rollNumber["Roll-No"]!=""){
      MakeHttpRequest("api/irl", "GET_BY_KEY", rollNumber), 3000;
    }
  });

  resetBtn.addEventListener("click", resetForm);

  saveBtn.addEventListener("click", saveStudent);

  updateBtn.addEventListener("click", updateStudent);

  const MakeHttpRequest = (url, cmd, body) => {
    const postData = {
      token: token,
      dbName: dbName,
      cmd: cmd,
      rel: relation,
      createTime: true,
      updateTime: true,
      jsonStr: body,
    };

    if (cmd == "SET") {
      postData.primaryKey = "Roll-No";
    }

    $.post(baseURL + url, JSON.stringify(postData), function (data, status) {
      const res = JSON.parse(data);
      setResponse(res);
    }).fail((err) => console.log(err));
  };

  function changeFormFieldsState(state, operation) {
    if (rollNo.value == "") {
      return;
    }

    if (operation == "update") {
      rollNo.disabled = true;
    }

    fullName.disabled = state;
    birthDate.disabled = state;
    inputClass.disabled = state;
    address.disabled = state;
    enrollDate.disabled = state;
  }

  function setResponse(response) {
    console.log(response);
    if(response.message.includes('INSERTED')){
      alert('Student Added Successfully');
    }
    if(response.message.includes('UPDATED')){
      alert('Student Record Updated Successfully');
    }
    if (response.data != "" && response.status == 200 && response.message.includes("RETRIEVED")) {
      changeFormFieldsState(false, "update");
      const data = JSON.parse(response.data);
      fullName.value =
        data?.record["Full-Name"] != undefined ? data?.record["Full-Name"] : "";
      birthDate.value =
        data?.record["Birth-Date"] != undefined
          ? data?.record["Birth-Date"]
          : "";
      inputClass.value =
        data?.record["class"] == undefined ? "" : data?.record["class"];
      address.value =
        data?.record["address"] != undefined ? data?.record["address"] : "";
      enrollDate.value =
        data?.record["Enrollment-Date"] != undefined
          ? data?.record["Enrollment-Date"]
          : "";
      updateBtn.disabled = false;
      saveBtn.disabled = true;
      resetBtn.disabled = false;
    } else {
      changeFormFieldsState(false, "insert");
      saveBtn.disabled = false;
      updateBtn.disabled = true;
      resetBtn.disabled = false;
    }
  }

  function resetForm() {
    changeFormFieldsState(true);
    fullName.value = "";
    rollNo.value = "";
    birthDate.value = "";
    enrollDate.value = "";
    inputClass.value = "";
    address.value = "";
    rollNo.disabled = false;
    saveBtn.disabled = false;
    resetBtn.disabled = false;
    updateBtn.disabled = false;
    rollNo.focus();
  }

  function saveStudent() {
    if (!validateFormInput()) {
      return;
    }
    body = {
      "Roll-No": rollNo.value,
      "Full-Name": fullName.value,
      "Birth-Date": birthDate.value,
      "class": inputClass.value,
      "address": address.value,
      "Enrollment-Date": enrollDate.value,
    };
    MakeHttpRequest("api/iml", "PUT", body);
    resetForm();
  }

  function updateStudent() {
    if (!validateFormInput()) {
      return;
    }
    body = {
      "Roll-No": rollNo.value,
      "Full-Name": fullName.value,
      "Birth-Date": birthDate.value,
      "class": inputClass.value,
      "address": address.value,
      "Enrollment-Date": enrollDate.value,
    };
    MakeHttpRequest("api/iml/set", "SET", body), 3000;
    resetForm();
  }

  function validateFormInput() {
    return rollNo.value == "" &&
      birthDate.value == "" &&
      inputClass.value == "" &&
      fullName.value == "" &&
      address.value == "" &&
      enrollDate.value == ""
      ? false
      : true;
  }
})();
