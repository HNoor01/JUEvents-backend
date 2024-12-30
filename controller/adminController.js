const Admins = require("../models/Admin");


const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
   
    const admin = await Admins.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    
    const isMatch = password === admin.password;

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    
    res.status(200).json({
      message: "Login successful.",
      admin: {
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Error logging in admin:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { loginAdmin };
