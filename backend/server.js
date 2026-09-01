const express = require("express");
const cors = require("cors");

const patients = require("./data/patients");

const app = express();

const PORT = 5001;

// ================================
// Middleware
// ================================

app.use(cors());
app.use(express.json());

// ================================
// Helper: Find patient
// ================================

function findPatient(id) {
    return patients.find(
        (patient) => patient.id === Number(id)
    );
}

// ================================
// Home
// ================================

app.get("/", (req, res) => {
    res.json({
        message: "Medical Patient Records API is running"
    });
});

// ================================
// Get all patients
// ================================

app.get("/api/patients", (req, res) => {
    res.json(patients);
});

// ================================
// Search patients
// ================================

app.get("/api/patients/search", (req, res) => {

    const query = String(req.query.q || "")
        .toLowerCase()
        .trim();

    if (!query) {
        return res.json(patients);
    }

    const results = patients.filter((patient) => {

        const name =
            String(patient.personalDetails.name || "")
                .toLowerCase();

        const patientId =
            String(patient.patientId || "")
                .toLowerCase();

        const phone =
            String(patient.personalDetails.phone || "");

        return (
            name.includes(query) ||
            patientId.includes(query) ||
            phone.includes(query)
        );
    });

    res.json(results);
});

// ================================
// Get patient by ID
// ================================

app.get("/api/patients/:id", (req, res) => {

    const patient = findPatient(req.params.id);

    if (!patient) {
        return res.status(404).json({
            message: "Patient not found."
        });
    }

    res.json(patient);
});

// ================================
// Register patient
// ================================

app.post("/api/patients", (req, res) => {

    const {
        name,
        age,
        gender,
        phone,
        email,
        address,
        allergies
    } = req.body;

    if (!name || !age || !gender || !phone) {
        return res.status(400).json({
            message:
                "Name, age, gender and phone are required."
        });
    }

    const newPatient = {

        id: Date.now(),

        patientId:
            `PAT${String(
                patients.length + 1
            ).padStart(3, "0")}`,

        personalDetails: {
            name: name.trim(),
            age: Number(age),
            gender,
            phone: phone.trim(),
            email: email ? email.trim() : "",
            address: address ? address.trim() : ""
        },

        allergies:
            allergies
                ? String(allergies)
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                : [],

        medicalHistory: [],

        visits: [],

        prescriptions: []
    };

    patients.push(newPatient);

    res.status(201).json({
        message:
            "Patient registered successfully.",

        patient: newPatient
    });
});

// ================================
// Add medical history
// ================================

app.post(
    "/api/patients/:id/history",
    (req, res) => {

        const patient = findPatient(req.params.id);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found."
            });
        }

        const {
            condition,
            diagnosedYear,
            notes
        } = req.body;

        if (!condition) {
            return res.status(400).json({
                message:
                    "Medical condition is required."
            });
        }

        const history = {

            id: Date.now(),

            condition:
                condition.trim(),

            diagnosedYear:
                diagnosedYear || "",

            notes:
                notes ? notes.trim() : ""
        };

        patient.medicalHistory.push(history);

        res.status(201).json({
            message:
                "Medical history added successfully.",

            history
        });
    }
);

// ================================
// Add visit
// ================================

app.post(
    "/api/patients/:id/visits",
    (req, res) => {

        const patient = findPatient(req.params.id);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found."
            });
        }

        const {
            date,
            doctor,
            reason,
            diagnosis,
            notes
        } = req.body;

        if (!date || !doctor || !reason) {
            return res.status(400).json({
                message:
                    "Date, doctor and reason are required."
            });
        }

        const visit = {

            id: Date.now(),

            date,

            doctor:
                doctor.trim(),

            reason:
                reason.trim(),

            diagnosis:
                diagnosis ? diagnosis.trim() : "",

            notes:
                notes ? notes.trim() : ""
        };

        patient.visits.push(visit);

        res.status(201).json({
            message:
                "Visit record added successfully.",

            visit
        });
    }
);

// ================================
// Add prescription
// ================================

app.post(
    "/api/patients/:id/prescriptions",
    (req, res) => {

        const patient = findPatient(req.params.id);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found."
            });
        }

        const {
            date,
            medicine,
            dosage,
            duration,
            doctorNotes
        } = req.body;

        if (!medicine || !dosage || !duration) {
            return res.status(400).json({
                message:
                    "Medicine, dosage and duration are required."
            });
        }

        const prescription = {

            id: Date.now(),

            date:
                date ||
                new Date()
                    .toISOString()
                    .split("T")[0],

            medicine:
                medicine.trim(),

            dosage:
                dosage.trim(),

            duration:
                duration.trim(),

            doctorNotes:
                doctorNotes
                    ? doctorNotes.trim()
                    : ""
        };

        patient.prescriptions.push(prescription);

        res.status(201).json({
            message:
                "Prescription added successfully.",

            prescription
        });
    }
);

// ================================
// Add allergy
// ================================

app.post(
    "/api/patients/:id/allergies",
    (req, res) => {

        const patient = findPatient(req.params.id);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found."
            });
        }

        const { allergy } = req.body;

        if (!allergy || !allergy.trim()) {
            return res.status(400).json({
                message: "Allergy is required."
            });
        }

        const newAllergy = allergy.trim();

        patient.allergies.push(newAllergy);

        res.status(201).json({
            message:
                "Allergy added successfully.",

            allergy: newAllergy
        });
    }
);

// ================================
// Doctor Dashboard
// ================================

app.get(
    "/api/doctor/dashboard",
    (req, res) => {

        const totalPatients =
            patients.length;

        const totalVisits =
            patients.reduce(
                (total, patient) =>
                    total +
                    patient.visits.length,
                0
            );

        const totalPrescriptions =
            patients.reduce(
                (total, patient) =>
                    total +
                    patient.prescriptions.length,
                0
            );

        const patientsWithAllergies =
            patients.filter(
                (patient) =>
                    patient.allergies.length > 0
            ).length;

        res.json({

            totalPatients,

            totalVisits,

            totalPrescriptions,

            patientsWithAllergies
        });
    }
);

// ================================
// Error Handler
// ================================

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        message:
            "Something went wrong on the server."
    });
});

// ================================
// Start Server
// ================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});