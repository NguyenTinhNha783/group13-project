import { useState } from "react";
import axios from "axios";

export default function AddUser() {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    const newUser = { name };  // Tạo object user mới
    axios.post("http://localhost:3000/users", newUser)
      .then(res => {
        console.log("Thêm thành công:", res.data);
        setName(""); // Xóa input sau khi thêm
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Tên user"
      />
      <button onClick={handleSubmit}>Thêm User</button>
    </div>
  );
}
