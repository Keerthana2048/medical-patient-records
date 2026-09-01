let patients = [
    {
        id: 1,
        patientId: "PAT001",

        personalDetails: {
            name: "Ananya Sharma",
            age: 28,
            gender: "Female",
            phone: "9000000001",
            email: "ananya@example.com",
            address: "Bengaluru"
        },

        allergies: [
            "Penicillin"
        ],

        medicalHistory: [
            {
                condition: "Asthma",
                diagnosedYear: 2018,
                notes: "Mild intermittent asthma"
            }
        ],

        visits: [
            {
                id: 101,
                date: "2026-08-20",
                doctor: "Dr. Mehta",
                reason: "Routine consultation",
                diagnosis: "Seasonal allergy",
                notes: "Patient advised rest and hydration."
            }
        ],

        prescriptions: [
            {
                id: 201,
                date: "2026-08-20",
                medicine: "Cetirizine",
                dosage: "10 mg",
                duration: "5 days",
                doctorNotes: "Take once daily after dinner."
            }
        ]
    },

    {
        id: 2,
        patientId: "PAT002",

        personalDetails: {
            name: "Rahul Verma",
            age: 35,
            gender: "Male",
            phone: "9000000002",
            email: "rahul@example.com",
            address: "Hyderabad"
        },

        allergies: [
            "Dust"
        ],

        medicalHistory: [
            {
                condition: "Hypertension",
                diagnosedYear: 2022,
                notes: "Under regular monitoring"
            }
        ],

        visits: [
            {
                id: 102,
                date: "2026-08-25",
                doctor: "Dr. Rao",
                reason: "Blood pressure check",
                diagnosis: "Hypertension",
                notes: "Continue regular monitoring."
            }
        ],

        prescriptions: [
            {
                id: 202,
                date: "2026-08-25",
                medicine: "Amlodipine",
                dosage: "5 mg",
                duration: "30 days",
                doctorNotes: "Take once daily."
            }
        ]
    }
];

module.exports = patients;