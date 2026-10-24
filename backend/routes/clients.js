
const express = require("express");
const router = express.Router();

const Client = require("../models/Client");
const authMiddleware = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

// GET all clients with search and filtering
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const clients = await Client.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Clients fetched successfully",
      clients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
});

// CREATE a client (Admin only)
router.post("/", authMiddleware, authorizeRoles("Admin"), async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !company?.trim()
    ) {
      return res.status(400).json({
        message: "Name, email, phone, and company are required.",
      });
    }

    const client = new Client({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone,
      company,
      status,
    });

    const savedClient = await client.save();

    res.status(201).json({
      message: "Client created successfully",
      client: savedClient,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create client",
      error: error.message,
    });
  }
});

// UPDATE a client (Admin only)
router.put("/:id", authMiddleware, authorizeRoles("Admin"), async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !company?.trim()
    ) {
      return res.status(400).json({
        message: "Name, email, phone, and company are required.",
      });
    }

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone,
        company,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    res.status(200).json({
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update client",
      error: error.message,
    });
  }
});

// DELETE a client (Admin only)
router.delete("/:id", authMiddleware, authorizeRoles("Admin"), async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    res.status(200).json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete client",
      error: error.message,
    });
  }
});

module.exports = router;
