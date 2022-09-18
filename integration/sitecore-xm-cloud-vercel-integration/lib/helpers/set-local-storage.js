// Set the values to local storage
function setValueToLocalStorage(key, value) {
  const objKey = Object.keys(key)[0];
  const objValue = key[objKey];
  localStorage.setItem(objKey, objValue);
}

function setCollectionToLocalStorage(obj) {
  const arr = [...obj];
  obj.forEach((key) => {
    setValueToLocalStorage(key);
  });
}

export default setCollectionToLocalStorage;
