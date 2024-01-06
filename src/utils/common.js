import axios from "axios"

const removeItem = async (type, id) => {
  console.log("removeItem");
  const isItemDeleted = await axios.delete(`http://[::1]:3852/${type}/${id}`);
  console.log("removeItem: ", isItemDeleted);
};

export default removeItem;
