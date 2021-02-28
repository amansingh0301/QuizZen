const check = async () => {
  const response = await fetch("/check", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => alert("Cannot check...login or not server is not running"));
  return response;
};
const methods = {
  check,
};
export default methods;
