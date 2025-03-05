const localStringToDate = (stringDate) => {
  // ✅ Ensure `premiered` is in the correct format
  if (stringDate && stringDate.includes("/")) {
    let [dd, mm, yyyy] = stringDate.split("/");

    // ✅ Ensure day & month are always two digits
    dd = dd.padStart(2, "0");
    mm = mm.padStart(2, "0");

    return new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`).toISOString();
  }
};

export { localStringToDate };
