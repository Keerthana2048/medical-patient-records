import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5001";

function App() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);

    // ================================
    // Fetch all patients
    // ================================

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/patients`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch patients");
            }

            const data = await response.json();

            setPatients(data);
        } catch (error) {
            console.error(
                "Error fetching patients:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // Search patients
    // ================================

    const handleSearch = async () => {
        const query = search.trim();

        // If search box is empty
        if (!query) {
            fetchPatients();
            return;
        }

        try {
            setSearching(true);

            const response = await fetch(
                `${API_URL}/api/patients/search?q=${encodeURIComponent(
                    query
                )}`
            );

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data = await response.json();

            setPatients(data);
        } catch (error) {
            console.error(
                "Search error:",
                error
            );
        } finally {
            setSearching(false);
        }
    };

    // ================================
    // Clear search
    // ================================

    const handleClear = () => {
        setSearch("");
        fetchPatients();
    };

    // ================================
    // Search using Enter key
    // ================================

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    // ================================
    // Calculate statistics
    // ================================

    const totalMedicalRecords =
        patients.reduce(
            (total, patient) =>
                total +
                patient.medicalHistory.length,
            0
        );

    const totalVisits =
        patients.reduce(
            (total, patient) =>
                total +
                patient.visits.length,
            0
        );

    return (
        <div className="app">

            {/* ================================
                HEADER
            ================================= */}

            <header className="header">

                <div>
                    <h1>
                        Medical Patient Records
                    </h1>

                    <p>
                        Patient management and
                        doctor dashboard
                    </p>
                </div>

                <div className="doctor-badge">
                    Doctor Dashboard
                </div>

            </header>


            {/* ================================
                MAIN
            ================================= */}

            <main className="container">


                {/* ================================
                    STATISTICS
                ================================= */}

                <section className="stats">

                    <div className="stat-card">

                        <h3>
                            Total Patients
                        </h3>

                        <strong>
                            {patients.length}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <h3>
                            Medical Records
                        </h3>

                        <strong>
                            {totalMedicalRecords}
                        </strong>

                    </div>


                    <div className="stat-card">

                        <h3>
                            Previous Visits
                        </h3>

                        <strong>
                            {totalVisits}
                        </strong>

                    </div>

                </section>


                {/* ================================
                    SEARCH SECTION
                ================================= */}

                <section className="search-section">

                    <h2>
                        Search Patient
                    </h2>

                    <div className="search-box">

                        <input
                            type="text"
                            placeholder="Search by name, patient ID or phone..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            onKeyDown={handleKeyDown}
                        />

                        <button
                            className="search-button"
                            onClick={handleSearch}
                            disabled={searching}
                        >
                            {searching
                                ? "Searching..."
                                : "Search"}
                        </button>

                        <button
                            className="clear-button"
                            onClick={handleClear}
                        >
                            Clear
                        </button>

                    </div>

                    <p className="search-help">
                        Enter a patient name, patient ID
                        or phone number and click Search.
                    </p>

                </section>


                {/* ================================
                    PATIENT RECORDS
                ================================= */}

                <section className="patients-section">

                    <div className="section-header">

                        <h2>
                            Patient Records
                        </h2>

                        <span>
                            {patients.length} patient(s)
                        </span>

                    </div>


                    {/* Loading */}

                    {loading ? (

                        <p className="message">
                            Loading patients...
                        </p>

                    ) : patients.length === 0 ? (

                        /* No patients */

                        <p className="message">
                            No patients found.
                        </p>

                    ) : (

                        /* Patient cards */

                        <div className="patient-grid">

                            {patients.map(
                                (patient) => (

                                    <div
                                        className="patient-card"
                                        key={patient.id}
                                    >

                                        {/* Patient Header */}

                                        <div className="patient-top">

                                            <div className="avatar">

                                                {patient
                                                    .personalDetails
                                                    .name
                                                    .charAt(0)
                                                    .toUpperCase()}

                                            </div>


                                            <div>

                                                <h3>
                                                    {
                                                        patient
                                                            .personalDetails
                                                            .name
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        patient
                                                            .patientId
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        {/* Patient Information */}

                                        <div className="patient-info">

                                            <p>
                                                <b>
                                                    Age:
                                                </b>{" "}
                                                {
                                                    patient
                                                        .personalDetails
                                                        .age
                                                }
                                            </p>


                                            <p>
                                                <b>
                                                    Gender:
                                                </b>{" "}
                                                {
                                                    patient
                                                        .personalDetails
                                                        .gender
                                                }
                                            </p>


                                            <p>
                                                <b>
                                                    Phone:
                                                </b>{" "}
                                                {
                                                    patient
                                                        .personalDetails
                                                        .phone
                                                }
                                            </p>


                                            <p>
                                                <b>
                                                    Email:
                                                </b>{" "}
                                                {
                                                    patient
                                                        .personalDetails
                                                        .email ||
                                                    "Not provided"
                                                }
                                            </p>


                                            <p>
                                                <b>
                                                    Address:
                                                </b>{" "}
                                                {
                                                    patient
                                                        .personalDetails
                                                        .address ||
                                                    "Not provided"
                                                }
                                            </p>


                                            <p>
                                                <b>
                                                    Allergies:
                                                </b>{" "}

                                                {patient
                                                    .allergies
                                                    .length > 0
                                                    ? patient
                                                          .allergies
                                                          .join(
                                                              ", "
                                                          )
                                                    : "None"}

                                            </p>

                                        </div>


                                        {/* Medical History */}

                                        <div className="record-section">

                                            <h4>
                                                Medical History
                                            </h4>

                                            {patient
                                                .medicalHistory
                                                .length === 0 ? (

                                                <p>
                                                    No medical
                                                    history
                                                </p>

                                            ) : (

                                                patient
                                                    .medicalHistory
                                                    .map(
                                                        (
                                                            history,
                                                            index
                                                        ) => (

                                                            <div
                                                                className="record-item"
                                                                key={
                                                                    index
                                                                }
                                                            >

                                                                <strong>
                                                                    {
                                                                        history.condition
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    Diagnosed:
                                                                    {" "}
                                                                    {
                                                                        history
                                                                            .diagnosedYear
                                                                    }
                                                                </span>

                                                                <p>
                                                                    {
                                                                        history.notes
                                                                    }
                                                                </p>

                                                            </div>
                                                        )
                                                    )

                                            )}

                                        </div>


                                        {/* Previous Visits */}

                                        <div className="record-section">

                                            <h4>
                                                Previous Visits
                                            </h4>

                                            {patient
                                                .visits
                                                .length === 0 ? (

                                                <p>
                                                    No previous
                                                    visits
                                                </p>

                                            ) : (

                                                patient.visits.map(
                                                    (visit) => (

                                                        <div
                                                            className="record-item"
                                                            key={
                                                                visit.id
                                                            }
                                                        >

                                                            <strong>
                                                                {
                                                                    visit.doctor
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    visit.date
                                                                }
                                                            </span>

                                                            <p>
                                                                <b>
                                                                    Reason:
                                                                </b>{" "}
                                                                {
                                                                    visit.reason
                                                                }
                                                            </p>

                                                            <p>
                                                                <b>
                                                                    Diagnosis:
                                                                </b>{" "}
                                                                {
                                                                    visit.diagnosis ||
                                                                    "Not specified"
                                                                }
                                                            </p>

                                                            <p>
                                                                {
                                                                    visit.notes
                                                                }
                                                            </p>

                                                        </div>

                                                    )
                                                )

                                            )}

                                        </div>


                                        {/* Prescriptions */}

                                        <div className="record-section">

                                            <h4>
                                                Prescriptions
                                            </h4>

                                            {patient
                                                .prescriptions
                                                .length === 0 ? (

                                                <p>
                                                    No prescriptions
                                                </p>

                                            ) : (

                                                patient
                                                    .prescriptions
                                                    .map(
                                                        (
                                                            prescription
                                                        ) => (

                                                            <div
                                                                className="record-item"
                                                                key={
                                                                    prescription.id
                                                                }
                                                            >

                                                                <strong>
                                                                    {
                                                                        prescription.medicine
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        prescription.date
                                                                    }
                                                                </span>

                                                                <p>
                                                                    <b>
                                                                        Dosage:
                                                                    </b>{" "}
                                                                    {
                                                                        prescription.dosage
                                                                    }
                                                                </p>

                                                                <p>
                                                                    <b>
                                                                        Duration:
                                                                    </b>{" "}
                                                                    {
                                                                        prescription.duration
                                                                    }
                                                                </p>

                                                                <p>
                                                                    <b>
                                                                        Doctor Notes:
                                                                    </b>{" "}
                                                                    {
                                                                        prescription.doctorNotes
                                                                    }
                                                                </p>

                                                            </div>

                                                        )
                                                    )

                                            )}

                                        </div>


                                        {/* Footer */}

                                        <div className="patient-footer">

                                            <span>
                                                Visits:{" "}
                                                {
                                                    patient
                                                        .visits
                                                        .length
                                                }
                                            </span>

                                            <span>
                                                Prescriptions:{" "}
                                                {
                                                    patient
                                                        .prescriptions
                                                        .length
                                                }
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default App;